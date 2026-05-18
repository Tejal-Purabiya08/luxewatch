import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = location.state?.cartItems || [];
  const finalTotal = location.state?.finalTotal || 0;

  const user = JSON.parse(localStorage.getItem("user"));
const userId = user?._id;

  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

useEffect(() => {
  if (!userId) {
    navigate("/");
    return;
  }

  setForm({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
    address: user?.address || "",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [userId]);

  // FORM CHANGE + PHONE LIMIT
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setForm({ ...form, [name]: value });
  };

  // ======================
  // PAY NOW
  // ======================
  const payNow = async () => {
    try {
      // ======================
      // VALIDATION
      // ======================
      if (
        !form.name ||
        !form.email ||
        !form.phone ||
        !form.city ||
        !form.address
      ) {
        return Swal.fire("Error", "Please fill all required fields", "error");
      }

      if (!/^\d{10}$/.test(form.phone)) {
        return Swal.fire(
          "Error",
          "Phone number must be exactly 10 digits",
          "error"
        );
      }

      // ======================
      // UPDATE USER PROFILE
      // ======================
      const token = localStorage.getItem("token");

      const updatedUserRes = await API.put(
        `/api/users/${userId}`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          address: form.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(updatedUserRes.data));

      // ======================
      // CASH ON DELIVERY
      // ======================
      if (paymentMethod === "COD") {
        await API.post("/api/orders/place", {
          userId,
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: finalTotal,
          address: {
            name: form.name,
            phone: form.phone,
            city: form.city,
            fullAddress: form.address,
          },
          paymentMethod: "COD",
          paymentStatus: "Pending",
        });

        Swal.fire({
          icon: "success",
          title: "COD Order Placed 🎉",
          showConfirmButton: false,
          timer: 1800,
        });

        navigate("/orders");
        return;
      }

      // ======================
      // CREATE ORDER IN DB
      // ======================
      const orderRes = await API.post("/api/orders/place", {
        userId,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: finalTotal,
        address: {
          name: form.name,
          phone: form.phone,
          city: form.city,
          fullAddress: form.address,
        },
        paymentMethod: "RAZORPAY",
      });

      const createdOrder = orderRes.data;

      // ======================
      // CREATE RAZORPAY ORDER
      // ======================
      const razorRes = await API.post("/api/payment/create-order", {
        amount: finalTotal,
      });

      const razorOrder = razorRes.data;

      // ======================
      // RAZORPAY OPTIONS
      // ======================
      const options = {
        key: "rzp_test_Sov1EDFm4yswd9",
        amount: razorOrder.amount,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",
        order_id: razorOrder.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: "#c9a962", // Theme synced to luxury gold
        },
        handler: async function (response) {
          try {
            await API.post("/api/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: createdOrder._id,
            });

            Swal.fire({
              icon: "success",
              title: "Payment Successful 🎉",
              showConfirmButton: false,
              timer: 1800,
            });

            navigate("/orders");
          } catch (error) {
            console.log(error);
            Swal.fire("Error", "Payment verification failed", "error");
          }
        },
        modal: {
          ondismiss: function () {
            Swal.fire("Cancelled", "Payment was cancelled", "info");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <>
      <div className="checkout-page-wrapper">
        {/* Luxury Background Elements */}
        <div className="bg-gradient-overlay"></div>
        <div className="bg-grid-pattern"></div>

        {/* Ambient Orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>

        <div className="container py-5 mt-4 position-relative" style={{ zIndex: 2 }}>
          
          {/* ================= BREADCRUMB NAVIGATION ================= */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb custom-checkout-breadcrumb">
              <li className="breadcrumb-item">
                <button className="btn-breadcrumb-link" onClick={() => navigate("/home")}>
                  Home
                </button>
              </li>
              <li className="breadcrumb-item">
                <button className="btn-breadcrumb-link" onClick={() => navigate("/cart")}>
                  Shopping Cart
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Checkout
              </li>
            </ol>
          </nav>

          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10 col-12">
              
              <div className="checkout-card-premium shadow-sm p-4 p-md-5 border rounded-4">
                
                {/* Header */}
                <div className="mb-5">
                  <span className="section-badge">Secure Protocol</span>
                  <h1 className="main-title mb-2">
                    Secure <span className="text-gold">Checkout</span>
                  </h1>
                  <p className="text-muted subtitle mb-3">
                    Verify your delivery details and choose your preferred payment architecture.
                  </p>
                  <div className="divider-line"></div>
                </div>

                {/* Section 1: Shipping */}
                <div className="section-header-custom mb-4">
                  <span className="step-badge-custom">1</span>
                  <h5 className="m-0 fw-bold text-white font-playfair">Shipping & Delivery Details</h5>
                </div>

                <div className="row g-3 mb-5">
                  <div className="col-12">
                    <label className="form-custom-label">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="modern-input-field" placeholder="Enter full name" />
                  </div>
                  <div className="col-12">
                    <label className="form-custom-label">Email Address</label>
                    <input name="email" value={form.email} onChange={handleChange} className="modern-input-field" placeholder="name@example.com" />
                  </div>
                  <div className="col-md-7 col-12">
                    <label className="form-custom-label">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="modern-input-field" placeholder="10-digit number" />
                  </div>
                  <div className="col-md-5 col-12">
                    <label className="form-custom-label">City</label>
                    <input name="city" value={form.city} onChange={handleChange} className="modern-input-field" placeholder="e.g. Ahmedabad" />
                  </div>
                  <div className="col-12">
                    <label className="form-custom-label">Full Address</label>
                    <textarea name="address" value={form.address} onChange={handleChange} className="modern-input-field textarea" rows="3" placeholder="House no, Street name, Landmark, Pincode" />
                  </div>
                </div>

                {/* Section 2: Payment */}
                <div className="section-header-custom mb-4">
                  <span className="step-badge-custom">2</span>
                  <h5 className="m-0 fw-bold text-white font-playfair">Select Payment Method</h5>
                </div>

                <div className="payment-toggle-grid-custom mb-5">
                  <div 
                    className={`payment-method-box-custom ${paymentMethod === "RAZORPAY" ? "active" : ""}`} 
                    onClick={() => setPaymentMethod("RAZORPAY")}
                  >
                    <div className="inner-circle-indicator"></div>
                    <div className="text-start">
                      <span className="d-block fw-bold small text-white">Online Gateway</span>
                      <small className="text-white-50 extra-small">Cards, UPI, Netbanking, Wallets</small>
                    </div>
                  </div>

                  <div 
                    className={`payment-method-box-custom ${paymentMethod === "COD" ? "active" : ""}`} 
                    onClick={() => setPaymentMethod("COD")}
                  >
                    <div className="inner-circle-indicator"></div>
                    <div className="text-start">
                      <span className="d-block fw-bold small text-white">Cash on Delivery</span>
                      <small className="text-white-50 extra-small">Pay with physical cash upon arrival</small>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button className="main-submit-action-btn shadow-sm py-3" onClick={payNow}>
                  {paymentMethod === "COD" ? (
                    <span>Confirm Order (COD)</span>
                  ) : (
                    <span>Pay Securely • ₹{finalTotal.toLocaleString()}</span>
                  )}
                </button>

                <div className="text-center mt-4">
                  <span className="text-muted extra-small d-inline-flex align-items-center gap-1 text-white-50">
                    🔒 Secured with 256-Bit SSL Encrypted Framework
                  </span>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= STYLING CORE SYSTEM ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');

        .checkout-page-wrapper {
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

        /* Breadcrumbs */
        .custom-checkout-breadcrumb {
          background: transparent;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }
        .btn-breadcrumb-link {
          border: none;
          background: none;
          padding: 0;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          transition: color 0.2s;
        }
        .btn-breadcrumb-link:hover {
          color: #c9a962;
        }
        .custom-checkout-breadcrumb .breadcrumb-item.active {
          color: #ffffff;
          font-weight: 600;
        }
        .breadcrumb-item + .breadcrumb-item::before {
          color: rgba(255, 255, 255, 0.2);
        }

        /* Card Housing */
        .checkout-card-premium {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(201, 169, 98, 0.1) !important;
          backdrop-filter: blur(10px);
        }

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

        .section-header-custom {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 10px;
        }

        .font-playfair {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          letter-spacing: 0.3px;
        }

        .step-badge-custom {
          background: rgba(201, 169, 98, 0.2);
          color: #c9a962;
          border: 1px solid rgba(201, 169, 98, 0.4);
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 11px;
          font-weight: bold;
        }

        .form-custom-label {
          font-size: 11px;
          font-weight: 600;
          color: #c9a962;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
          display: block;
        }

        /* Modern Frosted Inputs */
        .modern-input-field {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          outline: none;
          transition: all 0.25s ease;
          font-size: 14px;
          color: #ffffff;
          background-color: rgba(0, 0, 0, 0.2);
        }

        .modern-input-field:focus {
          border-color: #c9a962;
          background-color: rgba(0, 0, 0, 0.3);
          box-shadow: 0 0 0 4px rgba(201, 169, 98, 0.1);
        }

        .modern-input-field::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .modern-input-field.textarea {
          resize: none;
        }

        /* Payment Architecture Cards */
        .payment-toggle-grid-custom {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        @media (min-width: 576px) {
          .payment-toggle-grid-custom {
            grid-template-columns: 1fr 1fr;
          }
        }

        .payment-method-box-custom {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.25s ease;
          background: rgba(0, 0, 0, 0.15);
        }

        .payment-method-box-custom:hover {
          background: rgba(255, 255, 255, 0.02);
          border-color: rgba(201, 169, 98, 0.3);
        }

        .payment-method-box-custom.active {
          border-color: #c9a962;
          background: rgba(201, 169, 98, 0.05);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .inner-circle-indicator {
          width: 18px;
          height: 18px;
          border: 1.5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          position: relative;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .payment-method-box-custom.active .inner-circle-indicator {
          border-color: #c9a962;
        }

        .payment-method-box-custom.active .inner-circle-indicator::after {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Gold Gradient Button */
        .main-submit-action-btn {
          width: 100%;
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          color: #0a0a0f;
          border: none;
          border-radius: 40px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          text-transform: uppercase;
        }

        .main-submit-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 169, 98, 0.3) !important;
          opacity: 0.95;
        }

        .extra-small {
          font-size: 11px;
          letter-spacing: 0.3px;
        }
        .text-white-50 {
          color: rgba(255, 255, 255, 0.4) !important;
        }
      `}</style>
    </>
  );
}

export default Checkout;