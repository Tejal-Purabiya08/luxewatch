import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // FILTER STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [priceRange, setPriceRange] = useState(50000);

  // MODAL STATES
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [name]);

  // FILTERED PRODUCTS
  const filteredProducts = products
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((item) =>
      selectedBrand ? item.brand === selectedBrand : true
    )
    .filter((item) =>
      selectedCategory
        ? item.category?.includes(selectedCategory)
        : true
    )
    .filter((item) =>
      selectedColor
        ? item.color?.toLowerCase() === selectedColor.toLowerCase()
        : true
    )
    .filter((item) => item.price <= priceRange)
    .sort((a, b) => {
      if (sortOption === "lowToHigh") {
        return a.price - b.price;
      }
      if (sortOption === "highToLow") {
        return b.price - a.price;
      }
      return 0;
    });

  // UNIQUE VALUES FOR FILTERS
  const brands = [...new Set(products.map((p) => p.brand))];
  const categories = [...new Set(products.flatMap((p) => p.category || []))];
  const colors = [...new Set(products.map((p) => p.color).filter(Boolean))];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products?category=${name}`
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ADD TO CART FUNCTION
  const handleAddToCart = async (product, quantity = 1) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        Swal.fire({
          title: "Login Required",
          text: "Please login first to add items to your cart.",
          icon: "warning",
          confirmButtonColor: "#c9a962",
          background: "#1a1a2e",
          color: "#fff",
        });
        return;
      }

      await axios.post("http://localhost:5000/api/cart/add", {
        userId: user._id,
        productId: product._id,
        quantity,
      });

      Swal.fire({
        icon: "success",
        title: "Added To Cart",
        timer: 1200,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff",
      });

      setShowModal(false);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong while adding to cart.",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  // ADD TO WISHLIST
  const handleAddToWishlist = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        Swal.fire({
          title: "Login Required",
          text: "Please login first",
          icon: "warning",
          confirmButtonColor: "#c9a962",
          background: "#1a1a2e",
          color: "#fff",
        });
        return;
      }

      await axios.post("http://localhost:5000/api/wishlist/add", {
        userId: user._id,
        productId: product._id,
      });

      Swal.fire({
        icon: "success",
        title: "Added To Wishlist",
        timer: 1200,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff",
      });

      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Could not add to wishlist",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  // MODAL HANDLERS
  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setQty(1);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const increaseQty = () => {
    setQty((prev) => prev + 1);
  };

  const decreaseQty = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="allproducts-wrapper">
      {/* Background Elements */}
      <div className="bg-gradient-overlay"></div>
      <div className="bg-grid-pattern"></div>

      {/* Floating Orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      <div className="container py-5 mt-4 position-relative" style={{ zIndex: 2 }}>
        
        {/* BREADCRUMB NAVIGATION */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb custom-category-breadcrumb m-0">
            <li className="breadcrumb-item">
              <button
                className="btn-category-breadcrumb-link"
                onClick={() => navigate("/home")}
              >
                Home
              </button>
            </li>
            <li className="breadcrumb-item active text-gold text-capitalize" aria-current="page">
              {name}
            </li>
          </ol>
        </nav>

        {/* HEADING SECTION */}
        <div className="text-center mb-5 heading-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-badge">Category Collection</span>
            <h2 className="luxury-heading text-capitalize">
              {name} <span className="text-gold">Collection</span>
            </h2>
            <div className="accent-bar mx-auto"></div>
            <p className="section-subtitle">
              Explore our handpicked curation of exceptional timepieces
            </p>
          </motion.div>
        </div>

        {/* PREMIUM FILTERS BAR */}
        <div className="premium-filter-section mb-5 p-4">
          <div className="row g-3 align-items-end">
            <div className="col-lg-3 col-md-6">
              <label className="filter-label">Search Product</label>
              <input
                type="text"
                className="form-control premium-filter-input"
                placeholder="Search watch name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-lg-2 col-md-6">
              <label className="filter-label">Brand</label>
              <select
                className="form-select premium-filter-input"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6">
              <label className="filter-label">Color</label>
              <select
                className="form-select premium-filter-input text-capitalize"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
              >
                <option value="">All Colors</option>
                {colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="col-lg-2 col-md-6">
              <label className="filter-label">Sort By</label>
              <select
                className="form-select premium-filter-input"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Default Sorting</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </select>
            </div>
            <div className="col-lg-3 col-md-12">
              <div className="d-flex justify-content-between filter-label mb-1">
                <span>Max Price:</span>
                <span className="text-gold">${priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                className="form-range premium-range-slider"
                min="0"
                max="100000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID / LOADING STATE */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-gold" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row products-grid-row g-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="col-xl-3 col-lg-4 col-md-6 product-column"
                >
                  <div className="premium-card">
                    {/* CARD IMAGE HOLDER */}
                    <div className="image-holder">
                      <div className="image-glow"></div>
                      <img
                        src={item.image}
                        alt={item.name}
                         onClick={() => navigate(`/product/${item._id}`)}
                        className="main-watch-img"
                      />

                      {/* INTERACTIVE FLOATING STRIP */}
                      <div className="icon-action-strip">
                        <button
                          className="action-circle"
                          title="Wishlist"
                          onClick={() => handleAddToWishlist(item)}
                        >
                          <i className="bi bi-heart"></i>
                        </button>

                        <button
                          className="action-circle gold-fill"
                          title="Add to Cart"
                          onClick={() => handleAddToCart(item, 1)}
                        >
                          <i className="bi bi-bag-plus"></i>
                        </button>

                        <button
                          className="action-circle"
                          title="Quick View"
                          onClick={() => openModal(item)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>

                      {/* Badge */}
                      <div className="card-badge">New</div>
                    </div>

                    {/* PRODUCT METADATA */}
                    <div className="card-info text-center pt-4 pb-4 px-3">
                      <span className="brand-badge">{item.brand}</span>
                      <h5 className="product-title">{item.name}</h5>
                      <div className="price-divider"></div>
                      <p className="price-label">
                        ₹{item.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            className="empty-state text-center py-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="empty-icon">
              <i className="bi bi-watch"></i>
            </div>
            <h3>No Products Found</h3>
            <p>Try adjusting your search filters or check back soon</p>
          </motion.div>
        )}
      </div>

      {/* PREMIUM QUICK VIEW MODAL */}
      <AnimatePresence>
        {showModal && selectedProduct && (
          <motion.div
            className="custom-modal-overlay"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="custom-modal-box"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>

              <div className="row align-items-center g-4 modal-content-row">
                {/* Left Column: Media Showcase */}
                <div className="col-md-6 text-center">
                  <div className="modal-image-wrapper">
                    <div className="modal-image-glow"></div>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="img-fluid modal-image"
                    />
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="col-md-6 ps-lg-4 content-column">
                  <span className="modal-brand-badge">
                    {selectedProduct.brand}
                  </span>
                  <h2 className="modal-product-title mt-1">
                    {selectedProduct.name}
                  </h2>
                  <div className="price-divider left-align"></div>
                  <h3 className="modal-price-tag my-3">
                    ₹{selectedProduct.price?.toLocaleString()}
                  </h3>
                  <p className="modal-description">
                    Experience the pinnacle of fine luxury. Crafted with
                    meticulous attention to detail, premium materials, and
                    unparalleled performance for the modern lifestyle.
                  </p>

                  {/* Counter Selector */}
                  <div className="minimal-qty-selector mb-4">
                    <button onClick={decreaseQty} className="qty-btn">
                      <i className="bi bi-dash"></i>
                    </button>
                    <span className="qty-value">{qty}</span>
                    <button onClick={increaseQty} className="qty-btn">
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>

                  {/* Action CTA Block */}
                  <div className="d-flex align-items-center gap-3 actions-btn-group">
                    <button
                      className="btn-modal-secondary flex-grow-1"
                      onClick={() => handleAddToWishlist(selectedProduct)}
                    >
                      <i className="bi bi-heart me-2"></i>
                      Wishlist
                    </button>
                    <button
                      className="btn-modal-primary flex-grow-1"
                      onClick={() => handleAddToCart(selectedProduct, qty)}
                    >
                      <i className="bi bi-bag-plus me-2"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM DARK THEME CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

        .allproducts-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          padding-bottom: 60px;
        }

        /* Breadcrumb Design */
        .custom-category-breadcrumb {
          background: transparent;
          padding: 0;
        }
        .btn-category-breadcrumb-link {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          padding: 0;
          font-size: 14px;
          transition: color 0.3s ease;
        }
        .btn-category-breadcrumb-link:hover {
          color: #c9a962;
        }
        .breadcrumb-item + .breadcrumb-item::before {
          color: rgba(255, 255, 255, 0.3) !important;
        }

        /* Background Effects */
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

        /* Floating Orbs */
        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
        }
        .orb-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(201, 169, 98, 0.3) 0%, transparent 70%); top: -100px; right: -100px; animation: float1 20s ease-in-out infinite; }
        .orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(201, 169, 98, 0.2) 0%, transparent 70%); bottom: 20%; left: -150px; animation: float2 25s ease-in-out infinite; }
        .orb-3 { width: 250px; height: 250px; background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%); top: 50%; right: 10%; animation: float3 18s ease-in-out infinite; }

        @keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-30px, 30px) scale(1.1); } }
        @keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, -20px) scale(1.05); } }
        @keyframes float3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20px, 40px) scale(0.95); } }

        /* Section Header */
        .section-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(201, 169, 98, 0.1);
          border: 1px solid rgba(201, 169, 98, 0.3);
          border-radius: 30px;
          color: #c9a962;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .luxury-heading {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          color: #ffffff;
          font-weight: 600;
          letter-spacing: -0.5px;
        }
        .text-gold { color: #c9a962; font-style: italic; font-weight: 500; }
        .accent-bar { width: 60px; height: 2px; background: linear-gradient(90deg, transparent, #c9a962, transparent); margin-top: 20px; }
        .section-subtitle { color: rgba(255, 255, 255, 0.5); font-size: 16px; margin-top: 16px; }

        /* Premium Filters Section */
        .premium-filter-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(201, 169, 98, 0.15);
          border-radius: 20px;
          backdrop-filter: blur(15px);
        }
        .filter-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }
        .premium-filter-input {
          background-color: rgba(10, 10, 15, 0.6) !important;
          border: 1px solid rgba(201, 169, 98, 0.2) !important;
          color: #ffffff !important;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        .premium-filter-input:focus {
          border-color: #c9a962 !important;
          box-shadow: 0 0 10px rgba(201, 169, 98, 0.15) !important;
        }
        .premium-filter-input option {
          background-color: #1a1a2e;
          color: #fff;
        }
        .premium-range-slider::-webkit-slider-thumb { background: #c9a962; }
        .premium-range-slider::-moz-range-thumb { background: #c9a962; }
        .spinner-border.text-gold { color: #c9a962; }

        /* Premium Product Card */
        .premium-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          border: 1px solid rgba(201, 169, 98, 0.1);
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
        }
        .premium-card:hover {
          transform: translateY(-12px);
          border-color: rgba(201, 169, 98, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4), 0 0 40px rgba(201, 169, 98, 0.1);
        }

        .image-holder {
          background: linear-gradient(180deg, rgba(201, 169, 98, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          aspect-ratio: 1 / 1;
          padding: 20px;
        }
        .image-glow {
          position: absolute; width: 60%; height: 60%;
          background: radial-gradient(circle, rgba(201, 169, 98, 0.2) 0%, transparent 70%);
          border-radius: 50%; opacity: 0; transition: opacity 0.5s ease;
        }
        .premium-card:hover .image-glow { opacity: 1; }

        .main-watch-img {
          width: 100%; height: 100%; object-fit: cover; border-radius: 12px;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; position: relative; z-index: 1;
        }
        .premium-card:hover .main-watch-img { transform: scale(1.08); }

        .card-badge {
          position: absolute; top: 16px; left: 16px; padding: 6px 14px;
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          color: #0a0a0f; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 20px; z-index: 2;
        }

        /* Floating Action Strip */
        .icon-action-strip {
          position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%);
          display: flex; background: rgba(26, 26, 46, 0.95); padding: 8px; border-radius: 40px;
          border: 1px solid rgba(201, 169, 98, 0.2); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          gap: 8px; opacity: 0; backdrop-filter: blur(10px); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 3;
        }
        .premium-card:hover .icon-action-strip { bottom: 16px; opacity: 1; }

        .action-circle {
          width: 42px; height: 42px; border-radius: 50%; border: 1px solid rgba(201, 169, 98, 0.2);
          background: rgba(255, 255, 255, 0.05); color: rgba(255, 255, 255, 0.7);
          display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; font-size: 16px;
        }
        .action-circle:hover { background: rgba(201, 169, 98, 0.2); border-color: #c9a962; color: #c9a962; transform: scale(1.1); }
        .action-circle.gold-fill { background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%); border: none; color: #0a0a0f; }
        .action-circle.gold-fill:hover { background: linear-gradient(135deg, #d4b46e 0%, #c9a962 100%); box-shadow: 0 4px 20px rgba(201, 169, 98, 0.4); }

        /* Product Details */
        .card-info { background: rgba(0, 0, 0, 0.2); border-top: 1px solid rgba(201, 169, 98, 0.1); }
        .brand-badge { font-size: 10px; text-transform: uppercase; font-weight: 700; color: #c9a962; letter-spacing: 2.5px; display: block; margin-bottom: 8px; }
        .product-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8px; }
        .price-divider { width: 30px; height: 1px; background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.5), transparent); margin: 12px auto; }
        .price-divider.left-align { margin: 12px 0; width: 50px; background: linear-gradient(90deg, #c9a962, transparent); }
        .price-label { font-family: 'Inter', sans-serif; font-size: 1.25rem; font-weight: 700; color: #c9a962; margin: 0; letter-spacing: 0.5px; }

        /* Empty State */
        .empty-state { color: rgba(255, 255, 255, 0.5); }
        .empty-icon { width: 100px; height: 100px; border-radius: 50%; background: rgba(201, 169, 98, 0.1); border: 1px solid rgba(201, 169, 98, 0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 40px; color: #c9a962; }
        .empty-state h3 { color: #ffffff; font-family: 'Playfair Display', serif; margin-bottom: 8px; }

        /* Modal Styles */
        .custom-modal-overlay { position: fixed; inset: 0; background: rgba(10, 10, 15, 0.9); backdrop-filter: blur(20px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .custom-modal-box { background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%); width: 100%; max-width: 900px; border-radius: 28px; padding: 48px; position: relative; border: 1px solid rgba(201, 169, 98, 0.2); box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(201, 169, 98, 0.1); }
        .modal-close { position: absolute; top: 24px; right: 24px; width: 48px; height: 48px; border: 1px solid rgba(201, 169, 98, 0.2); border-radius: 50%; background: rgba(255, 255, 255, 0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255, 255, 255, 0.7); transition: all 0.3s ease; }
        .modal-close:hover { background: #c9a962; border-color: #c9a962; color: #0a0a0f; transform: rotate(90deg); }

        .modal-image-wrapper { background: linear-gradient(180deg, rgba(201, 169, 98, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%); border-radius: 20px; padding: 40px; display: flex; align-items: center; justify-content: center; aspect-ratio: 1 / 1; border: 1px solid rgba(201, 169, 98, 0.1); position: relative; overflow: hidden; }
        .modal-image-glow { position: absolute; width: 70%; height: 70%; background: radial-gradient(circle, rgba(201, 169, 98, 0.2) 0%, transparent 70%); border-radius: 50%; }
        .modal-image { max-height: 100%; object-fit: contain; position: relative; z-index: 1; }

        .modal-brand-badge { font-size: 12px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #c9a962; display: inline-block; }
        .modal-product-title { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 600; color: #ffffff; line-height: 1.2; }
        .modal-price-tag { font-family: 'Inter', sans-serif; color: #c9a962; font-size: 2rem; font-weight: 700; letter-spacing: 0.5px; }
        .modal-description { color: rgba(255, 255, 255, 0.5); line-height: 1.8; font-size: 15px; margin-bottom: 28px; }

        .minimal-qty-selector { display: inline-flex; align-items: center; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(201, 169, 98, 0.2); border-radius: 40px; padding: 6px; }
        .qty-btn { width: 40px; height: 40px; border: none; border-radius: 50%; background: rgba(201, 169, 98, 0.1); color: #c9a962; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; font-size: 18px; }
        .qty-btn:hover { background: rgba(201, 169, 98, 0.2); }
        .qty-value { min-width: 50px; text-align: center; font-weight: 700; font-size: 16px; color: #ffffff; }

        .btn-modal-primary { background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%); border: none; color: #0a0a0f; padding: 16px 32px; border-radius: 40px; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.4s ease; letter-spacing: 0.5px; }
        .btn-modal-primary:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(201, 169, 98, 0.3); }
        .btn-modal-secondary { background: transparent; border: 1px solid rgba(201, 169, 98, 0.3); color: #c9a962; padding: 16px 32px; border-radius: 40px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.4s ease; }
        .btn-modal-secondary:hover { background: rgba(201, 169, 98, 0.1); border-color: #c9a962; }

        /* Responsive */
        @media (max-width: 992px) { .luxury-heading { font-size: 2.5rem; } }
        @media (max-width: 768px) {
          .custom-modal-box { padding: 32px 24px; }
          .actions-btn-group { flex-direction: column; gap: 12px !important; }
          .modal-product-title { font-size: 1.8rem; }
          .luxury-heading { font-size: 2rem; }
          .modal-image-wrapper { padding: 24px; }
        }
        @media (max-width: 576px) {
          .section-badge { font-size: 10px; padding: 6px 16px; }
          .luxury-heading { font-size: 1.75rem; }
          .premium-card { border-radius: 16px; }
          .image-holder { padding: 16px; }
        }
      `}</style>
    </div>
  );
}

export default CategoryPage;