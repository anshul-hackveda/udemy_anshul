import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },  // required hata diya
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  description: { type: String },
  role: { type: String, enum: ["student", "educator"], default: "student" },
  photoURL: { type: String, default: "" },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref:"User" }],
  isVerified: { type: Boolean, default: false },
  otpHash: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
