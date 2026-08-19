import express from "express";
import handleCaseUpload, { serveUploadPage } from "../controllers/caseUploadController.js"
import {  fetchAllCases, ShowAllCases } from "../controllers/caseListController.js";
import multer from "multer";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();
const upload = multer();

router.get("/caseUpload", serveUploadPage);   // serve upload form
router.post("/caseUpload", isLoggedIn, upload.none(), handleCaseUpload);   // handle form submission
router.get("/caseList", isLoggedIn, ShowAllCases);

router.post("/cases", isLoggedIn, fetchAllCases);
export default router;
