import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="modern-loader-wrapper">
        <div className="quantum-spinner"></div>
        <p className="loader-text">Compiling secure profile records...</p>
      </div>
    );
  }

  return (
    <div className="profile-dashboard-root">
      <div className="container py-4 px-md-5">
        
        {/* TOP INTERACTIVE NAVBAR */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <motion.button 
            className="btn-back-action"
            onClick={() => navigate(-1)}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className="bi bi-arrow-left"></i>
            <span>Return to Directory</span>
          </motion.button>
          
          <div className="system-uid-pill shadow-sm">
            <span className="label">SECURE INTEGRITY TOKEN</span>
            <span className="value">#{user._id ? user._id.slice(-8).toUpperCase() : "------"}</span>
          </div>
        </div>

        <div className="row g-4">
          
          {/* LEFT COLUMN: IDENTITY MANIFESTO */}
          <div className="col-xl-4 col-lg-5">
            <motion.div 
              className="identity-master-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="identity-banner-graphic"></div>
              
              <div className="identity-body text-center">
                <div className="avatar-wrapper-prime">
                  <div className="avatar-canvas-inner">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className={`status-signal-ring ${user.status === 'inactive' ? 'signal-offline' : 'signal-online'}`}></div>
                </div>

                <h3 className="identity-title-name">{user.name || "Anonymous Persona"}</h3>
                <div className="identity-badge-role">{user.role || "Standard Access Tier"}</div>

                <div className="metric-strips-container">
                  <div className="metric-strip-item">
                    <span className="lbl">Operational Status</span>
                    <span className={`val status-pill-text ${user.status === 'inactive' ? 'is-disabled' : 'is-functional'}`}>
                      {user.status === 'inactive' ? 'Inactive Record' : 'Active Channel'}
                    </span>
                  </div>
                  <div className="metric-strip-item">
                    <span className="lbl">Identity Check</span>
                    <span className="val text-indigo d-flex align-items-center gap-1">
                      <i className="bi bi-shield-check-fill"></i> Verified Core
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: REPOSITORIES AND METRICS */}
          <div className="col-xl-8 col-lg-7">
            <motion.div 
              className="repository-details-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            >
              <div className="repository-header">
                <div className="title-icon-cluster">
                  <div className="icon-shield-base">
                    <i className="bi bi-fingerprint"></i>
                  </div>
                  <div>
                    <h4 className="card-heading-main">Cryptographic Profile Payload</h4>
                    <p className="card-heading-sub">System relational metadata nodes and internal structural references.</p>
                  </div>
                </div>
              </div>

              <div className="repository-grid-layout">
                
                {/* GRID ITEM: EMAIL */}
                <div className="meta-grid-item">
                  <div className="meta-icon-hex"><i className="bi bi-envelope-open"></i></div>
                  <div className="meta-content-wrap">
                    <span className="meta-label">Primary Gateway Email</span>
                    <p className="meta-data-text">{user.email || "No email mapping registered."}</p>
                  </div>
                </div>

                {/* GRID ITEM: PHONE */}
                <div className="meta-grid-item">
                  <div className="meta-icon-hex"><i className="bi bi-phone-vibrate"></i></div>
                  <div className="meta-content-wrap">
                    <span className="meta-label">Encrypted Comms Number</span>
                    <p className="meta-data-text">{user.phone || "No terminal interface configured."}</p>
                  </div>
                </div>

                {/* GRID ITEM: CITY */}
                <div className="meta-grid-item">
                  <div className="meta-icon-hex"><i className="bi bi-geo-alt"></i></div>
                  <div className="meta-content-wrap">
                    <span className="meta-label">Deployment Node City</span>
                    <p className="meta-data-text">{user.city || "Unassigned Operations Region"}</p>
                  </div>
                </div>

                {/* GRID ITEM: DATE */}
                <div className="meta-grid-item">
                  <div className="meta-icon-hex"><i className="bi bi-hdd-network"></i></div>
                  <div className="meta-content-wrap">
                    <span className="meta-label">Onboarding Epoch Timestamp</span>
                    <p className="meta-data-text">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "System Age Unknown"}
                    </p>
                  </div>
                </div>

                {/* GRID ITEM: FULL ADDRESS */}
                <div className="meta-grid-item span-full-width">
                  <div className="meta-icon-hex"><i className="bi bi-map"></i></div>
                  <div className="meta-content-wrap">
                    <span className="meta-label">Physical Coordinates Vector</span>
                    <p className="meta-data-text text-fallback-muted">
                      {user.address || "The secure entity registry contains no structural physical localized routing vector coordinates."}
                    </p>
                  </div>
                </div>

                {/* GRID ITEM: SYSTEM UID */}
                <div className="meta-grid-item span-full-width hardware-highlight-card">
                  <div className="meta-icon-hex system-hex"><i className="bi bi-terminal-box"></i></div>
                  <div className="meta-content-wrap w-100">
                    <span className="meta-label text-blue-muted">Global System Node ID String</span>
                    <div className="d-flex align-items-center justify-content-between mt-1 flex-wrap gap-2">
                      <code className="system-raw-uid">{user._id || "NULL_ID_STRING"}</code>
                      <span className="badge-system-active">READ-ONLY</span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* CORE DESIGN SYSTEM STYLESHEET */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .profile-dashboard-root {
          background-color: #f6f8fc;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #2d3748;
          padding-top: 1.5rem;
        }

        /* BACK ACTION NAVIGATION */
        .btn-back-action {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 10px 18px;
          border-radius: 12px;
          color: #312e81;
          font-weight: 700;
          font-size: 13px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-back-action i {
          font-size: 15px;
          font-weight: bold;
        }
        .btn-back-action:hover {
          background: #1e1b4b;
          color: #ffffff;
          border-color: #1e1b4b;
          box-shadow: 0 10px 15px -3px rgba(30, 27, 75, 0.15);
        }

        /* SYSTEM ID BAR */
        .system-uid-pill {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 6px 14px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .system-uid-pill .label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #94a3b8;
        }
        .system-uid-pill .value {
          font-family: 'Monaco', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #1e293b;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 5px;
        }

        /* LEFT IDENTITY PANEL CARD */
        .identity-master-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px -2px rgba(148, 163, 184, 0.08) !important;
        }
        .identity-banner-graphic {
          height: 90px;
          background: linear-gradient(135deg, #312e81 0%, #4f46e5 100%);
          position: relative;
        }
        .identity-body {
          padding: 0 24px 32px 24px;
          margin-top: -45px;
        }
        .avatar-wrapper-prime {
          position: relative;
          display: inline-block;
          margin-bottom: 16px;
        }
        .avatar-canvas-inner {
          width: 96px;
          height: 96px;
          background: #ffffff;
          border: 4px solid #ffffff;
          box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 38px;
          font-weight: 800;
          color: #4f46e5;
          background: linear-gradient(to bottom right, #ffffff, #f5f3ff);
        }
        .status-signal-ring {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          border: 3.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .signal-online { background-color: #10b981; }
        .signal-offline { background-color: #f43f5e; }

        .identity-title-name {
          font-size: 20px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .identity-badge-role {
          display: inline-block;
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 14px;
          border-radius: 99px;
          font-weight: 700;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          margin-bottom: 24px;
        }

        .metric-strips-container {
          background: #f8fafc;
          border-radius: 16px;
          padding: 4px;
          border: 1px solid #f1f5f9;
        }
        .metric-strip-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
        }
        .metric-strip-item:not(:last-child) {
          border-bottom: 1px solid #edf2f7;
        }
        .metric-strip-item .lbl {
          font-size: 11px;
          color: #718096;
          font-weight: 600;
        }
        .metric-strip-item .val {
          font-size: 12px;
          font-weight: 700;
        }
        .text-indigo { color: #4f46e5; }
        .status-pill-text.is-functional { color: #059669; }
        .status-pill-text.is-disabled { color: #dc2626; }

        /* RIGHT REPOSITORY STRUCTURAL DETAILS */
        .repository-details-card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          padding: 32px;
          box-shadow: 0 4px 20px -2px rgba(148, 163, 184, 0.08) !important;
        }
        .repository-header {
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 20px;
          margin-bottom: 24px;
        }
        .title-icon-cluster {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .icon-shield-base {
          width: 44px;
          height: 44px;
          background: #f5f3ff;
          border-radius: 12px;
          color: #6366f1;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .card-heading-main {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .card-heading-sub {
          font-size: 12px;
          color: #64748b;
          margin: 2px 0 0 0;
        }

        /* GRID SPECIFICS */
        .repository-grid-layout {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .meta-grid-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 18px;
          background: #f8fafc;
          border-radius: 16px;
          border: 1px solid #f1f5f9;
          transition: all 0.2s ease;
        }
        .meta-grid-item:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px -2px rgba(50,50,93,0.04);
        }
        .meta-icon-hex {
          color: #64748b;
          font-size: 16px;
          margin-top: 2px;
        }
        .meta-content-wrap {
          display: flex;
          flex-direction: column;
        }
        .meta-label {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .meta-data-text {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin: 0;
          line-height: 1.4;
        }
        .text-fallback-muted {
          font-weight: 500;
          color: #64748b;
        }
        .span-full-width {
          grid-column: span 2;
        }

        /* HARDWARE SYSTEM BLOCK HIGHLIGHT */
        .hardware-highlight-card {
          background: #f0f7ff;
          border: 1px dashed #93c5fd;
        }
        .hardware-highlight-card:hover {
          background: #f0f7ff;
          border-color: #3b82f6;
        }
        .system-hex { color: #2563eb; }
        .text-blue-muted { color: #60a5fa; }
        .system-raw-uid {
          font-family: 'SFMono-Regular', Consolas, monospace;
          font-size: 14px;
          font-weight: 700;
          color: #1e3a8a;
          letter-spacing: 0.5px;
        }
        .badge-system-active {
          background: #3b82f6;
          color: #ffffff;
          font-size: 9px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        /* QUANTUM PRECISE LOADER */
        .modern-loader-wrapper {
          height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .quantum-spinner {
          width: 40px;
          height: 40px;
          border: 3.5px solid #cbd5e1;
          border-top: 3.5px solid #4f46e5;
          border-radius: 50%;
          animation: criticalRotation 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          margin-bottom: 16px;
        }
        .loader-text {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
        }
        @keyframes criticalRotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* RESPONSIVE LAYOUT BREAKS */
        @media (max-width: 991px) {
          .repository-grid-layout {
            grid-template-columns: 1fr;
          }
          .span-full-width {
            grid-column: span 1;
          }
          .repository-details-card {
            padding: 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default UserDetails;