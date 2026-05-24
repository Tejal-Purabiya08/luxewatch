import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../api/axios";

function UserProfile() {
  const navigate = useNavigate();
  const [sessionUser, setSessionUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form input states corresponding to your User Schema
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  const [metricCounts, setMetricCounts] = useState({
    orders: 0,
    wishlist: 0,
    cartItems: 0,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/");
      return;
    }
    
    // Safety check: Agar admin login ho gaya hai toh customer section block karo
    if (user.role === "admin") {
      navigate("/dashboard");
      return;
    }

    setSessionUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      address: user.address || "",
    });

    const fetchUserMetrics = async () => {
      try {
        const cartRes = await API.get(`/api/cart/${user._id}`);
        setMetricCounts({
          orders: 0, 
          wishlist: 0,
          cartItems: cartRes.data?.items?.length || 0
        });
      } catch (err) {
        console.error("Error fetching customer metrics:", err);
      }
    };

    fetchUserMetrics();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Direct call to your backend PUT route
      const res = await API.put(
        `/api/users/${sessionUser._id}`,
        formData,
        config
      );

      // Local storage data ko update karna zaroori hai responsive rendering ke liye
      const updatedSessionUser = { ...sessionUser, ...res.data };
      localStorage.setItem("user", JSON.stringify(updatedSessionUser));
      setSessionUser(updatedSessionUser);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your personal details have been modified successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  if (!sessionUser) return null;

  return (
    <>
      <div className="store-profile-dark-wrapper">
        {/* Luxury Background Elements */}
        <div className="bg-gradient-overlay"></div>
        <div className="bg-grid-pattern"></div>

        {/* Ambient Orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>

        <div className="container py-5 mt-4 position-relative" style={{ zIndex: 2 }}>
          
          {/* Header Section */}
          <div className="row mb-5">
            <div className="col-12">
              <span className="section-badge">Customer Space</span>
              <h1 className="main-title mb-2">
                Welcome, <span className="text-gold">{sessionUser.name}!</span>
              </h1>
              <p className="text-muted subtitle mb-3">
                Manage your shipping registry details, credentials, and active items.
              </p>
              <div className="divider-line"></div>
            </div>
          </div>

          {/* Minimalist Luxury Metrics Deck */}
          <div className="row g-4 mb-5">
            <div className="col-md-4">
              <Link to="/orders" className="text-decoration-none">
                <div className="customer-luxury-card p-4 rounded-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="icon-circle-luxury">
                      <i className="bi bi-bag-heart"></i>
                    </div>
                    <span className="luxury-badge">Track</span>
                  </div>
                  <h5 className="fw-bold text-white font-playfair m-0">My Orders</h5>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/wishlist" className="text-decoration-none">
                <div className="customer-luxury-card p-4 rounded-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="icon-circle-luxury">
                      <i className="bi bi-heart"></i>
                    </div>
                    <span className="luxury-badge">Favorites</span>
                  </div>
                  <h5 className="fw-bold text-white font-playfair m-0">My Wishlist</h5>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/cart" className="text-decoration-none">
                <div className="customer-luxury-card p-4 rounded-4 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="icon-circle-luxury">
                      <i className="bi bi-cart3"></i>
                    </div>
                    <span className="luxury-badge gold-badge">{metricCounts.cartItems} Items</span>
                  </div>
                  <h5 className="fw-bold text-white font-playfair m-0">Active Bag</h5>
                </div>
              </Link>
            </div>
          </div>

          <div className="row g-4">
            {/* Identity Profile Badge */}
            <div className="col-lg-4">
              <div className="profile-identity-luxury p-4 text-center rounded-4 mb-4">
                <div className="avatar-initial shadow-sm mb-3 mx-auto">
                  {sessionUser.name?.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold text-white font-playfair mb-1">{sessionUser.name}</h4>
                <div className="user-status-tag mb-4">Premium Member</div>
                
                <div className="meta-info-list text-start pt-3 border-top border-luxury">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted subtitle extra-small">Registry Status</span>
                    <span className="text-gold fw-semibold small d-flex align-items-center gap-15">
                      <span className="dot-online"></span> {sessionUser.status || "Active"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted subtitle extra-small">User Token ID</span>
                    <span className="font-monospace text-white-50 extra-small">
                      #{sessionUser._id?.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Fields & Edit Setup Container */}
            <div className="col-lg-8">
              <div className="profile-details-luxury p-4 p-md-5 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-person-lines-fill text-gold fs-4"></i>
                    <h4 className="fw-bold text-white font-playfair m-0">Personal Profile Details</h4>
                  </div>
                  {!isEditing && (
                    <button className="btn-luxury-outline px-3 py-15" onClick={() => setIsEditing(true)}>
                      <i className="bi bi-pencil-square me-1"></i> Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleUpdateProfile}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="luxury-field-box">
                        <label className="luxury-field-label">Full Name</label>
                        {isEditing ? (
                          <input type="text" name="name" className="modern-input-field" value={formData.name} onChange={handleInputChange} required />
                        ) : (
                          <div className="luxury-field-display">{sessionUser.name}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="luxury-field-box">
                        <label className="luxury-field-label">Email Address</label>
                        {isEditing ? (
                          <input type="email" name="email" className="modern-input-field" value={formData.email} onChange={handleInputChange} required />
                        ) : (
                          <div className="luxury-field-display text-truncate">{sessionUser.email}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="luxury-field-box">
                        <label className="luxury-field-label">Phone Number</label>
                        {isEditing ? (
                          <input type="text" name="phone" className="modern-input-field" placeholder="Enter mobile number" value={formData.phone} onChange={handleInputChange} />
                        ) : (
                          <div className="luxury-field-display">{sessionUser.phone || <span className="text-muted italic extra-small">Not Set</span>}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="luxury-field-box">
                        <label className="luxury-field-label">City Region</label>
                        {isEditing ? (
                          <input type="text" name="city" className="modern-input-field" placeholder="Enter city name" value={formData.city} onChange={handleInputChange} />
                        ) : (
                          <div className="luxury-field-display text-capitalize">{sessionUser.city || <span className="text-muted italic extra-small">Not Set</span>}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="luxury-field-box">
                        <label className="luxury-field-label">Full Shipping Address</label>
                        {isEditing ? (
                          <textarea name="address" className="modern-input-field textarea" rows="3" placeholder="Complete address house/flat details" value={formData.address} onChange={handleInputChange}></textarea>
                        ) : (
                          <div className="luxury-field-display text-white-50">{sessionUser.address || <span className="text-muted italic extra-small">No complete address on file. Please complete profile configuration.</span>}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Operational Utility Row */}
                  <div className="mt-5 pt-4 border-top border-luxury d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div>
                      {isEditing && (
                        <div className="d-flex gap-2">
                          <button type="submit" className="main-submit-action-btn px-4 py-2">Save Schema Changes</button>
                          <button type="button" className="btn-luxury-outline px-4 py-2" onClick={() => { setIsEditing(false); setFormData(sessionUser); }}>Cancel</button>
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <button type="button" className="back-to-home-btn px-4 py-2" onClick={() => navigate("/home")}>
                        <i className="bi bi-house me-2"></i> Back to Shop
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ================= LUXURY SYSTEM DESIGN SHEET ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        .store-profile-dark-wrapper {
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding-bottom: 40px;
        }

        .bg-gradient-overlay {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at top center, rgba(201, 169, 98, 0.08) 0%, transparent 60%);
          pointer-events: none;
        }

        .bg-grid-pattern {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: 
            linear-gradient(rgba(201, 169, 98, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 169, 98, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
        }
        .orb-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%); top: -100px; right: -100px; }
        .orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(201, 169, 98, 0.06) 0%, transparent 70%); bottom: 10%; left: -150px; }

        .section-badge {
          display: inline-block;
          padding: 6px 16px;
          background: rgba(201, 169, 98, 0.1);
          border: 1px solid rgba(201, 169, 98, 0.3);
          border-radius: 30px;
          color: #c9a962;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .main-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          color: #ffffff;
          font-weight: 600;
        }

        .text-gold {
          color: #c9a962;
          font-style: italic;
          font-weight: 500;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.5) !important;
          font-size: 14px;
        }

        .divider-line {
          height: 2px;
          width: 50px;
          background: linear-gradient(90deg, #c9a962, transparent);
          border-radius: 2px;
        }

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        /* Metric Cards */
        .customer-luxury-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(201, 169, 98, 0.1) !important;
          backdrop-filter: blur(10px);
          transition: all 0.25s ease-in-out;
        }
        .customer-luxury-card:hover {
          transform: translateY(-3px);
          border-color: rgba(201, 169, 98, 0.3) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }

        .icon-circle-luxury {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 19px;
          background: rgba(201, 169, 98, 0.1);
          color: #c9a962;
          border: 1px solid rgba(201, 169, 98, 0.2);
        }

        .luxury-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .luxury-badge.gold-badge {
          background: rgba(201, 169, 98, 0.15);
          color: #c9a962;
          border-color: rgba(201, 169, 98, 0.2);
        }

        /* Identity Side Block */
        .profile-identity-luxury, .profile-details-luxury {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(201, 169, 98, 0.1);
          backdrop-filter: blur(10px);
        }

        .avatar-initial {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          color: #0a0a0f;
          font-size: 32px;
          font-weight: 700;
          font-family: 'Playfair Display', serif;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(201, 169, 98, 0.2);
        }

        .user-status-tag {
          font-size: 11px;
          font-weight: 600;
          color: #c9a962;
          background: rgba(201, 169, 98, 0.1);
          border: 1px solid rgba(201, 169, 98, 0.2);
          padding: 4px 14px;
          border-radius: 50px;
          display: inline-block;
          letter-spacing: 0.5px;
        }

        .dot-online {
          width: 8px;
          height: 8px;
          background-color: #c9a962;
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 8px #c9a962;
        }

        /* Form Logic Layout */
        .luxury-field-box {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .luxury-field-label {
          font-size: 11px;
          font-weight: 600;
          color: #c9a962;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .luxury-field-display {
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 12px 16px;
          border-radius: 10px;
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
          min-height: 48px;
          display: flex;
          align-items: center;
        }

        .modern-input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          outline: none;
          transition: all 0.25s ease;
          font-size: 14px;
          color: #ffffff;
          background-color: rgba(0, 0, 0, 0.3);
        }
        .modern-input-field:focus {
          border-color: #c9a962;
          box-shadow: 0 0 0 4px rgba(201, 169, 98, 0.1);
        }
        .modern-input-field.textarea {
          resize: none;
        }

        /* Buttons Core */
        .btn-luxury-outline {
          background: transparent;
          border: 1px solid rgba(201, 169, 98, 0.4);
          color: #c9a962;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .btn-luxury-outline:hover {
          background: rgba(201, 169, 98, 0.1);
          border-color: #c9a962;
        }

        .main-submit-action-btn {
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          color: #0a0a0f;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          transition: all 0.25s ease;
        }
        .main-submit-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(201, 169, 98, 0.2);
          opacity: 0.95;
        }

        .back-to-home-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .back-to-home-btn:hover {
          background: #ffffff;
          color: #0a0a0f;
          border-color: #ffffff;
        }

        .border-luxury {
          border-top: 1px solid rgba(201, 169, 98, 0.1) !important;
        }
        .extra-small { font-size: 11px; }
        .py-15 { padding-top: 6px; padding-bottom: 6px; }
        .gap-15 { gap: 6px; }
        .text-white-50 { color: rgba(255, 255, 255, 0.4) !important; }
        .italic { font-style: italic; }
      `}</style>
    </>
  );
}

export default UserProfile;