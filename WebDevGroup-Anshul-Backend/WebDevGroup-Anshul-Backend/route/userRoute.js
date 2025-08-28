// route/userRouter.js
import express from "express";
import isAuth from "../middleware/isAuth.js";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/getcurrentuser", isAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId); // userId comes from isAuth middleware
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
