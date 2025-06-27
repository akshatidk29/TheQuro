import express from "express";
import { protectRoute } from "../Middleware/authMiddleware.js"
import { checkAuth, googleLogin, googleSignup, login, logout, signup, verifyOtp } from "../Controllers/authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);

router.post("/signup/google", googleSignup);
router.post("/login/google", googleLogin);

router.get("/check", protectRoute, checkAuth);

export default router;