import express from "express";
import passport from "passport";
import User from "../models/userModel.js"; // adjust path as needed
import isAuth from "../middleware/isAuth.js";
import { login, logOut, signUp, sendOTP, verifyOTP } from "../controller/authcontroller.js";

const authRouter = express.Router();

// --- Existing routes ---
// Get current logged-in user

authRouter.get("/getcurrentuser", isAuth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
});

// Signup / Login
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logOut);

// OTP routes
authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTP);
// Google login
authRouter.get(
  "/google",
  (req, res, next) => {
    // Assign default role (student) for all new users
    req.session.googleRole = "student";
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" })
);

// Google callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
  async (req, res) => {
    try {
      const email = req.user.email || req.user.emails?.[0]?.value;
      if (!email) return res.redirect("http://localhost:5173/login");

      let user = await User.findOne({ email });

      if (!user) {
        // Create new user with backend-assigned role
        user = await User.create({
          email,
          name: req.user.displayName || "",
          role: req.session.googleRole, // default = student
          isVerified: true,
        });
      }

      // Redirect after successful login
      res.redirect("http://localhost:5173/pr");
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect("http://localhost:5173/login");
    }
  }
);








export default authRouter;
