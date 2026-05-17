  import { useNavigate } from "react-router-dom";
  import { useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";

  function Navbar() {
    const navigate = useNavigate();

    // ✅ LocalStorage user parsing fix applied
  const admin = JSON.parse(localStorage.getItem("user"));
    const [showCanvas, setShowCanvas] = useState(false);

    const handleLogout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    };

    const adminName = admin?.name || "Administrator";
    const firstLetter = adminName.charAt(0).toUpperCase();

    return (
      <>
        <nav className="admin-navbar">
          {/* LEFT */}
          <div className="nav-left">
            <div className="brand-logo">
              <i className="bi bi-layers-half"></i>
            </div>

            <div className="brand-info">
              <h5 className="mb-0 fw-bold">
                Admin<span className="text-blue">Core</span>
              </h5>

              <div className="status-badge">
                <span className="dot"></span> System Online
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="nav-right">
            <div className="admin-details d-none d-md-flex">
              <span className="name">{adminName}</span>
              <span className="role">{admin?.role || "Admin"}</span>
            </div>

            <div
              className="profile-action"
              onClick={() => setShowCanvas(true)}
            >
              <div className="avatar-box">
                {firstLetter}
              </div>

              <div className="settings-trigger">
                <i className="bi bi-command"></i>
              </div>
            </div>
          </div>
        </nav>

        {/* BACKDROP & SIDEBAR DRAWER SYSTEM */}
        <AnimatePresence>
          {showCanvas && (
            <>
              {/* BACKDROP (Fixed layered on top with blur effect) */}
              <motion.div
                className="canvas-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCanvas(false)}
              />

              {/* DRAWER CONTAINER */}
              <motion.div
                className="canvas-drawer"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
              >
                {/* HEADER */}
                <div className="drawer-header">
                  <div className="user-profile-large">
                    <div className="big-avatar">
                      {firstLetter}
                    </div>

                    <div className="ms-3">
                      <h5 className="mb-0 fw-bold">{adminName}</h5>
                      <p className="mb-0 text-muted small">
                        {admin?.email || "No Email Found"}
                      </p>
                    </div>
                  </div>

                  <button
                    className="close-drawer"
                    onClick={() => setShowCanvas(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {/* MENU CONTENT */}
                <div className="drawer-body">
                  <p className="menu-label">Main Navigation</p>

                  <div className="menu-grid">
                    <button
                      className="menu-btn"
                      onClick={() => {
                        navigate("/admin/profile");
                        setShowCanvas(false);
                      }}
                    >
                      <div className="icon-box blue">
                        <i className="bi bi-speedometer2"></i>
                      </div>
                      <span>Profile</span>
                    </button>

                    <button
                      className="menu-btn"
                      onClick={() => {
                        navigate("/admin/products");
                        setShowCanvas(false);
                      }}
                    >
                      <div className="icon-box orange">
                        <i className="bi bi-box-seam"></i>
                      </div>
                      <span>Products</span>
                    </button>
                  </div>

                  <div className="drawer-divider"></div>

                  <button
                    className="menu-btn logout"
                    onClick={handleLogout}
                  >
                    <div className="icon-box red">
                      <i className="bi bi-door-open"></i>
                    </div>
                    <span>Logout</span>
                  </button>
                </div>

                {/* FOOTER */}
                <div className="drawer-footer">
                  <p>© 2026 Admin Panel • v2.1</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* STYLES (Fixed Z-indexes and layout layering issues) */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

          .admin-navbar {
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 40px;
            background: #ffffff;
            border-bottom: 1px solid #f1f5f9;
            position: sticky;
            top: 0;
            z-index: 999; /* Higher than dashboard sections but below drawer portals */
            box-shadow: 0 2px 10px rgba(0,0,0,0.02);
          }

          .nav-left {
            display: flex;
            gap: 14px;
            align-items: center;
          }

          .brand-logo {
            font-size: 24px;
            color: #3498db;
            display: flex;
            align-items: center;
          }

          .brand-info h5 {
            font-size: 16px;
            color: #0f172a;
          }

          .text-blue {
            color: #3498db;
          }

          .status-badge {
            font-size: 11px;
            color: #10b981;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 1px;
          }

          .dot {
            width: 7px;
            height: 7px;
            background: #10b981;
            border-radius: 50%;
            display: inline-block;
            box-shadow: 0 0 8px #10b981;
          }

          .nav-right {
            display: flex;
            gap: 20px;
            align-items: center;
          }

          .admin-details {
            display: flex;
            flex-direction: column;
            text-align: right;
          }

          .admin-details .name {
            font-weight: 700;
            font-size: 14px;
            color: #1f2937;
          }

          .admin-details .role {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }

          .profile-action {
            display: flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            padding: 4px;
            border-radius: 30px;
            transition: background 0.2s ease;
          }

          .profile-action:hover {
            background: #f8fafc;
          }

          .avatar-box {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            font-weight: 700;
            font-size: 15px;
            box-shadow: 0 4px 10px rgba(52, 152, 219, 0.25);
          }

          .settings-trigger {
            font-size: 18px;
            color: #94a3b8;
            transition: transform 0.3s ease, color 0.2s;
          }

          .profile-action:hover .settings-trigger {
            color: #0f172a;
            transform: rotate(45deg);
          }

          /* 🔴 FIXED BACKDROP LAYER OVERLAY */
          .canvas-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(5px);
            -webkit-backdrop-filter: blur(5px);
            z-index: 99998; /* High value layer forces overlay above cards */
          }

          /* 🔴 FIXED DRAWER LAYERING */
          .canvas-drawer {
            position: fixed;
            right: 0;
            top: 0;
            width: 360px;
            height: 100vh;
            background: #ffffff;
            box-shadow: -10px 0 40px rgba(15, 23, 42, 0.15);
            padding: 30px;
            display: flex;
            flex-direction: column;
            z-index: 99999; /* Supreme index element overrides all views */
          }

          .drawer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 35px;
          }

          .user-profile-large {
            display: flex;
            align-items: center;
          }

          .big-avatar {
            width: 56px;
            height: 56px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
          }

          .close-drawer {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            border: none;
            background: #f1f5f9;
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
          }

          .close-drawer:hover {
            background: #fee2e2;
            color: #ef4444;
          }

          .menu-label {
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            color: #94a3b8;
            letter-spacing: 0.8px;
            margin-bottom: 14px;
          }

          .menu-grid {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .menu-btn {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 12px;
            width: 100%;
            border: 1px solid transparent;
            border-radius: 12px;
            background: #f8fafc;
            color: #475569;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
          }

          .menu-btn:hover {
            background: #f1f5f9;
            color: #0f172a;
            transform: translateX(4px);
          }

          .icon-box {
            width: 34px;
            height: 34px;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
          }

          .blue { background: #eef2ff; color: #4f46e5; }
          .orange { background: #fff7ed; color: #f97316; }
          .red { background: #fff1f2; color: #e11d48; }

          .drawer-divider {
            height: 1px;
            background: #e2e8f0;
            margin: 24px 0;
          }

          .logout {
            background: #fff1f2;
            color: #e11d48;
          }
          
          .logout:hover {
            background: #ffe4e6;
            color: #be123c;
          }

          .drawer-footer {
            margin-top: auto;
            text-align: center;
            padding-top: 15px;
            border-top: 1px solid #f1f5f9;
            font-size: 12px;
            color: #cbd5e1;
          }

          @media (max-width: 768px) {
            .admin-navbar { padding: 12px 20px; }
            .canvas-drawer { width: 100%; } /* Handheld view responsive switch */
          }
        `}</style>
      </>
    );
  }

  export default Navbar;