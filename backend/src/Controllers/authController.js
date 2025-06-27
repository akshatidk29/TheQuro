import bcrypt from "bcryptjs";

import Otp from "../Models/otpModal.js";
import User from "../Models/userModel.js";

import { sendOtpEmail } from "./sendOtpEmail.js";
import { generateToken } from "../Lib/utils.js";


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.deleteMany({ email });
    await Otp.create({ email, code: otpCode, expiresAt });

    await sendOtpEmail(email, otpCode);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const verifyOtp = async (req, res) => {
  const { fullName, email, password, otp } = req.body;

  try {
    const otpEntry = await Otp.findOne({ email, code: otp });

    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    await Otp.deleteMany({ email });

    generateToken(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("OTP verification error:", err.message);
    res.status(500).json({ message: "OTP verification failed" });
  }
};






export const googleSignup = async (req, res) => {
  const { fullName, email, profilePic } = req.body;

  try {
    if (!email || !fullName) {
      return res.status(400).json({ message: "Missing data from Google Auth" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "This email is already registered via OTP" });
    }

    user = await User.create({
      fullName,
      email,
      profilePic,
      password: "heyyyyy",
    });


    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("Google Auth error:", err.message);
    res.status(500).json({ message: "Google Auth failed" });
  }
};

export const googleLogin = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found with this Google email" });
    }

    generateToken(user._id, res); 

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(500).json({ message: "Google Login failed" });
  }
};


