import express from "express";
import handleChat from "../controllers/chatController.js";
import handleScoreChat from "../controllers/scoreChatController.js";
import { handleChatLog, fetchChatLogs } from "../controllers/chatLogController.js";
import isLoggedIn from "../middleware/isLoggedIn.js";
import { decryptPayload } from "../middleware/CryptoUtil.js";

const router = express.Router();

router.post("/chat", decryptPayload, handleChat);
router.post("/scoreChat", decryptPayload, handleScoreChat);

router.get("/chatLog", isLoggedIn, handleChatLog);
router.post("/chatLogs", isLoggedIn, fetchChatLogs);

export default router;
