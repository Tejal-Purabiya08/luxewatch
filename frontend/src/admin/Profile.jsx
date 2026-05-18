import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import API from "../api/axios";

function Profile() {
  const [admin, setAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(
        "/api/users/profile/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAdmin(res.data);
      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        city: res.data.city || "",
        address: res.data.address || "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(formData.phone)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Phone number must be exactly 10 digits!",
        confirmButtonColor: "#4f46e5",
      });
      return;
    }

    Swal.fire({
      title: "Updating...",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        `/api/users/${admin._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setAdmin(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setShowModal(false);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your profile has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong while updating.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (!admin) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loader-text">Syncing Profile Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="profile-container">
        {/* HERO SECTION */}
        <motion.div
          className="hero-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="hero-left">
            <div className="avatar-wrapper">
              <div className="avatar-main">
                {admin?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="online-indicator" />
            </div>
            <div className="hero-info">
              <h1>{admin?.name}</h1>
              <div className="role-pill">
                <i className="bi bi-shield-lock-fill me-1"></i> {admin?.role || "Administrator"}
              </div>
            </div>
          </div>
          <button className="edit-trigger" onClick={() => setShowModal(true)}>
            <i className="bi bi-sliders2 me-2"></i> Edit Account Settings
          </button>
        </motion.div>

        {/* DETAILS GRID */}
        <div className="details-grid">
          {/* CARD 1: IDENTITY */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="card-heading">
              <div className="icon-badge">
                <i className="bi bi-person-vcard-fill"></i>
              </div>
              <div>
                <h3>Identity Credentials</h3>
                <p className="card-subtext">Personal validation profile pointers</p>
              </div>
            </div>
            <div className="info-rows">
              <div className="row-item">
                <label>Full Name</label>
                <span>{admin?.name}</span>
              </div>
              <div className="row-item">
                <label>Email Address</label>
                <span className="text-lowercase">{admin?.email}</span>
              </div>
              <div className="row-item border-0">
                <label>Mobile Number</label>
                <span className={admin?.phone ? "font-monospace" : ""}>
                  {admin?.phone ? `+91 ${admin.phone}` : "—"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* CARD 2: LOCATION & STATUS */}
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="card-heading">
              <div className="icon-badge location-badge">
                <i className="bi bi-geo-alt-fill"></i>
              </div>
              <div>
                <h3>Workplace & Status</h3>
                <p className="card-subtext">Regional registration parameters</p>
              </div>
            </div>
            <div className="info-rows">
              <div className="row-item">
                <label>City Hub</label>
                <td><span className="city-pill">{admin?.city || "Not Configured"}</span></td>
              </div>
              <div className="row-item">
                <label>Full Address</label>
                <span className="text-end-fallback">{admin?.address || "—"}</span>
              </div>
              <div className="row-item border-0">
                <label>Member Since</label>
                <span className="text-secondary-premium">
                  <i className="bi bi-calendar3 me-2 text-muted"></i>
                  {new Date(admin?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* MODAL WINDOW */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <div className="modal-wrapper">
              <motion.div
                className="modern-modal"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <div className="modal-top">
                  <div>
                    <h3>Update Profile Parameters</h3>
                    <p className="mb-0 text-muted small">Modify your registry credentials securely</p>
                  </div>
                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="input-group-premium">
                    <label>Full Name</label>
                    <div className="input-wrapper">
                      <i className="bi bi-person input-icon"></i>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>
                  
                  <div className="dual-inputs">
                    <div className="input-group-premium flex-1">
                      <label>Email Address</label>
                      <div className="input-wrapper">
                        <i className="bi bi-envelope input-icon"></i>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@company.com"
                        />
                      </div>
                    </div>
                    <div className="input-group-premium flex-1">
                      <label>Phone Number</label>
                      <div className="input-wrapper">
                        <i className="bi bi-telephone input-icon"></i>
                        <input
                          maxLength={10}
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="input-group-premium">
                    <label>City Hub</label>
                    <div className="input-wrapper">
                      <i className="bi bi-building input-icon"></i>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Current operational city"
                      />
                    </div>
                  </div>

                  <div className="input-group-premium mb-0">
                    <label>Full Address Mapping</label>
                    <div className="input-wrapper align-items-start">
                      <i className="bi bi-geo-alt input-icon mt-3"></i>
                      <textarea
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Complete permanent or office infrastructure address..."
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn-cancel" onClick={() => setShowModal(false)}>
                    Discard
                  </button>
                  <button className="btn-save" onClick={handleSave}>
                    <i className="bi bi-check-circle-fill me-2"></i>Commit Changes
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

        /* Layout & Wrapper Styles */
        .profile-container { 
          padding: 40px; 
          background: #f8fafc; 
          min-height: 100vh; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
        }
        
        /* Hero Banner Premium Redesign */
        .hero-banner { 
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
          border-radius: 24px; 
          padding: 35px 40px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          color: white; 
          margin-bottom: 35px; 
          box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          position: relative;
          overflow: hidden;
        }
        .hero-banner::before {
          content: ''; position: absolute; top: -50%; left: -20%; width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .avatar-wrapper { position: relative; }
        .avatar-main {
          width: 84px; height: 84px; 
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); 
          border-radius: 22px;
          display: flex; align-items: center; justify-content: center; 
          font-size: 34px; font-weight: 800; color: #ffffff;
          box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        .online-indicator {
          position: absolute; bottom: -2px; right: -2px; width: 18px; height: 18px;
          background: #10b981; border: 3px solid #0f172a; border-radius: 50%;
          box-shadow: 0 0 10px #10b981;
        }

        .hero-left { display: flex; gap: 24px; align-items: center; }
        .hero-info h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .role-pill { 
          background: rgba(255, 255, 255, 0.08); padding: 5px 14px; border-radius: 100px;
          font-size: 12px; font-weight: 600; margin-top: 8px; display: inline-flex; 
          align-items: center; color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.05);
        }

        /* Trigger Buttons */
        .edit-trigger {
          background: #ffffff; border: none; color: #0f172a; padding: 14px 24px;
          border-radius: 14px; cursor: pointer; font-weight: 700; font-size: 14px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .edit-trigger:hover { 
          background: #f1f5f9; 
          transform: translateY(-2px); 
          box-shadow: 0 8px 20px rgba(255,255,255,0.1); 
        }

        /* Glassmorphic Data Cards Grid */
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .glass-card { 
          background: #ffffff; padding: 32px; border-radius: 24px; 
          border: 1px solid #e2e8f0; 
          box-shadow: 0 10px 25px -5px rgba(160, 175, 192, 0.15);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .glass-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 35px -10px rgba(160, 175, 192, 0.25);
        }
        
        .card-heading { display: flex; align-items: center; gap: 16px; margin-bottom: 30px; }
        .icon-badge {
          width: 46px; height: 46px; background: #eef2ff; color: #4f46e5;
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .location-badge { background: #ecfdf5; color: #10b981; }
        
        .card-heading h3 { margin: 0; font-size: 18px; font-weight: 700; color: #1e293b; }
        .card-subtext { margin: 2px 0 0 0; font-size: 12px; color: #94a3b8; font-weight: 500; }
        
        /* Information Grid Rows */
        .info-rows { display: flex; flex-direction: column; }
        .row-item { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 18px 0; border-bottom: 1px solid #f1f5f9; 
        }
        .row-item label { color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .row-item span { font-weight: 600; color: #1e293b; font-size: 15px; }
        .text-end-fallback { max-width: 60%; text-align: right; line-height: 1.4; font-size: 14px !important; }
        .city-pill {
          background: #f1f5f9; color: #334155; padding: 4px 12px; border-radius: 8px;
          font-size: 13px; font-weight: 700; border: 1px solid #e2e8f0;
        }
        .font-monospace { font-family: 'JetBrains Mono', monospace; font-size: 14px !important; color: #4f46e5 !important; }

        /* Premium Modal Architecture */
        .overlay { 
          position: fixed; inset: 0; background: rgba(15, 23, 42, 0.3); 
          backdrop-filter: blur(8px); z-index: 999; 
        }
        .modal-wrapper {
          position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1000; pointer-events: none;
        }
        .modern-modal {
          pointer-events: auto; width: 550px; background: #ffffff; border-radius: 24px; 
          box-shadow: 0 35px 70px -15px rgba(15, 23, 42, 0.35); overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .modal-top { 
          padding: 24px 30px; display: flex; justify-content: space-between; align-items: center;
          border-bottom: 1px solid #edf2f7; background: #ffffff;
        }
        .modal-top h3 { margin: 0; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px; }
        .close-btn { 
          border: none; background: #f1f5f9; border-radius: 50%; width: 36px; height: 36px; 
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #64748b; transition: all 0.2s;
        }
        .close-btn:hover { background: #e2e8f0; color: #0f172a; transform: rotate(90deg); }

        .modal-body { padding: 30px; max-height: 70vh; overflow-y: auto; }
        .dual-inputs { display: flex; gap: 20px; }
        .flex-1 { flex: 1; }
        
        /* Form Field Controls */
        .input-group-premium { margin-bottom: 22px; }
        .input-group-premium label { 
          display: block; font-size: 12px; font-weight: 700; margin-bottom: 8px; 
          color: #475569; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .input-wrapper {
          position: relative; display: flex; align-items: center;
        }
        .input-icon {
          position: absolute; left: 16px; color: #94a3b8; font-size: 16px; pointer-events: none;
        }
        .input-wrapper input, .input-wrapper textarea {
          width: 100%; padding: 13px 16px 13px 46px; border: 1.5px solid #e2e8f0; 
          border-radius: 14px; outline: none; font-size: 14px; font-weight: 500;
          color: #1e293b; background: #f8fafc; transition: all 0.2s ease;
        }
        .input-wrapper input:focus, .input-wrapper textarea:focus { 
          border-color: #4f46e5; background: #ffffff;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); 
        }
        .input-wrapper textarea { resize: none; padding-top: 14px; }

        /* Modal Actions Footer */
        .modal-footer { padding: 20px 30px; background: #f8fafc; display: flex; gap: 14px; border-top: 1px solid #edf2f7; }
        .btn-save { 
          flex: 2; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: white; border: none; 
          padding: 14px; border-radius: 14px; font-weight: 700; font-size: 14px; cursor: pointer;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); transition: all 0.2s;
        }
        .btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(79, 70, 229, 0.35); }
        .btn-cancel { 
          flex: 1; background: #ffffff; border: 1.5px solid #e2e8f0; padding: 14px; 
          border-radius: 14px; font-weight: 600; font-size: 14px; color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .btn-cancel:hover { background: #f1f5f9; color: #334155; }

        /* Loader Animation Styles */
        .loader-container { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; }
        .spinner { 
          width: 48px; height: 48px; border: 4px solid #e2e8f0; border-top: 4px solid #4f46e5; 
          border-radius: 50%; animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; 
        }
        .loader-text { margin-top: 20px; font-weight: 600; color: #475569; font-size: 15px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        /* Dynamic Breakpoints Responsive Viewport */
        @media (max-width: 992px) {
          .details-grid { grid-template-columns: 1fr; gap: 20px; }
          .hero-banner { flex-direction: column; gap: 24px; align-items: flex-start; padding: 30px; }
          .edit-trigger { width: 100%; text-align: center; }
        }
        @media (max-width: 576px) {
          .profile-container { padding: 20px; }
          .modern-modal { width: 95%; }
          .dual-inputs { flex-direction: column; gap: 0; }
        }
      `}</style>
    </>
  );
}

export default Profile;