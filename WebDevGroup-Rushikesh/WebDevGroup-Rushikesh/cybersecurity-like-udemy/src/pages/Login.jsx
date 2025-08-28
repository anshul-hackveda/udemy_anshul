import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import AuthIllustration from "../components/AuthIllustration";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Step 1: Send OTP
 const handleSendOtp = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const res = await axios.post(`${serverUrl}/api/auth/send-otp`, {
      email,
    }, { withCredentials: true });
    toast.success(res.data.message || "OTP sent to your email");
    setStep("otp");
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};
// ✅ Login OTP Verify
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const res = await axios.post(
      `${serverUrl}/api/auth/verify-otp`,
      { email, otp },   // sirf login ke liye OTP
      { withCredentials: true }
    );

    dispatch(setUserData(res.data.user));
    toast.success("Login successful!");
    navigate("/pr"); // dashboard/profile pe bhejo
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Invalid OTP");
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="auth-container">
      <div className="auth-illustration">
        <AuthIllustration />
      </div>

      <div className="auth-form-container">
        <div className="auth-form">
          <h1>Log in to your Hackveda account</h1>

          {step === "form" && (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  required
                  placeholder="Enter the OTP sent to your email"
                />
              </div>
              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          <p className="auth-switch">
            Don’t have an account? <Link to="/signup">Sign up</Link>
          </p>
           <div className="social-login">
         <a href="http://localhost:8000/api/auth/google">
  <button className="social-btn google">Login with Google</button>
</a>


            <button className="social-btn facebook"></button>
            <button className="social-btn apple"></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

