import React, { useEffect, useState ,useCallback} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// Global CSS import
import "./AdminGlobal.css";
import API from "../api/axios";

function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

 const fetchUsers = useCallback(async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await API.get("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data || [];

    setUsers(data);
    setFilteredUsers(data);

    const totalPagesCalculated = Math.ceil(
      data.length / usersPerPage,
    );

    if (
      currentPage > totalPagesCalculated &&
      totalPagesCalculated > 0
    ) {
      setCurrentPage(totalPagesCalculated);
    }
  } catch (error) {
    console.log("Error fetching users:", error);
  } finally {
    setLoading(false);
  }
}, [currentPage]);

useEffect(() => {
  fetchUsers();
}, [fetchUsers]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(1);

    const filtered = users.filter(
      (user) =>
        (user.name && user.name.toLowerCase().includes(value.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(value.toLowerCase())) ||
        (user.role && user.role.toLowerCase().includes(value.toLowerCase())),
    );
    setFilteredUsers(filtered);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "User's access will be permanently revoked!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Remove User",
      customClass: {
        popup: "swal-premium-popup",
        confirmButton: "rounded-pill px-4",
        cancelButton: "rounded-pill px-4",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "User Removed",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/api/users/toggle-status/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u,
        ),
      );
      setFilteredUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? { ...u, status: u.status === "active" ? "inactive" : "active" }
            : u,
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div
      className="admin-main-wrapper"
      style={{ minHeight: "100vh", paddingBottom: "80px" }}
    >
      <div className="container-fluid p-0">
        {/* HEADER SECTION */}
        <div className="row align-items-center mb-4 g-3">
          <div className="col-md-7">
            <h2 className="fw-bold text-dark mb-1">Users Directory</h2>
            <p className="text-muted small">
              Manage system access and monitor member profiles
            </p>
          </div>
          <div className="col-md-5">
            <div className="stats-glass-card shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div className="stats-icon-circle">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div>
                  <span
                    className="text-uppercase text-muted fw-bold d-block"
                    style={{ fontSize: "10px" }}
                  >
                    Total Registered
                  </span>
                  <h3 className="mb-0 fw-bold">{users.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-bar-container mb-4 shadow-sm">
          <i className="bi bi-search text-muted me-2"></i>
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {search && (
            <button
              className="btn btn-link p-0 text-muted"
              onClick={() => handleSearch("")}
            >
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
        </div>

        {/* DATA TABLE CARD */}
        <div
          className="admin-data-card shadow-sm border-0 mb-4"
          style={{ overflow: "visible" }}
        >
          <div className="table-responsive" style={{ overflow: "visible" }}>
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4">MEMBER PROFILE</th>
                  <th>CONTACT INFO</th>
                  <th>UNIQUE ID</th>
                  <th>JOINED DATE</th>
                  <th className="text-center">STATUS</th>
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
                      <p className="mt-2 text-muted small">
                        Synchronizing Database...
                      </p>
                    </td>
                  </tr>
                ) : currentUsers.length > 0 ? (
                  <AnimatePresence>
                    {currentUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="admin-table-row"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                      >
                        <td className="ps-4">
                          <div className="d-flex align-items-center">
                            <div
                              className={`avatar-circle-sm grad-${(index % 4) + 1}`}
                            >
                              {user.name
                                ? user.name.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div className="ms-3">
                              <div className="fw-bold text-dark">
                                {user.name || "Unknown"}
                              </div>
                              <span
                                className="badge bg-light text-primary border-0"
                                style={{ fontSize: "10px" }}
                              >
                                {user.role || "Member"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small text-muted">
                            <i className="bi bi-envelope me-1"></i>
                            {user.email}
                          </div>
                        </td>
                        <td>
                          <code className="item-id-badge">
                            #
                            {user._id
                              ? user._id.slice(-6).toUpperCase()
                              : "------"}
                          </code>
                        </td>
                        <td>
                          <span className="small text-muted">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStatus(user._id);
                            }}
                            className={`status-pill ${user.status === "active" ? "status-active" : "status-inactive"}`}
                          >
                            {user.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="text-end pe-4">
                          <div
                            className="d-flex justify-content-end gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="action-btn btn-delete"
                              onClick={() => handleDelete(user._id)}
                            >
                              <i className="bi bi-trash3-fill"></i>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No members found for "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTEGRATED PRODUCTS PAGINATION STYLE */}
        {!loading && filteredUsers.length > 0 && (
          <div className="admin-pagination align-items-center mt-4">
            {/* Previous Button */}
            <button
              className="page-dot"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-dot ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            {/* Next Button */}
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

export default Users;
