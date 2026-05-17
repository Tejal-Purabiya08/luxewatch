import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/single/${id}`,
      );
      setOrder(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/admin/update-status/${id}`,
        {
          status: newStatus,

          message:
            newStatus === "Processing"
              ? "Order is being prepared."
              : newStatus === "Packed"
                ? "Order packed successfully."
                : newStatus === "Shipped"
                  ? "Order shipped from warehouse."
                  : newStatus === "Out For Delivery"
                    ? "Delivery partner is near customer."
                    : newStatus === "Delivered"
                      ? "Order delivered successfully."
                      : "Order updated.",
        },
      );
      fetchOrder();
      Swal.fire({
        icon: "success",
        title: "Status Updated Successfully",
        text: `Order is now marked as ${newStatus}`,
        showConfirmButton: false,
        timer: 1500,
        background: "#ffffff",
        customClass: {
          popup: "premium-swal-popup",
        },
      });
    } catch (err) {
      Swal.fire(
        "Update Failed",
        "Could not synchronize status change.",
        "error",
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-panel">
        <div
          className="spinner-border text-indigo"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="details-container">
        {/* TOP BAR / NAVIGATION */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3 page-header-bar">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="btn-back-premium"
              title="Go Back"
            >
              <i className="bi bi-arrow-left-short"></i>
            </button>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h2 className="fw-800 text-dark mb-0 tracking-tight">
                  Order Profile
                </h2>
                <span className="hash-id-tag">#{order._id.toUpperCase()}</span>
              </div>
              <p className="text-muted small mb-0 mt-1">
                System Node Reference & Transaction Ledger
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 bg-white p-2 rounded-4 border-panel shadow-sm">
            <label className="select-action-label ms-2 d-none d-sm-inline-block">
              OPERATIONAL STATUS:
            </label>
            <select
              className={`form-select status-select-premium status-dropdown-${order.orderStatus?.toLowerCase()}`}
              value={order.orderStatus}
              onChange={(e) => updateStatus(e.target.value)}
            >
              <option value="Processing">⏳ Processing</option>
              <option value="Shipped">📦 Shipped</option>
              <option value="Out For Delivery">
  🚚 Out For Delivery
</option>
              <option value="Delivered">✅ Delivered</option>
              <option value="Cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>

        {/* CORE CONTENT GRID */}
        <div className="row g-4">
          {/* LEFT SIDEBAR: LOGISTICS & TRANSACTION OBJECTS */}
          <div className="col-xl-4 col-lg-5">
            {/* CLIENT META CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-detail-card mb-4"
            >
              <div className="card-accent-line"></div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="section-title-premium mb-0">
                  <i className="bi bi-person-badge-fill me-2 text-indigo"></i>
                  Customer Registry
                </h5>
                <i
                  className="bi bi-shield-lock text-muted opacity-50"
                  title="Encrypted Data Fields"
                ></i>
              </div>

              <div className="info-data-box">
                <div className="meta-field">
                  <span className="meta-label">FULL NAME</span>
                  <p className="meta-value text-dark">
                    {order.address?.name || "N/A"}
                  </p>
                </div>
                <div className="meta-field">
                  <span className="meta-label">CONTACT CHANNEL</span>
                  <p className="meta-value text-indigo fw-600">
                    <i className="bi bi-telephone me-2 text-muted"></i>
                    {order.address?.phone || "N/A"}
                  </p>
                </div>
                <div className="meta-field">
                  <span className="meta-label">DESTINATION HUB (CITY)</span>
                  <p className="meta-value">
                    <span className="badge-city-premium">
                      {order.address?.city || "N/A"}
                    </span>
                  </p>
                </div>
                <div className="meta-field mb-0">
                  <span className="meta-label">SHIPPING ROUTE ADDRESS</span>
                  <div className="address-delivery-block">
                    <i className="bi bi-geo-alt-fill text-rose me-2 mt-1"></i>
                    <p className="mb-0 small fw-500 text-secondary leading-relaxed">
                      {order.address?.fullAddress || "No address defined"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* FINANCIAL AUDIT CARD */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="admin-detail-card"
            >
              <div className="card-accent-line bg-emerald"></div>
              <h5 className="section-title-premium mb-3">
                <i className="bi bi-cash-stack me-2 text-emerald"></i>Financial
                Ledger
              </h5>

              <div className="info-data-box bg-light-surface mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="small text-muted fw-600">
                    SETTLEMENT METHOD
                  </span>
                  <span className="badge bg-dark-subtle text-dark fw-bold rounded-2 px-2 py-1 x-small text-uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small text-muted fw-600">
                    GATEWAY STATUS
                  </span>
                  <span
                    className={`status-indicator-text ${order.paymentStatus?.toLowerCase() === "paid" ? "text-emerald" : "text-amber"}`}
                  >
                    <i className={`bi bi-circle-fill x-small me-1`}></i>{" "}
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="gross-total-panel">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="meta-label mb-0 text-white opacity-75">
                      AGGREGATE AMOUNT
                    </span>
                    <div className="x-small text-white opacity-50">
                      Taxes & Logistics Inclusive
                    </div>
                  </div>
                  <h3 className="fw-900 text-white mb-0 font-monospace">
                    ₹{order.totalAmount?.toLocaleString()}
                  </h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR: INVENTORY MANIFEST */}
          <div className="col-xl-8 col-lg-7">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="admin-detail-card h-100"
            >
              <div className="d-flex justify-content-between align-items-center border-bottom-panel pb-3 mb-4">
                <h5 className="section-title-premium mb-0">
                  <i className="bi bi-boxes me-2 text-indigo"></i>Manifest Items
                  ({order.items?.length || 0})
                </h5>
                <span
                  className={`status-pill-premium status-pill-${order.orderStatus?.toLowerCase()}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="manifest-scroll-container">
                {order.items &&
                  order.items.map((item) => (
                    <div key={item._id} className="manifest-product-row">
                      <div className="manifest-img-wrapper shadow-sm">
                        {item.productId?.image ? (
                          <img
                            src={item.productId.image}
                            alt={item.productId?.name}
                          />
                        ) : (
                          <div className="placeholder-manifest-icon">
                            <i className="bi bi-image"></i>
                          </div>
                        )}
                      </div>

                      <div className="ms-3 flex-grow-1 min-w-0">
                        <h6
                          className="product-title-admin text-truncate mb-1"
                          title={item.productId?.name}
                        >
                          {item.productId?.name || "De-listed Product Item"}
                        </h6>

                        <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                          <span className="manifest-tag-brand">
                            <i className="bi bi-tag-fill me-1 opacity-50"></i>
                            {item.productId?.brand || "Generic"}
                          </span>
                          <span className="manifest-tag-qty">
                            QTY: <b>{item.quantity}</b>
                          </span>
                          <span className="product-node-id d-none d-md-inline">
                            ID:{" "}
                            {item.productId?._id?.slice(-8).toUpperCase() ||
                              "UNKNOWN"}
                          </span>
                        </div>
                      </div>

                      <div className="text-end ps-3">
                        <div className="item-price-heavy text-dark">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="x-small text-muted font-monospace">
                          ₹{item.price?.toLocaleString()} ea
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        /* Global Page Adjustments */
        .details-container {
          padding: 35px;
          background: #f4f6f9;
          min-height: 100vh;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }
        .bg-panel { background: #f4f6f9; }
        .border-panel { border: 1px solid #e2e8f0 !important; }
        .border-bottom-panel { border-bottom: 1px solid #edf2f7; }
        
        /* Font Utilities */
        .fw-800 { font-weight: 800; }
        .fw-900 { font-weight: 900; }
        .tracking-tight { letter-spacing: -0.5px; }
        .x-small { font-size: 11px; letter-spacing: 0.5px; }
        
        /* Text Accent Colors */
        .text-indigo { color: #4f46e5 !important; }
        .text-emerald { color: #10b981 !important; }
        .text-amber { color: #f59e0b !important; }
        .text-rose { color: #f43f5e !important; }
        .bg-emerald { background-color: #10b981 !important; }

        /* Premium Navigation elements */
        .btn-back-premium {
          width: 42px; height: 42px; border-radius: 14px;
          border: 1px solid #e2e8f0; background: white;
          color: #475569; display: flex; align-items: center;
          justify-content: center; font-size: 24px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .btn-back-premium:hover {
          background: #1e293b; color: white; border-color: #1e293b;
          transform: translateX(-2px); box-shadow: 0 4px 12px rgba(30,41,59,0.15);
        }
        
        .hash-id-tag {
          font-family: 'SFMono-Regular', Consolas, monospace;
          background: #e2e8f0; color: #334155; font-size: 13px;
          padding: 4px 10px; border-radius: 8px; font-weight: 700;
        }

        /* Controls / Dropdowns */
        .select-action-label {
          font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 0.5px;
        }
        .status-select-premium {
          border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700;
          font-size: 13px; padding: 8px 36px 8px 14px; width: auto; outline: none;
          cursor: pointer; transition: all 0.2s; box-shadow: inset 0 1px 2px rgba(0,0,0,0.01);
        }
        .status-select-premium:focus {
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15); border-color: #4f46e5;
        }

        /* Dynamic style overrides for dropdown depending on current database status */
        .status-dropdown-processing { background-color: #fff7ed; color: #ea580c; border-color: #ffedd5; }
        .status-dropdown-shipped { background-color: #eff6ff; color: #2563eb; border-color: #dbeafe; }
        .status-dropdown-delivered { background-color: #f0fdf4; color: #16a34a; border-color: #dcfce7; }
        .status-dropdown-cancelled { background-color: #fef2f2; color: #dc2626; border-color: #fee2e2; }

        /* Premium Dashboard Container Layouts */
        .admin-detail-card {
          background: #ffffff; border-radius: 20px; padding: 24px;
          border: 1px solid #e8eef3; position: relative; overflow: hidden;
          box-shadow: 0 4px 18px rgba(160, 175, 192, 0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .admin-detail-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(160, 175, 192, 0.12);
        }
        .card-accent-line {
          position: absolute; top: 0; left: 0; width: 100%; height: 4px;
          background-color: #4f46e5;
        }

        .section-title-premium {
          font-weight: 800; font-size: 15px; color: #1e293b;
          letter-spacing: -0.2px; display: flex; align-items: center;
        }

        /* Operational Profile Labels & Fields */
        .info-data-box { display: flex; flex-direction: column; gap: 16px; }
        .meta-field { border-bottom: 1px solid #f8fafc; padding-bottom: 10px; }
        .meta-field:last-child { border-bottom: none; padding-bottom: 0; }
        
        .meta-label {
          font-size: 10px; font-weight: 800; color: #94a3b8;
          letter-spacing: 0.8px; display: block; margin-bottom: 5px;
        }
        .meta-value { margin-bottom: 0; color: #334155; font-weight: 700; font-size: 14px; }
        
        .badge-city-premium {
          background: #f1f5f9; color: #475569; padding: 4px 10px;
          border-radius: 8px; font-size: 12px; font-weight: 700; border: 1px solid #e2e8f0;
        }
        .address-delivery-block {
          display: flex; background: #f8fafc; border-radius: 12px;
          padding: 12px; border: 1px solid #f1f5f9;
        }

        /* Financial Box Panel */
        .bg-light-surface { background: #f8fafc; border-radius: 14px; padding: 14px; border: 1px solid #f1f5f9; }
        .status-indicator-text { font-size: 12px; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; }
        .gross-total-panel {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-radius: 16px; padding: 18px 20px; box-shadow: 0 6px 15px rgba(15,23,42,0.12);
        }

        /* Static Status Indicators */
        .status-pill-premium {
          padding: 6px 14px; border-radius: 10px; font-size: 11px;
          font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .status-pill-delivered { background: #dcfce7; color: #15803d; }
        .status-pill-processing { background: #ffedd5; color: #c2410c; }
        .status-pill-shipped { background: #dbeafe; color: #1d4ed8; }
        .status-pill-cancelled { background: #fee2e2; color: #b91c1c; }

        /* Order Manifest Framework (Product Rows) */
        .manifest-scroll-container {
          display: flex; flex-direction: column; gap: 12px;
          max-height: 550px; overflow-y: auto; padding-right: 4px;
        }
        /* Custom Scrollbar for premium feel */
        .manifest-scroll-container::-webkit-scrollbar { width: 5px; }
        .manifest-scroll-container::-webkit-scrollbar-track { background: transparent; }
        .manifest-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        
        .manifest-product-row {
          display: flex; align-items: center; padding: 14px;
          border: 1px solid #f1f5f9; border-radius: 16px; background: #ffffff;
          transition: all 0.2s ease-in-out;
        }
        .manifest-product-row:hover {
          background: #f8fafc; border-color: #e2e8f0; transform: scale(1.005);
        }

        .manifest-img-wrapper {
          width: 64px; height: 64px; border-radius: 12px;
          overflow: hidden; background: #ffffff; padding: 4px;
          border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .manifest-img-wrapper img { width: 100%; height: 100%; object-fit: contain; }
        .placeholder-manifest-icon { font-size: 24px; color: #cbd5e1; }

        .product-title-admin {
          font-size: 14px; font-weight: 700; color: #1e293b; margin: 0;
        }
        
        /* Product tags inside row layout */
        .manifest-tag-brand {
          background: #f1f5f9; color: #475569; font-size: 11px;
          font-weight: 700; padding: 2px 8px; border-radius: 6px;
        }
        .manifest-tag-qty {
          background: #eef2ff; color: #4f46e5; font-size: 11px;
          font-weight: 600; padding: 2px 8px; border-radius: 6px;
        }
        .product-node-id {
          font-family: monospace; font-size: 11px; color: #94a3b8;
        }
        
        .item-price-heavy { font-weight: 800; font-size: 15px; letter-spacing: -0.2px; }
        
        /* SweetAlert Enhancement */
        .premium-swal-popup { border-radius: 20px !important; font-family: 'Plus Jakarta Sans', sans-serif !important; }
      `}</style>
    </div>
  );
}

export default OrderDetails;
