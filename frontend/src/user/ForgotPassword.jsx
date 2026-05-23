import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Swal from "sweetalert2";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/api/users/forgot-password", { email });
      Swal.fire("Success", res.data.message, "success");
      setStep(2);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await API.post("/api/users/reset-password", {
        email,
        otp,
        newPassword,
      });
      Swal.fire("Success", res.data.message, "success");
      navigate("/"); // Password reset hone ke baad login page par redirect
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated Background Elements */}
      <div className="bg-gradient"></div>
      <div className="bg-pattern"></div>
      
      {/* Floating Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>

      {/* Glow Effects */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="brand-section">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <span className="logo-text">LUXE WATCH</span>
            </div>
            <h1 className="brand-title">Reset Security</h1>
            <p className="brand-subtitle">Recover your exclusive account access effortlessly</p>
            
            <div className="brand-features">
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span>Encrypted Recovery</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <span>Instant OTP Verification</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-section">
          <div className="glass-card">
            
            {step === 1 ? (
              <>
                <div className="card-header">
                  <h2>Forgot Password</h2>
                  <p>Enter your email address to receive a verification OTP</p>
                </div>

                <form onSubmit={handleSendOtp}>
                  <div className="input-group">
                    <div className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                    </div>
                    <div className="input-box">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder=" "
                      />
                      <span className="input-label">Email Address</span>
                      <span className="input-highlight"></span>
                    </div>
                  </div>

                  <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? (
                      <span className="loader"></span>
                    ) : (
                      <>
                        <span>Send OTP</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="card-header">
                  <h2>Reset Password</h2>
                  <p>Create a secure new password for your account</p>
                </div>

                <form onSubmit={handleResetPassword}>
                  {/* OTP Input */}
                  <div className="input-group">
                    <div className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                    </div>
                    <div className="input-box">
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder=" "
                      />
                      <span className="input-label">Enter OTP</span>
                      <span className="input-highlight"></span>
                    </div>
                  </div>

                  {/* New Password Input */}
                  <div className="input-group">
                    <div className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                    <div className="input-box">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder=" "
                      />
                      <span className="input-label">New Password</span>
                      <span className="input-highlight"></span>
                    </div>
                    <button 
                      type="button" 
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>

                  <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? (
                      <span className="loader"></span>
                    ) : (
                      <>
                        <span>Reset Password</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="card-footer" style={{ marginTop: "24px" }}>
              <p>
                Remembered your password? <Link to="/">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #0a0a0f;
          font-family: 'Inter', sans-serif;
          overflow: hidden;
          position: relative;
          padding: 20px;
        }

        /* Background Effects */
        .bg-gradient {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 20%, rgba(201, 169, 98, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(201, 169, 98, 0.05) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(30, 30, 45, 0.5) 0%, transparent 70%);
        }

        .bg-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(201, 169, 98, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 169, 98, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: patternMove 20s linear infinite;
        }

        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        /* Floating Orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.4;
          animation: float 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #c9a962 0%, #8b7355 100%);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          top: 50%;
          right: -50px;
          animation-delay: -2s;
        }

        .orb-3 {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #c9a962 0%, #d4af37 100%);
          bottom: -50px;
          left: 30%;
          animation-delay: -4s;
        }

        .orb-4 {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #2c2c4a 0%, #1a1a2e 100%);
          top: 20%;
          right: 20%;
          animation-delay: -6s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        /* Glow Effects */
        .glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .glow-1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%);
          top: -200px;
          right: -200px;
        }

        .glow-2 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%);
          bottom: -150px;
          left: -150px;
        }

        /* Main Container */
        .login-container {
          display: flex;
          width: 100%;
          max-width: 1100px;
          min-height: 650px;
          background: rgba(15, 15, 25, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(201, 169, 98, 0.15);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(201, 169, 98, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 10;
        }

        /* Brand Section */
        .brand-section {
          flex: 1;
          background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1a 100%);
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .brand-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 30% 70%, rgba(201, 169, 98, 0.1) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a962' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .brand-content {
          position: relative;
          z-index: 1;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #c9a962 0%, #d4af37 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(201, 169, 98, 0.3);
        }

        .logo-icon svg {
          width: 28px;
          height: 28px;
          color: #0a0a0f;
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 600;
          color: #c9a962;
          letter-spacing: 3px;
        }

        .brand-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .brand-subtitle {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 50px;
          max-width: 320px;
          }

        .brand-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .feature-icon {
          width: 44px;
          height: 44px;
          background: rgba(201, 169, 98, 0.1);
          border: 1px solid rgba(201, 169, 98, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon svg {
          width: 20px;
          height: 20px;
          color: #c9a962;
        }

        .feature span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        /* Form Section */
        .form-section {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          background: rgba(255, 255, 255, 0.02);
        }

        .glass-card {
          width: 100%;
          max-width: 400px;
        }

        .card-header {
          margin-bottom: 35px;
          text-align: center;
        }

        .card-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8px;
        }

        .card-header p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Input Groups */
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .input-group:focus-within {
          border-color: rgba(201, 169, 98, 0.5);
          background: rgba(201, 169, 98, 0.03);
          box-shadow: 0 0 0 3px rgba(201, 169, 98, 0.1);
        }

        .input-icon {
          padding: 0 16px;
          display: flex;
          align-items: center;
        }

        .input-icon svg {
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
        }

        .input-group:focus-within .input-icon svg {
          color: #c9a962;
        }

        .input-box {
          flex: 1;
          position: relative;
        }

        .input-box input {
          width: 100%;
          padding: 18px 0;
          font-size: 15px;
          color: #ffffff;
          border: none;
          outline: none;
          background: transparent;
          font-family: 'Inter', sans-serif;
        }

        .input-box input::placeholder {
          color: transparent;
        }

        .input-label {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .input-box input:focus ~ .input-label,
        .input-box input:not(:placeholder-shown) ~ .input-label {
          top: 8px;
          font-size: 11px;
          color: #c9a962;
        }

        .toggle-password {
          padding: 0 16px;
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
        }

        .toggle-password svg {
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.4);
          transition: color 0.3s ease;
        }

        .toggle-password:hover svg {
          color: #c9a962;
        }

        /* Login Button */
        .login-button {
          width: 100%;
          padding: 16px 24px;
          border-radius: 12px;
          border: none;
          outline: none;
          background: linear-gradient(135deg, #c9a962 0%, #d4af37 100%);
          color: #0a0a0f;
          font-weight: 600;
          cursor: pointer;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        .login-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .login-button:hover::before {
          left: 100%;
        }

        .login-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(201, 169, 98, 0.4);
        }

        .login-button:active {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .login-button svg {
          width: 18px;
          height: 18px;
          transition: transform 0.3s ease;
        }

        .login-button:hover svg {
          transform: translateX(4px);
        }

        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid #0a0a0f;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .card-footer p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        .card-footer a {
          color: #c9a962;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .card-footer a:hover {
          color: #d4af37;
          text-decoration: underline;
        }

        /* Responsive */
        @media (max-width: 900px) {
          .login-container {
            flex-direction: column;
            max-width: 480px;
          }

          .brand-section {
            padding: 40px 30px;
          }

          .brand-title {
            font-size: 32px;
          }

          .brand-subtitle {
            margin-bottom: 30px;
          }

          .brand-features {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 12px;
          }

          .feature {
            flex: 1;
            min-width: 140px;
          }

          .form-section {
            padding: 30px;
          }
        }

        @media (max-width: 480px) {
          .login-page {
            padding: 10px;
          }

          .login-container {
            border-radius: 16px;
          }

          .brand-section {
            padding: 30px 20px;
          }

          .brand-logo {
            margin-bottom: 24px;
          }

          .logo-icon {
            width: 40px;
            height: 40px;
          }

          .logo-text {
            font-size: 20px;
          }

          .brand-title {
            font-size: 26px;
          }

          .brand-features {
            display: none;
          }

          .form-section {
            padding: 24px 20px;
          }

          .card-header h2 {
            font-size: 26px;
          }
        }
      `}</style>
    </div>
  );
}

export default ForgotPassword;