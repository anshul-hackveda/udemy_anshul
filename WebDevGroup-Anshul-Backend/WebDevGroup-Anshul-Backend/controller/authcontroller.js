import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getToken from "../config/token.js";
import { sendMail } from "../config/mailer.js";

// 🔐 Helper: Generate 6-digit OTP
const genOTP = () => String(Math.floor(100000 + Math.random() * 900000));

// ✅ SEND OTP (Signup Step 1)
export const sendOTP = async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email) return res.status(400).json({ message: "Email required" });

    let user = await User.findOne({ email });

    // Create new user if not exists
    if (!user) {
      user = await User.create({
        email,
        name: name || "",
        role: role || "student",
      });
    } else {
      // Optional: update name or role if user exists and they are not set
      if (!user.name && name) user.name = name;
      if (!user.role && role) user.role = role;
    }

    const otp = genOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    user.otpHash = otpHash;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    user.isVerified = false;
    await user.save();

    await sendMail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ VERIFY OTP (Signup Step 2)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email + OTP required" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.otpHash || !user.otpExpires) {
      return res.status(400).json({ message: "OTP not requested" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(String(otp), user.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpires = null;

    // If role changed in frontend (e.g. selected "educator" now), update it
    if (role && user.role !== role) {
      user.role = role;
    }

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true in production (HTTPS)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "OTP Verified & Logged in", user });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};

// ✅ OPTIONAL: PASSWORD-BASED SIGNUP (not used with OTP)
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Enter valid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Enter a strong password" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role: role || "student",
    });

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = getToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ LOGOUT
export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};




