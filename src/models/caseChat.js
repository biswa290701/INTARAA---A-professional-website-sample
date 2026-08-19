import { Schema, model } from "mongoose";

const AiChatSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const CaseChatSchema = new Schema({
  sessionId: { type: String, required: true },
  caseid: { type: Number, required: true },
  chat: { type: [AiChatSchema], required: true, default: [] }
  },
  {
    timestamps: true,
  });

CaseChatSchema.index({ sessionId: 1, caseid: 1 }, { unique: true });

const CaseChatModel = model(process.env.CHATHISTORY_COLLECTION, CaseChatSchema);

const CaseSessionIdSchema = new Schema({
  sessionId: { type: String, required: true },
  caseid: { type: Number, required: true },
  conversationId: { type: String, default: undefined },
  parentMessageId: { type: String, default: undefined },
  systemPrompt: { type: String, required: true },
  caseVoiceId: { type: String, required: true }
});

CaseSessionIdSchema.index({ sessionId: 1, caseid: 1 }, { unique: true });
const CaseSessionIdModel = model(process.env.CASESESSIONID_COLLECTION, CaseSessionIdSchema);

async function getCaseChatBySessionIdCaseId(sessionId, caseid) {
  try {
    const caseChatData = await CaseChatModel.findOne({ sessionId: sessionId, caseid: caseid });
    return caseChatData;
  } catch (error) {
    console.error("Error fetching case:", error.message);
    throw error;
  }
}

async function saveCaseChat(sessionId, caseid, question, answer) {
  try {
    let caseChatData = await CaseChatModel.findOne({ sessionId: sessionId, caseid: caseid });
    if (!caseChatData) {
      caseChatData = new CaseChatModel({ sessionId: sessionId, caseid: caseid, chat: [] });
    }
    caseChatData.chat.push({ question: question, answer: answer });
    await caseChatData.save();
  } catch (error) {
    console.error("Error saving case chat:", error.message);
    throw error;
  }
}

async function findCaseSession(sessionId, caseid) {
  try {
    let caseSessionData = await CaseSessionIdModel.findOne({ sessionId: sessionId, caseid: caseid });

    return caseSessionData;
  } catch (error) {
    console.error("Error fetching case session:", error.message);
    throw error;
  }
}

export default getCaseChatBySessionIdCaseId;
export { saveCaseChat, CaseChatModel, findCaseSession, CaseSessionIdModel };
