import { Router } from "express";
import { demoForm, contactForm } from "../controllers/contactController.js";

const router = Router();

router.post("/demo", demoForm);
router.post("/contact", contactForm);

export default router;
