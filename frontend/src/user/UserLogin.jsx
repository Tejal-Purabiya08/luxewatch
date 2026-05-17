import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/users/login",
      {
        email,
        password,
      }
    );

    // CLEAN OLD DATA FIRST
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // SAVE NEW DATA
    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    // ROLE BASED NAVIGATION
    if (res.data.user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/home");
    }

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text:
        error.response?.data?.message ||
        "Invalid credentials",
    });
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
              <span className="logo-text">LUXEWATCH</span>
            </div>
            <h1 className="brand-title">Welcome Back</h1>
            <p className="brand-subtitle">Experience luxury timepieces crafted for the distinguished</p>
            
            <div className="brand-features">
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span>Secure Authentication</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <span>Exclusive Collections</span>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <span>24/7 Premium Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="form-section">
          <div className="glass-card">
            <div className="card-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleLogin}>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                  />
                  <span className="input-label">Password</span>
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

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button type="button" className="social-btn google">
                <svg viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button type="button" className="social-btn apple">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
              <button type="button" className="social-btn facebook">
                <svg viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            <div className="card-footer">
              <p>
                Don&apos;t have an account? <Link to="/register">Create Account</Link>
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

        /* Form Options */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
        }

        .remember-me input {
          display: none;
        }

        .checkmark {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          position: relative;
          transition: all 0.3s ease;
        }

        .remember-me input:checked ~ .checkmark {
          background: linear-gradient(135deg, #c9a962 0%, #d4af37 100%);
          border-color: #c9a962;
        }

        .remember-me input:checked ~ .checkmark::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid #0a0a0f;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .forgot-link {
          font-size: 13px;
          color: #c9a962;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .forgot-link:hover {
          color: #d4af37;
          text-decoration: underline;
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

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          margin: 28px 0;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        .divider span {
          padding: 0 16px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Social Login */
        .social-login {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 28px;
        }

        .social-btn {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .social-btn:hover {
          border-color: rgba(201, 169, 98, 0.3);
          background: rgba(201, 169, 98, 0.05);
          transform: translateY(-2px);
        }

        .social-btn svg {
          width: 22px;
          height: 22px;
        }

        .social-btn.apple svg {
          color: #ffffff;
        }

        /* Card Footer */
        .card-footer {
          text-align: center;
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

          .form-options {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .social-btn {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
}

export default UserLogin;
