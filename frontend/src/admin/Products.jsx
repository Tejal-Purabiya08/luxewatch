import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/api/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
      setLoading(false);
    }
  };

  const productsPerPage = 8;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // ================= PREMIUM FORM LOGIC =================
  const openProductForm = async (product = null) => {
    const isEdit = !!product;

    const { value: formValues } = await Swal.fire({
      title: `
        <div class="swal-title-box">
          <i class="bi ${isEdit ? "bi-pencil-square" : "bi-plus-circle-dotted"}"></i>
          <span>${isEdit ? "Update Timepiece" : "New Collection"}</span>
        </div>
      `,
     html: `
  <!-- Custom CSS Injection for SweetAlert Inner Elements -->
  <style>

  /* Title and Header Adjustments */
      .swal-title-box {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 800;
        color: var(--text-dark);
        font-size: 20px;
        margin-top: 10px;
      }
      .swal-title-box i {
        color: var(--primary-color);
        font-size: 24px;
      }
    .swal-custom-container {
      text-align: left;
      margin-top: 10px;
    }
    .form-group-custom {
      margin-bottom: 18px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group-custom label {
      font-size: 11px;
      font-weight: 800;
      color: var(--text-muted);
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
    }
    .row-custom {
      display: flex;
      gap: 15px;
    }
    .row-custom .form-group-custom {
      flex: 1;
    }
    .swal-select-premium {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 10px 12px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      color: var(--text-dark);
      outline: none;
      min-height: 120px;
      transition: 0.2s;
    }
    .swal-select-premium:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 4px rgba(79,70,229,0.1);
    }
    .swal-select-premium option {
      padding: 6px 10px;
      border-radius: 6px;
      margin-bottom: 2px;
    }
    .swal-select-premium option:checked {
      background-color: var(--primary-soft) !important;
      color: var(--primary-color) !important;
    }
  </style>

  <div class="swal-custom-container">
    <!-- Watch Model Name -->
    <div class="form-group-custom">
      <label><i class="bi bi-watch me-1" style="color: var(--primary-color);"></i> WATCH MODEL NAME</label>
      <input id="swal-name" class="swal-input-premium" placeholder="e.g. Rolex Datejust 41" value="${isEdit ? product.name : ""}">
    </div>

    <!-- Row for Price & Brand -->
    <div class="row-custom">
      <div class="form-group-custom">
        <label><i class="bi bi-currency-rupee me-1" style="color: var(--success);"></i> PRICE</label>
        <input id="swal-price" type="number" class="swal-input-premium" placeholder="Amount" value="${isEdit ? product.price : ""}">
      </div>
      <div class="form-group-custom">
        <label><i class="bi bi-patch-check me-1" style="color: var(--primary-color);"></i> BRAND</label>
        <input id="swal-brand" class="swal-input-premium" placeholder="Brand Name" value="${isEdit ? product.brand : ""}">
      </div>
    </div>

    <!-- Product Image URL -->
    <div class="form-group-custom">
      <label><i class="bi bi-image me-1" style="color: var(--warning);"></i> PRODUCT IMAGE URL</label>
      <input id="swal-image" class="swal-input-premium" placeholder="https://image-link.com/photo.jpg" value="${isEdit ? product.image : ""}">
    </div>

    <!-- Categories Multi-Select -->
    <div class="form-group-custom">
      <label><i class="bi bi-tags me-1" style="color: var(--primary-color);"></i> CATEGORIES (Ctrl + Click to Select Multiple)</label>
      <select id="swal-category" class="swal-select-premium" multiple>
        <option value="Men" ${isEdit && product.category.includes("Men") ? "selected" : ""}>Men's Collection</option>
        <option value="Women" ${isEdit && product.category.includes("Women") ? "selected" : ""}>Women's Collection</option>
        <option value="Casio" ${isEdit && product.category.includes("Casio") ? "selected" : ""}>Casio</option>
        <option value="Maserati" ${isEdit && product.category.includes("Maserati") ? "selected" : ""}>Maserati</option>
        <option value="Tommy Hilfiger" ${isEdit && product.category.includes("Tommy Hilfiger") ? "selected" : ""}>Tommy Hilfiger</option>
      </select>
    </div>
  </div>
`,
      showCancelButton: true,
      confirmButtonText: isEdit ? "Update Inventory" : "Add to Catalog",
      focusConfirm: false,
      customClass: {
        popup: 'swal-premium-popup',
        confirmButton: 'swal-confirm-premium',
        cancelButton: 'swal-cancel-premium'
      },
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const price = document.getElementById("swal-price").value;
        const brand = document.getElementById("swal-brand").value;
        const image = document.getElementById("swal-image").value;
        const category = Array.from(document.getElementById("swal-category").selectedOptions).map((o) => o.value);

        if (!name || !price || !brand || !image || category.length === 0) {
          Swal.showValidationMessage(`Fill all fields & select category`);
          return false;
        }
        return { name, price, brand, image, category };
      }
    });

    if (formValues) {
      try {
        if (isEdit) {
          await API.put(`/api/products/${product._id}`, formValues);
          Swal.fire({ icon: "success", title: "Catalog Updated", showConfirmButton: false, timer: 1500 });
        } else {
          await API.post("/api/products/add", formValues);
          Swal.fire({ icon: "success", title: "Product Added", showConfirmButton: false, timer: 1500 });
        }
        fetchProducts();
      } catch (err) {
        Swal.fire("Error", "Action failed", "error");
      }
    }
  };

  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This timepiece will be removed from inventory!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f43f5e",
      confirmButtonText: "Yes, Delete",
      customClass: { confirmButton: "rounded-pill px-4", cancelButton: "rounded-pill px-4" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await API.delete(`/api/products/${id}`);
        fetchProducts();
        Swal.fire({ icon: "success", title: "Deleted!", showConfirmButton: false, timer: 1500 });
      }
    });
  };

  return (
    <>
      <div className="admin-main-wrapper">
        {/* HEADER */}
        <div className="row align-items-center mb-4 g-3">
          <div className="col-md-7">
            <h2 className="mb-1">Inventory Management</h2>
            <p className="text-muted small">Update, track and manage your watch collections</p>
          </div>

          <div className="col-md-5">
            <div className="stats-glass-card d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="stats-icon-circle">
                  <i className="bi bi-box-seam-fill"></i>
                </div>
                <div>
                  <span className="text-uppercase text-muted fw-bold small">Total Stock</span>
                  <h3 className="mb-0">{products.length}</h3>
                </div>
              </div>
              <button 
                className="action-btn btn-edit shadow-sm px-4 w-auto text-nowrap gap-2" 
                style={{ height: '42px', borderRadius: 'var(--radius-md)', fontWeight: '600' }}
                onClick={() => openProductForm()}
              >
                <i className="bi bi-plus-lg"></i> Add Item
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-bar-container">
          <i className="bi bi-search text-muted me-2"></i>
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by name, brand or model..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          {searchTerm && (
            <button className="border-0 bg-transparent text-muted p-0" onClick={() => setSearchTerm("")}>
              <i className="bi bi-x-circle-fill"></i>
            </button>
          )}
        </div>

        {/* TABLE SYSTEM */}
        <div className="admin-data-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4">PRODUCT DETAILS</th>
                  <th>BRAND</th>
                  <th>CATEGORIES</th>
                  <th>PRICE</th>
                  <th className="text-end pe-4">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <div className="spinner-grow text-primary" role="status" style={{ color: 'var(--primary-color)' }}></div>
                        <p className="mt-2 text-muted small">Syncing inventory...</p>
                      </td>
                    </tr>
                  ) : currentProducts.length > 0 ? (
                    currentProducts.map((item, index) => {
                      // Dynamically assign one of the 4 gradient classes based on index
                      const gradClass = `grad-${(index % 4) + 1}`;
                      
                      return (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: index * 0.03 }}
                          className="admin-table-row"
                          onClick={() => navigate(`/admin/product/${item._id}`)}
                        >
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              {/* Avatar/Image Wrapper */}
                              <div className={`avatar-circle-sm ${gradClass} shadow-sm overflow-hidden`}>
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                                />
                              </div>
                              <div className="ms-3">
                                <div className="fw-bold text-dark">{item.name}</div>
                                <span className="item-id-badge">#{item._id.slice(-6).toUpperCase()}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="status-pill status-inactive">{item.brand}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-1 flex-wrap">
                              {item.category?.map((cat) => (
                                <span key={cat} className="item-id-badge" style={{ fontFamily: 'inherit' }}>{cat}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold text-dark" style={{ fontStyle: 'normal' }}>
                              ₹{item.price.toLocaleString()}
                            </div>
                          </td>
                          <td className="text-end pe-4">
                            <div className="d-flex justify-content-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <button className="action-btn btn-edit" onClick={() => openProductForm(item)}>
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button className="action-btn btn-delete" onClick={() => deleteProduct(item._id)}>
                                <i className="bi bi-trash3-fill"></i>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5 text-muted">No items found.</td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {!loading && filteredProducts.length > 0 && ( 
          <div className="admin-pagination align-items-center mt-4">
            {/* Prev */}
            <button
              className="page-dot"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <i className="bi bi-chevron-left"></i>
            </button>

            {/* Pages */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`page-dot ${currentPage === index + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            {/* Next */}
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
    </>
  );
}

export default Products;