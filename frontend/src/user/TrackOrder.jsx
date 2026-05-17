import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/single/${id}`
        );
        setOrder(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Loading State with Luxury Spinner
  if (loading) {
    return (
      <div className="track-page-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="bg-gradient-overlay"></div>
        <div className="bg-grid-pattern"></div>
        <div className="text-center position-relative" style={{ zIndex: 2 }}>
          <div className="spinner-border text-gold mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
          <p className="text-white-50 small fw-medium">Securing logistics timeline tracking...</p>
        </div>
      </div>
    );
  }

  // Fallback if Order doesn't exist
  if (!order) {
    return (
      <div className="track-page-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="bg-gradient-overlay"></div>
        <div className="bg-grid-pattern"></div>
        <div className="empty-card shadow-sm p-5 text-center border rounded-4 position-relative" style={{ zIndex: 2 }}>
          <div className="mb-3 fs-1 text-gold">🔍</div>
          <h4 className="fw-semibold text-white">Registry Not Found</h4>
          <p className="text-muted small mb-4">We couldn't retrieve the shipment history logs for this specific index.</p>
          <button className="btn btn-modal-primary px-4 py-2" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="track-page-wrapper">
        {/* Background Elements synced with Wishlist/Orders */}
        <div className="bg-gradient-overlay"></div>
        <div className="bg-grid-pattern"></div>

        {/* Floating Luxury Orbs */}
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>

        <div className="container py-5 mt-5 position-relative" style={{ zIndex: 2 }}>
          
          {/* Back Navigation Button */}
          <button
            className="btn btn-modal-secondary px-4 py-2 mb-4 d-inline-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <span>←</span> Return to Registry
          </button>

          {/* Master Card Frame */}
          <div className="track-main-card shadow-sm border rounded-4">
            
            {/* Header Area */}
            <div className="card-header-custom p-4 border-bottom">
              <span className="section-badge">Live Telemetry</span>
              <h1 className="main-title mb-2">
                Track <span className="text-gold">Shipment</span>
              </h1>
              <div className="divider-line mb-4"></div>

              {/* Order Meta row */}
              <div className="row g-3">
                <div className="col-sm-6 col-md-4">
                  <small className="d-block text-uppercase small-label">Order Identifier</small>
                  <span className="text-white font-monospace fw-semibold small">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <div className="col-sm-6 col-md-4">
                  <small className="d-block text-uppercase small-label">Current Node State</small>
                  <div className="mt-1">
                    <span className={`status-badge ${order.orderStatus ? order.orderStatus.toLowerCase() : 'processing'}`}>
                      {order.orderStatus || "Processing"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Core Body */}
            <div className="card-body p-4 p-md-5">
              <h5 className="fw-bold mb-5 text-white tracking-heading font-playfair">
                Logistics Timeline Nodes
              </h5>

              {order.trackingHistory && order.trackingHistory.length > 0 ? (
                <div className="timeline-container ps-2 ps-md-4">
                  {order.trackingHistory.map((track, index) => (
                    <div key={index} className="timeline-item d-flex gap-4">
                      
                      {/* Left Geometric Visual Node Column */}
                      <div className="d-flex flex-column align-items-center position-relative">
                        {/* Luxury Glowing Dot */}
                        <div className="node-dot-wrapper">
                          <div className="node-dot-core"></div>
                          <div className="node-dot-glow"></div>
                        </div>
                        {/* Vertical Linker Line */}
                        {index !== order.trackingHistory.length - 1 && (
                          <div className="node-connector-line"></div>
                        )}
                      </div>

                      {/* Right Meta Logs Text Column */}
                      <div className="pb-5 timeline-content-box">
                        <h6 className="fw-bold text-white mb-2 status-node-title font-playfair">
                          {track.status}
                        </h6>
                        <p className="text-muted extra-small mb-2 lh-base text-white-50">
                          {track.message}
                        </p>
                        <span className="badge font-monospace timestamp-pill px-2 py-1">
                          ⏱ {new Date(track.time).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          })}
                        </span>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                /* Fallback if tracking array is empty */
                <div className="text-center py-4 text-white-50 border border-dashed rounded-4 p-4 style-fallback-box">
                  <span className="d-block mb-2 fs-4 text-gold">⏳</span>
                  <p className="mb-0 extra-small">Timeline nodes are compiling. Package data footprint routing will display shortly.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ================= ULTRA LUXURY DARK THEME STYLESHEET ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

        .track-page-wrapper {
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
        .orb-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(201, 169, 98, 0.12) 0%, transparent 70%); top: -100px; right: -100px; }
        .orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(201, 169, 98, 0.08) 0%, transparent 70%); bottom: 15%; left: -150px; }

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
          font-size: 2.8rem;
          color: #ffffff;
          font-weight: 600;
        }

        .text-gold {
          color: #c9a962;
          font-style: italic;
          font-weight: 500;
        }

        .divider-line {
          height: 2px;
          width: 50px;
          background: linear-gradient(90deg, #c9a962, transparent);
          border-radius: 2px;
        }

        .small-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 4px;
          color: #c9a962 !important;
        }

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .tracking-heading {
          font-size: 19px;
          letter-spacing: 0.3px;
        }

        /* Frosted Shell Body Container */
        .track-main-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(201, 169, 98, 0.1) !important;
          backdrop-filter: blur(10px);
          overflow: hidden;
        }

        .card-header-custom {
          background-color: rgba(255, 255, 255, 0.01);
          border-bottom: 1px solid rgba(201, 169, 98, 0.1) !important;
        }

        /* Luxury Timeline Blueprint Styling */
        .timeline-container {
          position: relative;
        }

        .node-dot-wrapper {
          position: relative;
          width: 16px;
          height: 16px;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .node-dot-core {
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          border-radius: 50%;
        }

        .node-dot-glow {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(201, 169, 98, 0.4);
          border-radius: 50%;
          transform: scale(1.6);
          filter: blur(2px);
          opacity: 0.5;
        }

        .node-connector-line {
          position: absolute;
          top: 20px;
          width: 2px;
          height: calc(100% + 20px);
          background: linear-gradient(to bottom, rgba(201, 169, 98, 0.4) 0%, rgba(201, 169, 98, 0.08) 100%);
          z-index: 1;
        }

        /* Prevent last block item spacer overflow */
        .timeline-item:last-child .node-connector-line {
          display: none;
        }
        .timeline-item:last-child .timeline-content-box {
          padding-bottom: 0 !important;
        }

        .status-node-title {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        .timestamp-pill {
          background-color: rgba(0, 0, 0, 0.25);
          color: rgba(201, 169, 98, 0.85);
          border: 1px solid rgba(201, 169, 98, 0.15);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2px;
        }

        /* Luxury Dynamic Badges mapping with Order Status */
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

        .style-fallback-box {
          background-color: rgba(0, 0, 0, 0.15);
          border-color: rgba(201, 169, 98, 0.1) !important;
        }

        .empty-card {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(201, 169, 98, 0.1) !important;
          backdrop-filter: blur(10px);
          max-width: 450px;
          width: 90%;
        }

        /* Premium Buttons Matching Structure */
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
          transition: all 0.3s ease;
        }
        .btn-modal-secondary:hover {
          background: rgba(201, 169, 98, 0.08);
          border-color: #c9a962;
          color: #c9a962;
        }

        .spinner-border.text-gold {
          color: #c9a962 !important;
        }

        .extra-small { font-size: 13px; }
      `}</style>
    </>
  );
}

export default TrackOrder;