import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",  // Gmail use karo
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // yaha app password
  },
});

export const sendMail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject: "Your OTP Code",
      html: `
        <h3>Your OTP</h3>
        <p style="font-size:20px;letter-spacing:3px;"><b>${otp}</b></p>
        <p>This code expires in 5 minutes.</p>
      `,
    });
    console.log("✅ OTP sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};


