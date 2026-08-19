import { Router } from "express";
import { signIn, signUp, logout, loginHandler } from "../controllers/authController.js";

const router = Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.get("/logout", logout);
router.get("/login", loginHandler);

export default router;

