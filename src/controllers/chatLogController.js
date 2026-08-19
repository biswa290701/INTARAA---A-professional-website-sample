import { CaseChatModel } from "../models/caseChat.js";

// GET → Serve upload page
export const handleChatLog = (req, res) => {
  res.redirect("/caseLog.html");
};

export const fetchChatLogs = async (req, res) => {
  try {
    const caseChats = await CaseChatModel.find().sort({ CaseId: 1 });

    res.json({
      success: true,
      caseChats
    });

  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cases",
      details: err.message
    });
  }
}
