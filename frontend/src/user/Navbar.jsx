import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/axios";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [showMenu, setShowMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;
      const res = await API.get(`/api/cart/${user._id}`);
      const count = res.data?.items?.length || 0;
      setCartCount(count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadCartCount();
    window.addEventListener("cartUpdated", loadCartCount);
    return () => {
      window.removeEventListener("cartUpdated", loadCartCount);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your session!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c9a962",
      cancelButtonColor: "#1a1a2e",
      confirmButtonText: "Yes, Logout",
      background: "rgba(255,255,255,0.98)",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        navigate("/");
        Swal.fire({
          title: "Logged Out!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <>
      <nav className="custom-navbar">
        <div className="nav-container">
          {/* IDENTICAL BRAND LOGO */}
          <Link to="/home" className="nav-brand-logo">
            <div className="brand-logo-box">
              <i className="bi bi-watch"></i>
            </div>
            <span className="brand-logo-text">LUXE WATCH</span>
          </Link>

          {/* RIGHT MENU */}
          <div className="nav-menu">
            {user?.role === "user" && (
              <div className="user-profile">
                <div className="avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="welcome-text">Hi, {user.name}</span>
              </div>
            )}

            {/* DESKTOP MENU */}
            <Link to="/home" className="nav-link text-light">
              <i className="bi bi-house-door-fill p-2"></i>
              Home
            </Link>

            {/* WISHLIST */}
            <Link to="/wishlist" className="cart-btn wishlist-btn">
              <i className="bi bi-heart-fill"></i>
              Wishlist
            </Link>

            <div className="desktop-menu">
              <Link to="/cart" className="cart-btn">
                <i className="bi bi-cart3"></i>
                Cart
                <span className="cart-badge">{cartCount}</span>
              </Link>

              <button onClick={handleLogout} className="logout-btn">
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>

            {/* SETTINGS BUTTON */}
            <button className="settings-btn" onClick={() => setShowMenu(true)}>
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* OFFCANVAS OVERLAY */}
      <div
        className={`offcanvas-overlay ${showMenu ? "show" : ""}`}
        onClick={() => setShowMenu(false)}
      ></div>

      {/* OFFCANVAS */}
      <div className={`custom-offcanvas ${showMenu ? "active" : ""}`}>
        <div className="offcanvas-top">
          <div>
            <h4>
              <i className="bi bi-gear-fill me-2"></i>
              Settings
            </h4>
            <p>Manage your account</p>
          </div>
          <button className="close-btn" onClick={() => setShowMenu(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="offcanvas-user">
          <div className="offcanvas-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6>{user?.name}</h6>
            <small>{user?.email}</small>
          </div>
        </div>

        <div className="offcanvas-links">
          <Link to="/user-profile" className="offcanvas-item" onClick={() => setShowMenu(false)}>
            <i className="bi bi-person-circle"></i> My Profile
          </Link>
          <Link to="/orders" className="offcanvas-item" onClick={() => setShowMenu(false)}>
            <i className="bi bi-bag-check-fill"></i> My Orders
          </Link>
          <Link to="/wishlist" className="offcanvas-item" onClick={() => setShowMenu(false)}>
            <i className="bi bi-heart-fill"></i> Wishlist
          </Link>
          <Link to="/cart" className="offcanvas-item" onClick={() => setShowMenu(false)}>
            <i className="bi bi-cart-fill"></i> Shopping Cart
            <span className="inside-cart-count">{cartCount}</span>
          </Link>
          <button onClick={handleLogout} className="offcanvas-item logout-item">
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>

        <div className="offcanvas-footer">
          <p>LUXEWATCH © 2026</p>
          <small>Premium Timepieces</small>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
        }

        body{
          overflow-x:hidden;
          font-family:'Inter',sans-serif;
        }

        /* ============ NAVBAR ============ */
        .custom-navbar {
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
          backdrop-filter: blur(20px);
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(201, 169, 98, 0.15);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        }

        .nav-container {
          max-width: 1400px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
        }

        /* ============ GLOBAL IDENTICAL BRAND LOGO ============ */
        .nav-brand-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .brand-logo-box {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #c9a962 0%, #e8d5a3 50%, #c9a962 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #0a0c1a;
          box-shadow: 0 4px 15px rgba(201, 169, 98, 0.2);
        }

        .brand-logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 3px;
          background: linear-gradient(135deg, #c9a962 0%, #e8d5a3 50%, #c9a962 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-brand-logo:hover {
          transform: translateY(-1px);
          opacity: 0.9;
        }

        /* ============ NAV MENU ============ */
        .nav-menu {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .desktop-menu {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* ============ USER PROFILE ============ */
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(201, 169, 98, 0.08);
          padding: 8px 18px;
          border-radius: 50px;
          border: 1px solid rgba(201, 169, 98, 0.2);
          transition: all 0.3s ease;
        }

        .user-profile:hover {
          background: rgba(201, 169, 98, 0.15);
          border-color: rgba(201, 169, 98, 0.4);
          box-shadow: 0 4px 20px rgba(201, 169, 98, 0.15);
        }

        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c9a962 0%, #f7e7a0 100%);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #0a0a0f;
          font-weight: 700;
          font-size: 15px;
          box-shadow: 0 2px 10px rgba(201, 169, 98, 0.3);
        }

        .welcome-text {
          color: #e8e8e8;
          font-size: 14px;
          font-weight: 500;
        }

        /* ============ NAV LINKS ============ */
        .nav-link {
          color: #e8e8e8 !important;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 18px;
          border-radius: 30px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid transparent;
        }

        .nav-link:hover {
          background: rgba(201, 169, 98, 0.1);
          border-color: rgba(201, 169, 98, 0.3);
          color: #c9a962 !important;
        }

        /* ============ CART & WISHLIST BUTTONS ============ */
        .cart-btn {
          background: transparent;
          border: 1px solid rgba(201, 169, 98, 0.4);
          color: #e8e8e8;
          padding: 10px 20px;
          border-radius: 30px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 14px;
        }

        .cart-btn:hover {
          background: linear-gradient(135deg, #c9a962 0%, #f7e7a0 100%);
          color: #0a0a0f;
          border-color: #c9a962;
          box-shadow: 0 4px 20px rgba(201, 169, 98, 0.3);
          transform: translateY(-2px);
        }

        .wishlist-btn i {
          color: #e74c3c;
        }

        .wishlist-btn:hover i {
          color: #0a0a0f;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #c9a962 0%, #f7e7a0 100%);
          color: #0a0f1a;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          font-size: 11px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
          box-shadow: 0 2px 10px rgba(201, 169, 98, 0.4);
        }

        /* ============ LOGOUT BUTTON ============ */
        .logout-btn {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid rgba(231, 76, 60, 0.4);
          padding: 10px 22px;
          border-radius: 30px;
          color: #e74c3c;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .logout-btn:hover {
          background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
          color: white;
          border-color: #e74c3c;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
        }

        /* ============ SETTINGS BUTTON ============ */
        .settings-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(201, 169, 98, 0.3);
          background: rgba(201, 169, 98, 0.08);
          color: #c9a962;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.4s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .settings-btn:hover {
          background: linear-gradient(135deg, #c9a962 0%, #f7e7a0 100%);
          color: #0a0a0f;
          transform: rotate(180deg);
          box-shadow: 0 4px 20px rgba(201, 169, 98, 0.4);
        }

        /* ============ OVERLAY ============ */
        .offcanvas-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
          z-index: 2000;
        }

        .offcanvas-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        /* ============ FIXED COMPLETED OFFCANVAS CSS ============ */
        .custom-offcanvas {
          position: fixed;
          top: 0;
          right: 0;
          transform: translateX(100%);
          width: 380px;
          max-width: 100%;
          height: 100vh;
          background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
          z-index: 3000;
          padding: 30px;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: -20px 0 60px rgba(0, 0, 0, 0.2);
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        .custom-offcanvas.active {
          transform: translateX(0);
        }

        .offcanvas-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(201, 169, 98, 0.2);
        }

        .offcanvas-top h4 {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          margin-bottom: 6px;
          color: #0a0a0f;
          display: flex;
          align-items: center;
          font-weight: 700;
        }

        .offcanvas-top h4 i {
          color: #c9a962;
        }

        .offcanvas-top p {
          color: #6c757d;
          font-size: 14px;
          margin: 0;
        }

        .close-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(0, 0, 0, 0.1);
          background: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #333;
        }

        .close-btn:hover {
          background: #0a0a0f;
          color: white;
          transform: rotate(90deg);
        }

        .offcanvas-user {
          display: flex;
          align-items: center;
          gap: 16px;
          background: linear-gradient(135deg, rgba(201, 169, 98, 0.1) 0%, rgba(201, 169, 98, 0.05) 100%);
          padding: 20px;
          border-radius: 20px;
          margin-bottom: 30px;
          border: 1px solid rgba(201, 169, 98, 0.15);
        }

        .offcanvas-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
          color: #c9a962;
          font-weight: 700;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(201, 169, 98, 0.3);
        }

        .offcanvas-user h6 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #0a0a0f;
        }

        .offcanvas-user small {
          color: #6c757d;
          font-size: 13px;
        }

        .offcanvas-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-grow: 1;
        }

        .offcanvas-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-radius: 12px;
          color: #333333;
          text-decoration: none;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          background: transparent;
          width: 100%;
          text-align: left;
        }

        .offcanvas-item i {
          font-size: 18px;
          color: #6c757d;
          transition: color 0.3s ease;
        }

        .offcanvas-item:hover {
          background: rgba(201, 169, 98, 0.08);
          color: #c9a962;
          border-color: rgba(201, 169, 98, 0.2);
          padding-left: 24px;
        }

        .offcanvas-item:hover i {
          color: #c9a962;
        }

        .inside-cart-count {
          margin-left: auto;
          background: #0a0a0f;
          color: #c9a962;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .logout-item {
          margin-top: 20px;
          color: #e74c3c !important;
          border-top: 1px solid rgba(0, 0, 0, 0.05) !important;
          border-radius: 12px !important;
        }

        .logout-item i {
          color: #e74c3c !important;
        }

        .logout-item:hover {
          background: rgba(231, 76, 60, 0.08) !important;
          border-color: rgba(231, 76, 60, 0.2) !important;
        }

        .offcanvas-footer {
          margin-top: auto;
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .offcanvas-footer p {
          font-family: 'Playfair Display', serif;
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0f;
          margin-bottom: 2px;
          letter-spacing: 1px;
        }

        .offcanvas-footer small {
          color: #a1a1aa;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
      `}</style>
    </>
  );
}

export default Navbar;