import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get(
          `/api/orders/${userId}`
        );
        setOrders(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchOrders();
    else setLoading(false);
  }, [userId]);

  return (
    <>
      <div className="orders-page-wrapper">
        {/* Background Elements synced with Wishlist */}
        <div className="bg-gradient-overlay"></div>
        <div className="bg-grid-pattern"></div>

        {/* Floating Luxury Orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>

        <div className="container py-5 mt-5 position-relative" style={{ zIndex: 2 }}>
          
          {/* ================= BREADCRUMB NAVIGATION ================= */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb custom-orders-breadcrumb">
              <li className="breadcrumb-item">
                <button className="btn-orders-breadcrumb-link" onClick={() => navigate("/home")}>
                  Home
                </button>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                My Orders
              </li>
            </ol>
          </nav>

          {/* Page Header */}
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
            <div>
              <span className="section-badge">Transactions</span>
              <h1 className="main-title mb-1">
                Purchase <span className="text-gold">History</span>
              </h1>
              <p className="subtitle mb-3">
                Track the progress framework and details of your premium orders.
              </p>
              <div className="divider-line"></div>
            </div>
            <div className="stats-pill shadow-sm fw-medium">
              Total Purchases: <strong className="text-gold">{orders.length}</strong>
            </div>
          </div>

          {/* Core App Logic States */}
          {loading ? (
            <div className="text-center py-5 empty-card border shadow-sm rounded-4">
              <div className="spinner-border text-gold mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
              <p className="text-muted small fw-medium text-white-50">Retrieving secure orders registry...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-card shadow-sm p-5 text-center border rounded-4">
              <div className="mb-3 fs-1 text-gold">📦</div>
              <h4 className="fw-semibold text-white">No orders found</h4>
              <p className="text-muted small mb-4">
                Looks like you haven't initialized your first transaction block yet.
              </p>
              <button
                className="btn btn-modal-primary rounded-pill px-4 py-2"
                style={{ fontSize: "14px", fontWeight: "500" }}
                onClick={() => navigate("/")}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-main-card mb-4 shadow-sm border rounded-4">
                  
                  {/* Card Header: Meta Info with Luxury Matte Layout */}
                  <div className="card-header-custom p-3 p-md-4">
                    <div className="row g-3 align-items-center">
                      <div className="col-6 col-sm-4 col-md-2">
                        <small className="d-block text-uppercase small-label">
                          Date Placed
                        </small>
                        <span className="fw-semibold text-white text-nowrap small">
                          {new Date(order.createdAt).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="col-6 col-sm-4 col-md-2">
                        <small className="d-block text-uppercase small-label">
                          Total Amount
                        </small>
                        <span className="fw-bold text-gold small">
                          ₹{order.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                      <div className="col-6 col-sm-4 col-md-3">
                        <small className="d-block text-uppercase small-label">
                          Order ID
                        </small>
                        <span className="text-white-50 font-monospace fw-medium small">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="col-6 col-sm-6 col-md-3">
                        <small className="d-block text-uppercase small-label">
                          Payment Framework
                        </small>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`status-dot ${
                              order.paymentStatus === "Paid"
                                ? "bg-success-gold"
                                : order.paymentStatus === "Failed"
                                ? "bg-danger-luxury"
                                : "bg-warning-luxury"
                            }`}
                          ></span>
                          <span className="fw-semibold text-white-50 extra-small">
                            {order.paymentMethod} ({order.paymentStatus})
                          </span>
                        </div>
                      </div>
                      <div className="col-12 col-sm-6 col-md-2 text-md-end">
                        <span
                          className={`status-badge ${order.orderStatus ? order.orderStatus.toLowerCase() : 'processing'}`}
                        >
                          {order.orderStatus || "Processing"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Address & Products inside Frosted Shell */}
                  <div className="card-body p-3 p-md-4">
                    <div className="row g-4">
                      
                      {/* Shipping Info */}
                      <div className="col-lg-4 border-end-custom">
                        <h6 className="fw-bold mb-3 d-flex align-items-center text-white small-heading">
                          📍 Delivery Target
                        </h6>
                        <div className="address-box p-3 rounded-4">
                          <p className="mb-1 fw-bold text-white small">{order.address?.name}</p>
                          <p className="mb-1 text-muted extra-small lh-base">
                            {order.address?.fullAddress}, {order.address?.city}
                          </p>
                          <p className="mb-2 text-muted extra-small">
                            Pincode: {order.address?.pincode || "382345"}
                          </p>
                          <p className="mb-0 extra-small fw-semibold text-gold">
                            📞 {order.address?.phone}
                          </p>
                        </div>
                      </div>

                      {/* Items Row Loops */}
                      <div className="col-lg-8 ps-lg-4">
                        <h6 className="fw-bold mb-3 text-white small-heading">
                          Items Bundled ({order.items.length})
                        </h6>
                        <div className="products-inner-list">
                          {order.items.map((item, idx) => (
                            <div
                              key={item._id || idx}
                              className={`product-row d-flex align-items-center gap-3 ${
                                idx !== order.items.length - 1
                                  ? "mb-3 pb-3 border-bottom-light"
                                  : ""
                              }`}
                            >
                              {/* Wishlist Glass Frame Matching Image */}
                              <div className="wishlist-img-frame shadow-sm border">
                                <div className="image-glow"></div>
                                <img
                                  src={
                                    item.productId?.image
                                      ? item.productId.image
                                      : item.image ||
                                        "https://via.placeholder.com/80"
                                  }
                                  alt="Product Architecture"
                                  className="img-fluid position-relative"
                                  style={{ zIndex: 1 }}
                                />
                              </div>
                              <div className="flex-grow-1">
                                <h6
                                  className="mb-1 text-truncate fw-bold text-white product-item-name small"
                                  style={{ maxWidth: "320px" }}
                                >
                                  {item.productId?.name || "Premium Store Product"}
                                </h6>
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-1">
                                  <small className="text-muted extra-small">
                                    Units: <b className="text-white-50">{item.quantity}</b>
                                  </small>
                                  <span className="fw-bold text-gold small">
                                    ₹{(item.price * item.quantity).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="card-footer-custom border-top px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                      {order.razorpayPaymentId && (
                        <span className="font-monospace extra-small text-muted txn-pill px-2 py-1 rounded-2">
                          TXN: {order.razorpayPaymentId}
                        </span>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <a
                        href={`${process.env.REACT_APP_API_URL}/api/orders/invoice/${order._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-modal-secondary px-3 py-2"
                      >
                        Download Invoice
                      </a>
                      <button
                        className="btn btn-modal-primary px-3 py-2"
                        onClick={() => navigate(`/track/${order._id}`)}
                      >
                        Track Shipment
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= ULTRA LUXURY DARK THEME STYLESHEET ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

        .orders-page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding-bottom: 60px;
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
        .orb-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%); top: -100px; right: -100px; }
        .orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%); bottom: 10%; left: -150px; }

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

        /* Breadcrumb Alignment */
        .custom-orders-breadcrumb {
          background: transparent;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }
        .btn-orders-breadcrumb-link {
          border: none;
          background: none;
          padding: 0;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          transition: color 0.2s;
        }
        .btn-orders-breadcrumb-link:hover {
          color: #c9a962;
        }
        .custom-orders-breadcrumb .breadcrumb-item.active {
          color: #c9a962;
          font-weight: 600;
        }
        .custom-orders-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
          color: rgba(255, 255, 255, 0.3);
        }

        .main-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
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

        .stats-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 169, 98, 0.15);
          padding: 8px 18px;
          border-radius: 50px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
        }

        /* Frosted Glass Luxury Cards Architecture */
        .order-main-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(201, 169, 98, 0.1) !important;
          backdrop-filter: blur(10px);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .order-main-card:hover {
          transform: translateY(-4px);
          border-color: rgba(201, 169, 98, 0.3) !important;
          box-shadow: 0 12px 30px rgba(0,0,0,0.4), 0 0 30px rgba(201, 169, 98, 0.05) !important;
        }

        .card-header-custom {
          background-color: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(201, 169, 98, 0.1);
        }

        .small-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 4px;
          color: #c9a962 !important;
        }

        .small-heading {
          font-size: 14px;
          letter-spacing: 0.2px;
        }

        /* Luxury Status Badges */
        .status-badge {
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-block;
          letter-spacing: 0.5px;
        }
        .status-badge.processing, .status-badge.pending { background: rgba(201, 169, 98, 0.15); color: #c9a962; border: 1px solid rgba(201, 169, 98, 0.3); }
        .status-badge.shipped { background: rgba(35, 162, 246, 0.15); color: #23a2f6; border: 1px solid rgba(35, 162, 246, 0.3); }
        .status-badge.delivered, .status-badge.paid { background: rgba(8, 127, 91, 0.15); color: #12b886; border: 1px solid rgba(8, 127, 91, 0.3); }
        .status-badge.cancelled, .status-badge.failed { background: rgba(224, 49, 49, 0.15); color: #fa5252; border: 1px solid rgba(224, 49, 49, 0.3); }

        .address-box {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(201, 169, 98, 0.08);
        }

        /* Custom Image Frame matching Wishlist exactly */
        .wishlist-img-frame {
          background: linear-gradient(180deg, rgba(201, 169, 98, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%);
          border-radius: 12px;
          padding: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          height: 70px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(201, 169, 98, 0.1);
          flex-shrink: 0;
        }
        .wishlist-img-frame img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        .image-glow {
          position: absolute; width: 80%; height: 80%;
          background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%);
          border-radius: 50%;
        }

        .product-item-name {
          font-family: 'Playfair Display', serif;
          transition: color 0.3s;
        }
        .order-main-card:hover .product-item-name {
          color: #c9a962 !important;
        }

        .border-end-custom {
          border-right: 1px solid rgba(201, 169, 98, 0.1);
        }
        .border-bottom-light {
          border-bottom: 1px solid rgba(201, 169, 98, 0.05);
        }

        .status-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .bg-success-gold { background-color: #12b886; }
        .bg-danger-luxury { background-color: #fa5252; }
        .bg-warning-luxury { background-color: #fcc419; }

        .empty-card {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(201, 169, 98, 0.1) !important;
          backdrop-filter: blur(10px);
          padding: 60px 20px;
        }

        .txn-pill {
          background: rgba(0, 0, 0, 0.2);
          color: rgba(255, 255, 255, 0.4);
          border: 1px solid rgba(201, 169, 98, 0.05);
        }

        .card-footer-custom {
          background-color: rgba(255, 255, 255, 0.01);
          border-top: 1px solid rgba(201, 169, 98, 0.1) !important;
        }

        /* Gold Variant Dynamic Buttons */
        .btn-modal-primary {
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          border: none;
          color: #0a0a0f;
          border-radius: 40px;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.3px;
          transition: all 0.3s ease;
        }
        .btn-modal-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(201, 169, 98, 0.25);
          opacity: 0.95;
        }

        .btn-modal-secondary {
          background: transparent;
          border: 1.5px solid rgba(201, 169, 98, 0.4);
          color: #c9a962;
          border-radius: 40px;
          font-weight: 600;
          font-size: 13px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s ease;
        }
        .btn-modal-secondary:hover {
          background: rgba(201, 169, 98, 0.08);
          border-color: #c9a962;
          color: #c9a962;
        }

        .extra-small { font-size: 12px; }

        @media (max-width: 991px) {
          .border-end-custom { 
            border-right: none; 
            border-bottom: 1px solid rgba(201, 169, 98, 0.1);
            padding-bottom: 15px;
          }
        }
      `}</style>
    </>
  );
}

export default Orders;