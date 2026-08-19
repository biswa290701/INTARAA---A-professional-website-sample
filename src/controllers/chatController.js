import { ChatGPTAPI } from "chatgpt";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import getCaseById from "../models/case.js";
import { saveCaseChat, CaseSessionIdModel, findCaseSession } from "../models/caseChat.js";
import { encryptPayload } from "../middleware/CryptoUtil.js";

let WillGenerateAudio = true;

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

async function handleChat(req, res) {
  try {
    const { sessionId, caseId,isAudioGenerated,message } = req.body;

    /***********************
     * SESSION INITIALIZATION
    ***********************/
    let foundSession = await findCaseSession(sessionId, caseId);
    if (!foundSession) {
      const caseData = await getCaseById(caseId);

      if (!caseData)
        return res.status(404).json({ success: false, message: "Case not found" });

      foundSession = new CaseSessionIdModel({
        sessionId: sessionId,
        caseid: caseId,
        systemPrompt: caseData.CasePrompt,
        caseVoiceId: caseData.CaseVoiceId
      });
    }


    /***********************
     * GPT RESPONSE
     ***********************/
    const Gptreply = await api.sendMessage(message, {
      systemMessage: foundSession.systemPrompt,
      conversationId: foundSession.conversationId,
      parentMessageId: foundSession.parentMessageId,
    });


    // Update session memory
    foundSession.conversationId = Gptreply.conversationId;
    foundSession.parentMessageId = Gptreply.id;

    

    const GptreplyJson = JSON.parse(Gptreply.text);
    const reply = GptreplyJson.reply;
    const emotion = GptreplyJson.emotion;

    WillGenerateAudio=isAudioGenerated;

    let base64audio = null;

    if (WillGenerateAudio)
      base64audio = await GenAudio(foundSession.caseVoiceId, reply, 0.8);

    setImmediate(async () => {
      try {
        await foundSession.save();
        await saveCaseChat(sessionId, caseId, message, reply);
      } catch (err) {
        console.error("DB Save Error:", err);
      }
    });
 
    let responsePayload = JSON.stringify({
      success: true,
      response: reply,
      audio: base64audio,
      emotion: emotion
    });
    console.log(encryptPayload(responsePayload));
    return res.send(encryptPayload(responsePayload));

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      success: false,
      response: error.message,
      audio: null,
    });
  }
}

export default handleChat;

async function GenAudio(CaseVoiceId, replyTxt, speed) {
  const audio = await elevenlabs.textToSpeech.convert(CaseVoiceId, {
    text: replyTxt,
    modelId: "eleven_multilingual_v2",
    voiceSettings: {
      speed: speed
    }
  });

  let chunks = [];
  for await (const chunk of audio) chunks.push(chunk);

  return Buffer.concat(chunks).toString("base64");
}

