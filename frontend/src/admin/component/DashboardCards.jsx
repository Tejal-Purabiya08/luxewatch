import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardCards({ userCount, productCount, orderCount, totalRevenue, loading }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-cards-grid">
      
      {/* TOTAL REVENUE CARD */}
      <div className="premium-metric-card revenue-accent no-click">
        <div className="card-inner-flex">
          <div className="metric-details">
            <p className="metric-card-title">Gross Revenue</p>

            <h2 className="metric-card-number font-monospace">
              {loading ? "..." : `₹${totalRevenue.toLocaleString()}`}
            </h2>

            <div className="metric-growth-indicator status-emerald">
              <i className="bi bi-graph-up-arrow me-1"></i>
              <span>Live Transactional Total</span>
            </div>
          </div>

          <div className="metric-icon-wrapper icon-bg-emerald">
            <i className="bi bi-currency-exchange"></i>
          </div>
        </div>
      </div>

      {/* TOTAL USERS CARD */}
      <div
        className="premium-metric-card user-accent"
        onClick={() => navigate("/admin/users")}
      >
        <div className="card-inner-flex">
          <div className="metric-details">
            <p className="metric-card-title">Total Registered Users</p>

            <h2 className="metric-card-number">
              {loading ? "..." : userCount}
            </h2>

            <div className="metric-growth-indicator status-indigo">
              <i className="bi bi-person-plus-fill me-1"></i>
              <span>Active Accounts</span>
            </div>
          </div>

          <div className="metric-icon-wrapper icon-bg-indigo">
            <i className="bi bi-people-fill"></i>
          </div>
        </div>
      </div>

      {/* TOTAL PRODUCTS CARD */}
      <div
        className="premium-metric-card product-accent"
        onClick={() => navigate("/admin/products")}
      >
        <div className="card-inner-flex">
          <div className="metric-details">
            <p className="metric-card-title">Total Catalog Products</p>

            <h2 className="metric-card-number">
              {loading ? "..." : productCount}
            </h2>

            <div className="metric-growth-indicator status-purple">
              <i className="bi bi-tags-fill me-1"></i>
              <span>In Stock Items</span>
            </div>
          </div>

          <div className="metric-icon-wrapper icon-bg-purple">
            <i className="bi bi-box-seam-fill"></i>
          </div>
        </div>
      </div>

      {/* TOTAL ORDERS CARD */}
      <div
        className="premium-metric-card order-accent"
        onClick={() => navigate("/admin/orders")}
      >
        <div className="card-inner-flex">
          <div className="metric-details">
            <p className="metric-card-title">Total Orders Fulfilled</p>

            <h2 className="metric-card-number">
              {loading ? "..." : orderCount}
            </h2>

            <div className="metric-growth-indicator status-cyan">
              <i className="bi bi-check-circle-fill me-1"></i>
              <span>Completed Nodes</span>
            </div>
          </div>

          <div className="metric-icon-wrapper icon-bg-cyan">
            <i className="bi bi-bag-check-fill"></i>
          </div>
        </div>
      </div>

      <style>{`
        /* Grid Container Structure */
        .dashboard-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          padding: 4px 0px;
        }

        /* Core Industrial Premium Card Design */
        .premium-metric-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 12px rgba(160, 175, 192, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        /* Hover Aesthetics */
        .premium-metric-card:not(.no-click):hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(148, 163, 184, 0.12);
          border-color: #cbd5e1;
        }

        .premium-metric-card:not(.no-click):active {
          transform: scale(0.98);
        }

        /* Revenue specific no-click adjustments */
        .premium-metric-card.no-click {
          cursor: default;
        }

        /* Left-side Subtle Colored Highlights */
        .premium-metric-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          border-radius: 4px 0 0 4px;
        }

        .revenue-accent::before {
          background: #10b981;
        }

        .user-accent::before {
          background: #4f46e5;
        }

        .product-accent::before {
          background: #9333ea;
        }

        .order-accent::before {
          background: #0891b2;
        }

        /* Layout Positioning */
        .card-inner-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .metric-details {
          display: flex;
          flex-direction: column;
          min-width: 0; /* Prevents overflow text clipping issues */
        }

        /* Typography & Fonts */
        .metric-card-title {
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .metric-card-number {
          font-size: 1.85rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -1px;
          margin-bottom: 4px;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-truncate: ellipsis;
        }
        
        .font-monospace {
          font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          letter-spacing: -0.5px;
        }

        /* Bottom Status Row badges */
        .metric-growth-indicator {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
        }

        .status-emerald {
          color: #10b981;
        }

        .status-indigo {
          color: #4f46e5;
        }

        .status-purple {
          color: #9333ea;
        }

        .status-cyan {
          color: #0891b2;
        }

        /* Industrial Icon Holders */
        .metric-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .premium-metric-card:not(.no-click):hover .metric-icon-wrapper {
          transform: scale(1.05);
        }

        /* Icon Colors Matching the Theme */
        .icon-bg-emerald {
          background: #ecfdf5;
          color: #10b981;
        }

        .icon-bg-indigo {
          background: #eef2ff;
          color: #4f46e5;
        }

        .icon-bg-purple {
          background: #f5f3ff;
          color: #9333ea;
        }

        .icon-bg-cyan {
          background: #ecfeff;
          color: #0891b2;
        }
      `}</style>
    </div>
  );
}

export default DashboardCards;