import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminGlobal.css";
import API from "../api/axios";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 8;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/api/orders/admin/all");

      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
      setLoading(false);
    }
  };

  // SEARCH FILTER
  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage,
  );

  // STATUS COLORS
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "status-delivered";

      case "processing":
        return "status-processing";

      case "shipped":
        return "status-shipped";

      case "cancelled":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };

  return (
    <div className="admin-main-wrapper">
      <div className="orders-container-fluid">
        {/* HEADER */}
        <div className="row align-items-center mb-4 g-3">
          <div className="col-md-7">
            <h2 className="fw-bold text-dark mb-1">Order Management</h2>

            <p className="text-muted small">
              Track and manage customer transactions & shipping status
            </p>
          </div>

          <div className="col-md-5">
            <div className="stats-glass-card shadow-sm d-flex align-items-center">
              <div className="stats-icon-circle me-3">
                <i className="bi bi-cart-check-fill"></i>
              </div>

              <div>
                <span
                  className="text-uppercase text-muted fw-bold x-small d-block"
                  style={{ fontSize: "10px" }}
                >
                  Total Orders
                </span>

                <h3 className="mb-0 fw-bold">{orders.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-bar-container mb-4 shadow-sm">
          <i className="bi bi-search text-muted me-2"></i>

          <input
            type="text"
            className="search-input-field"
            placeholder="Search by Order ID, Name or City..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />

          {searchTerm && (
            <button
              className="btn btn-link p-0 text-muted"
              onClick={() => setSearchTerm("")}
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="admin-data-card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4">ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>CITY</th>
                  <th>TOTAL AMOUNT</th>
                  <th>STATUS</th>
                  <th className="text-end pe-4">ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div
                        className="spinner-grow text-primary"
                        role="status"
                      ></div>

                      <p className="mt-2 text-muted small">Loading Orders...</p>
                    </td>
                  </tr>
                ) : currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="admin-table-row clickable-row"
                      onClick={(e) => {
                        if (e.target.closest("button")) return;

                        navigate(`/admin/orders/${order._id}`);
                      }}
                    >
                      <td className="ps-4">
                        <code className="item-id-badge">
                          #{order._id.slice(-6).toUpperCase()}
                        </code>
                      </td>

                      <td>
                        <div className="fw-bold text-dark">
                          {order.address?.name}
                        </div>
                      </td>

                      <td>
                        <span className="badge bg-light text-dark border">
                          {order.address?.city}
                        </span>
                      </td>

                      <td>
                        <div className="fw-bold text-dark">
                          ₹{order.totalAmount.toLocaleString()}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-pill-global ${getStatusColor(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        <button
                          className="action-btn btn-view"
                          onClick={(e) => {
                            e.stopPropagation();

                            navigate(`/admin/orders/${order._id}`);
                          }}
                          title="View Details"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <h6 className="text-muted">No orders found.</h6>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {!loading && filteredOrders.length > 0 && (
          <div className="admin-pagination">
            <button
              className="page-dot"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-dot ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="page-dot"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
