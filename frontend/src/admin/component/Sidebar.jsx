import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "bi-grid-1x2" },
    { name: "Users", path: "/admin/users", icon: "bi-people" },
    { name: "Products", path: "/admin/products", icon: "bi-watch" },
    { name: "Orders", path: "/admin/orders", icon: "bi-cart3" },
  ];

  return (
    <>
      <div className="sidebar-container custom-scrollbar">
        {/* BRAND */}
        <div className="brand-section mb-5">
          <div className="logo-box">
            <i className="bi bi-watch"></i>
          </div>

          <div className="brand-text">
            <h5 className="logo-title">
              LUXE<span className="text-blue">WATCH</span>
            </h5>

            <span className="version-tag">v2.4 PRO</span>
          </div>
        </div>

        {/* MENU */}
        <ul className="nav-list">
          <p className="menu-header">Menu</p>

          {menuItems.map((item) => {
            const isActive =
              location.pathname.startsWith(item.path) ||
              (location.pathname.startsWith("/admin/product") &&
                item.path === "/admin/products") ||
              (location.pathname === "/admin/profile" && item.path === "/admin/dashboard");

            return (
              <motion.li
                key={item.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="nav-item"
              >
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <div
                    className={`icon-wrapper ${isActive ? "active-icon" : ""}`}
                  >
                    <i className={`bi ${item.icon}`}></i>
                  </div>

                  <span className="link-text">{item.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="active-pill"
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>

      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .sidebar-container {
          width: 280px;
          height: 100vh;
          background: #071126;
          color: #f8fafc;
          padding: 30px 20px;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow-y: auto;

          border-right: 1px solid rgba(255,255,255,0.05);

          box-shadow:
            1px 0 0 rgba(255,255,255,0.04),
            12px 0 40px rgba(59,130,246,0.08);

          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* BRAND */

        .brand-section {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 10px;
        }

        .logo-box {
          width: 56px;
          height: 56px;

          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #2563eb 100%
          );

          border-radius: 18px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 26px;
          color: white;

          box-shadow:
            0 10px 25px rgba(59,130,246,0.35),
            0 0 30px rgba(59,130,246,0.2);
        }

        .brand-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-weight: 800;
          letter-spacing: 1.5px;
          margin: 0;
          font-size: 1.4rem;
          color: white;
        }

        .text-blue {
          color: #3b82f6;
        }

        .version-tag {
          width: fit-content;
          margin-top: 5px;

          font-size: 10px;

          background: rgba(59,130,246,0.12);
          color: #60a5fa;

          padding: 4px 10px;
          border-radius: 30px;

          font-weight: 700;
        }

        /* NAVIGATION */

        .nav-list {
          list-style: none;
          padding: 0;
          margin-top: 40px;
        }

        .menu-header {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 20px;
          padding-left: 10px;
        }

        .nav-item {
          margin-bottom: 10px;
          position: relative;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 16px;

          padding: 16px 18px;

          color: #94a3b8;
          text-decoration: none;

          border-radius: 18px;

          transition: all 0.3s ease;

          position: relative;
          overflow: hidden;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.03);
          color: white;
          transform: translateX(4px);
        }

        .nav-link.active {
          background: rgba(59,130,246,0.12);
          color: white;

          box-shadow:
            inset 0 0 0 1px rgba(59,130,246,0.08),
            0 10px 25px rgba(59,130,246,0.08);
        }

        .icon-wrapper {
          font-size: 1.3rem;
          transition: 0.3s;
        }

        .active-icon {
          color: #60a5fa;
        }

        .link-text {
          font-size: 1rem;
          font-weight: 600;
        }

        .active-pill {
          position: absolute;
          right: 0;
          top: 20%;
          bottom: 20%;

          width: 4px;

          background: #3b82f6;

          border-radius: 10px 0 0 10px;

          box-shadow:
            -4px 0 20px rgba(59,130,246,0.9),
            0 0 20px rgba(59,130,246,0.5);
        }

        /* FOOTER */

        .sidebar-footer {
          margin-top: auto;
          padding-top: 30px;
        }

        .status-card {
          background: rgba(255,255,255,0.03);

          padding: 16px;

          border-radius: 20px;

          border: 1px solid rgba(255,255,255,0.05);

          backdrop-filter: blur(10px);
        }

        .status-dot {
          width: 8px;
          height: 8px;

          background: #22c55e;
          border-radius: 50%;

          box-shadow: 0 0 12px #22c55e;
        }

        .status-text {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 700;
        }

        .admin-profile-min {
          display: flex;
          align-items: center;
        }

        .mini-avatar {
          width: 38px;
          height: 38px;

          background: linear-gradient(
            135deg,
            #334155,
            #1e293b
          );

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 13px;
          font-weight: 700;

          color: white;
        }

        .admin-name-text {
          font-size: 13px;
          font-weight: 700;
          color: #f8fafc;
        }

        .admin-status-text {
          font-size: 11px;
          color: #64748b;
        }

        /* SCROLLBAR */

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }

        /* MOBILE */

        @media (max-width: 768px) {

          .sidebar-container {
            width: 250px;
          }

        }

      `}</style>
    </>
  );
}

export default Sidebar;
