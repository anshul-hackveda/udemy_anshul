import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import AuthIllustration from "../components/AuthIllustration";
import axios from "axios";
import { serverUrl } from "../App";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${serverUrl}/api/auth/send-otp`, {
        name,
        email,
        role,
      });
      toast.success(res.data.message || "OTP sent to your email");
      setStep("otp"); // Show OTP input
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to send OTP");
      setLoading(false);
    }
  };

// ✅ Signup OTP Verify
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const res = await axios.post(
      `${serverUrl}/api/auth/verify-otp`,
      { name, email, role, otp },   // new user details
      { withCredentials: true }
    );

    dispatch(setUserData(res.data.user)); // backend response se user store karo
    toast.success("Signup successful!");
    navigate("/pr"); // home/dashboard pe bhejo
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
          <h1>Sign up and start learning</h1>

          {/* Step 1: User info form */}
          {step === "form" && (
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label htmlFor="fullname">Full name</label>
                <input
                  type="text"
                  id="fullname"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
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
              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="educator">Educator</option>
                </select>
              </div>

              <button type="submit" className="btn-auth" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2: OTP input form */}
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
          <div className="social-login">
  <a href="http://localhost:8000/api/auth/google">
  <button className="social-btn google">Login with Google</button>
</a>

  <button className="social-btn facebook"></button>
  <button className="social-btn apple"></button>
</div>


          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
