import { ChatGPTAPI } from "chatgpt";
import getCaseById from "../models/case.js";
import { encryptPayload } from "../middleware/CryptoUtil.js";

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function handleScoreChat(req, res) {
  try {
    const { sessionId,caseId, messages } = req.body;

    const caseData = await getCaseById(caseId);

    if (!caseData)
      return res.status(404).json({ success: false, message: "Case not found" });

    const scoreChatSystemMessage = `You are an expert evaluator. Your task is to assess the quality of the conversation based on relevance, coherence, and informativeness. The following is json with the scenario and the conversation to rate.
    
    {
        "scenario": "${caseData.CasePrompt}",
        "conversation": ${JSON.stringify(messages)}
    }

    Provide a score from 1 to 10 and a feedback for the score provided, where 1 is very poor and 10 is excellent for each category in the following json and return the json. if the score provided is less than 8, give feedback on how to improve it otherwise provide an affirmative feedback.
    {
    "Relevance": {
        "score": "",
        "feedback": ""
    },
    "Coherence": {
        "score": "",
        "feedback": ""
    },
    "Informativeness": {
        "score": "",
        "feedback": ""
    }
    `

    const reply = await api.sendMessage(scoreChatSystemMessage);

    let cleanText = reply.text;

    // Remove any ```json or ``` code blocks
    cleanText = cleanText.replace(/```json/gi, "");
    cleanText = cleanText.replace(/```/g, "");

    // Trim whitespace
    cleanText = cleanText.trim();

    console.log("Clean GPT Output:", cleanText);

    const jsonResponse = JSON.parse(cleanText);
    let responsePayload=JSON.stringify(jsonResponse);

    return res.status(200).send(encryptPayload(responsePayload));
  } catch (error) {
    console.error("Scoring Chat Error:", error);
    res.status(500);
  }
}

export default handleScoreChat;
