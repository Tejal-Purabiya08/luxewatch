import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import Hero from "./Hero";

function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [visibleCount, setVisibleCount] = useState(8);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
      setFiltered(res.data);

      const cats = ["All", ...new Set(res.data.flatMap((p) => p.category))];
      setCategories(cats);
    } catch (error) {
      console.log("Error fetching products", error);
    }
  };

  // Search aur Filter logic
  useEffect(() => {
    let result = products;

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category.includes(activeCategory));
    }

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFiltered(result);
    setVisibleCount(8);
  }, [activeCategory, searchTerm, products]);

  // ADD TO CART WITH LIVE UPDATE
  const addToCart = async (product, quantity = 1) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        Swal.fire({
          title: "Login Required",
          text: "Please login first to add items to your cart.",
          icon: "warning",
          confirmButtonColor: "#c9a962",
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
      });

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Could not add to cart", "error");
    }
  };

  const addToWishlist = async (product) => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!user) {

      Swal.fire({
        title: "Login Required",
        text: "Please login first",
        icon: "warning",
        confirmButtonColor: "#c9a962",
      });

      return;
    }

    await axios.post(
      "http://localhost:5000/api/wishlist/add",
      {
        userId: user._id,
        productId: product._id,
      }
    );

    Swal.fire({
      icon: "success",
      title: "Added To Wishlist",
      timer: 1200,
      showConfirmButton: false,
    });

  } catch (err) {

    console.log(err);

    Swal.fire(
      "Error",
      "Could not add to wishlist",
      "error"
    );
  }
};

  // MODAL HANDLERS
  const openModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setQty(1); // reset counter to 1
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const increaseQty = () => {
    setQty((prev) => prev + 1);
  };

  const decreaseQty = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="home-wrapper">
      <Hero />

      <div className="container py-5 mt-4">
        {/* SEARCH + CATEGORY FILTER PANEL */}
        <div className="row mb-5 align-items-center filter-panel-row">
          <div className="col-md-5">
            <div className="clean-search-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="clean-search-input"
                placeholder="Search premium timepieces..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-7">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end mt-3 mt-md-0 filter-pills-container">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className={`minimal-pill ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* HEADING ACCENT */}
        <div className="text-center mb-5 heading-section">
          <h2 className="luxury-heading">
            Our <span className="text-gold">Collection</span>
          </h2>
          <div className="accent-bar mx-auto"></div>
        </div>

        {/* PRODUCTS GRID WITH STAGGERED ANIMATION */}
        <div className="row products-grid-row">
          <AnimatePresence mode="popLayout">
            {filtered.slice(0, visibleCount).map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="col-lg-3 col-md-6 mb-5 product-column"
              >
                <div className="premium-card">
                  {/* CARD IMAGE HOLDER (NOW FULL CARD WIDTH) */}
                  <div className="image-holder">
                    <img
                      src={item.image}
                      alt={item.name}
                      onClick={() => navigate(`/category/${item.category[0]}`)}
                      className="main-watch-img"
                    />

                    {/* INTERACTIVE FLOATING STRIP (UNTOUCHED AS REQUESTED) */}
                    <div className="icon-action-strip">
                      <button
  className="action-circle"
  title="Wishlist"
  onClick={() => addToWishlist(item)}
>
  <i className="bi bi-heart"></i>
</button>

                      <button
                        className="action-circle gold-fill"
                        title="Add to Cart"
                        onClick={() => addToCart(item)}
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
                  </div>

                  {/* PRODUCT METADATA (DESIGN MATCHED WITH PRODUCT DETAILS) */}
                  <div className="card-info text-center pt-4 pb-3 px-3">
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

        {/* LOAD MORE BUTTON */}

        <div className="text-center mt-4">
          <button
            className="load-more-btn"
            onClick={() => navigate("/all-products")}
          >
            View All Products
          </button>
        </div>
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
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="img-fluid modal-image"
                    />
                  </div>
                </div>

                {/* Right Column: Configuration details */}
                <div className="col-md-6 ps-lg-4 content-column">
                  <span className="modal-brand-badge">
                    {selectedProduct.brand}
                  </span>
                  <h2 className="modal-product-title mt-1">
                    {selectedProduct.name}
                  </h2>
                  <div className="price-divider left-align"></div>
                  <h3 className="modal-price-tag my-3">
                    ₹{selectedProduct.price.toLocaleString()}
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
                      onClick={() => addToWishlist(selectedProduct)}
                    >
                      Add to Wishlist
                    </button>
                    <button
                      className="btn-modal-primary flex-grow-1"
                      onClick={() => addToCart(selectedProduct, qty)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= WHY CHOOSE US PREMIUM SECTION ================= */}
<div className="container my-5 py-5 trust-section-wrapper">
  <div className="text-center mb-5 heading-section">
    <h2 className="luxury-heading">
      Why <span className="text-gold">Choose Us</span>
    </h2>
    <div className="accent-bar mx-auto"></div>
    <p className="mt-3 section-subtitle">
      Experience luxury shopping with trust, quality, and elegance.
    </p>
  </div>

  <div className="row g-4 justify-content-center">
    {/* Card 1 */}
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="trust-card">
        <div className="trust-icon-wrapper">
          <div className="trust-icon">
            <i className="bi bi-truck"></i>
          </div>
        </div>
        <h5 className="trust-title">Free Delivery</h5>
        <p className="trust-desc">Fast & secure shipping directly to your doorstep.</p>
      </div>
    </div>

    {/* Card 2 */}
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="trust-card">
        <div className="trust-icon-wrapper">
          <div className="trust-icon">
            <i className="bi bi-shield-check"></i>
          </div>
        </div>
        <h5 className="trust-title">100% Authentic</h5>
        <p className="trust-desc">Only original luxury timepieces guaranteed.</p>
      </div>
    </div>

    {/* Card 3 */}
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="trust-card">
        <div className="trust-icon-wrapper">
          <div className="trust-icon">
            <i className="bi bi-arrow-repeat"></i>
          </div>
        </div>
        <h5 className="trust-title">Easy Returns</h5>
        <p className="trust-desc">Hassle-free 7-day premium return policy.</p>
      </div>
    </div>

    {/* Card 4 */}
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="trust-card">
        <div className="trust-icon-wrapper">
          <div className="trust-icon">
            <i className="bi bi-headset"></i>
          </div>
        </div>
        <h5 className="trust-title">24/7 Support</h5>
        <p className="trust-desc">Dedicated concierge team always ready to help.</p>
      </div>
    </div>
  </div>
</div>

      {/* ================= SCOPED IN-COMPONENT CSS SYSTEM ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        /* GLOBAL LAYOUT & NEW FONTS */
        html, body {
          overflow-x: hidden;
          width: 100%;
          margin: 0;
          padding: 0;
          background-color: #0a0a0f; 
          font-family: 'Plus Jakarta Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        * {
          box-sizing: border-box;
        }

        .home-wrapper {
          width: 100%;
          overflow-x: hidden;
          background: linear-gradient(180deg, #0a0a0f 0%, #0d0d14 50%, #0a0a0f 100%);
          min-height: 100vh;
        }

        .row {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }

        img {
          max-width: 100%;
          display: block;
        }

        .container {
          position: relative;
          z-index: 1;
        }

        /* SEARCH BAR & FILTERS - PREMIUM GOLD THEME */
        .clean-search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 169, 98, 0.2);
          padding: 14px 20px;
          border-radius: 50px;
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .clean-search-wrapper:focus-within {
          border-color: rgba(201, 169, 98, 0.5);
          box-shadow: 0 0 30px rgba(201, 169, 98, 0.1);
          background: rgba(255, 255, 255, 0.05);
        }

        .search-icon {
          color: #c9a962;
          font-size: 16px;
        }

        .clean-search-input {
          border: none;
          outline: none;
          width: 100%;
          background: transparent;
          margin-left: 12px;
          font-size: 14px;
          color: #ffffff;
          font-weight: 400;
        }

        .clean-search-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .minimal-pill {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          padding: 10px 24px;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(5px);
        }

        .minimal-pill:hover {
          background: rgba(201, 169, 98, 0.1);
          color: #c9a962;
          border-color: rgba(201, 169, 98, 0.3);
        }

        .minimal-pill.active {
          background: linear-gradient(135deg, #c9a962, #d4af37);
          color: #0a0a0f;
          border-color: transparent;
          box-shadow: 0 8px 25px rgba(201, 169, 98, 0.3);
          font-weight: 600;
        }

        /* SECTION HEADER */
        .luxury-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .text-gold {
          background: linear-gradient(135deg, #c9a962, #f0d78c, #c9a962);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: italic;
          font-weight: 400;
        }

        .accent-bar {
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c9a962, transparent);
          margin-top: 18px;
          border-radius: 1px;
        }

        /* PREMIUM PRODUCTS CARD ARCHITECTURE */
        .premium-card {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 20px;
          padding: 0px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
        }

        .premium-card:hover {
          transform: translateY(-12px);
          border-color: rgba(201, 169, 98, 0.3);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(201, 169, 98, 0.1);
        }

        .image-holder {
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border-radius: 20px 20px 0 0;
          padding: 0px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 1 / 1;
          transition: all 0.4s ease;
        }

        .premium-card:hover .image-holder {
          background: linear-gradient(180deg, rgba(201, 169, 98, 0.05) 0%, rgba(255,255,255,0.02) 100%);
        }

        .main-watch-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .premium-card:hover .main-watch-img {
          transform: scale(1.08);
        }

        /* FLOATING ACTION STRIP */
        .icon-action-strip {
          position: absolute;
          bottom: -50px; 
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(20px);
          padding: 8px;
          border-radius: 40px;
          border: 1px solid rgba(201, 169, 98, 0.2);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
          gap: 8px;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .premium-card:hover .icon-action-strip {
          bottom: 16px; 
          opacity: 1;
        }

        .action-circle {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
        }

        .action-circle:hover {
          background: rgba(201, 169, 98, 0.2);
          color: #c9a962;
          transform: scale(1.1);
        }

        .action-circle:active {
          transform: scale(0.95);
        }

        .action-circle.gold-fill {
          background: linear-gradient(135deg, #c9a962, #d4af37);
          color: #0a0a0f;
        }

        .action-circle.gold-fill:hover {
          box-shadow: 0 0 20px rgba(201, 169, 98, 0.5);
          transform: scale(1.1);
        }

        /* PRODUCT DETAILS SYNCED METADATA */
        .card-info {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .brand-badge {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          color: #c9a962;
          letter-spacing: 3px;
          display: block;
          margin-bottom: 8px;
        }

        .product-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 8px;
          padding: 0 4px;
        }

        .price-divider {
          width: 30px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.5), transparent);
          margin: 12px auto;
        }
        
        .price-divider.left-align {
          margin: 12px 0;
          width: 50px;
          background: linear-gradient(90deg, #c9a962, transparent);
        }

        .price-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #c9a962;
          margin: 0;
          letter-spacing: 0.5px;
        }

        /* MODAL ARCHITECTURE WITH LUXURY SYNC */
        .custom-modal-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .custom-modal-box {
          background: linear-gradient(180deg, #12121a 0%, #0a0a0f 100%);
          width: 100%;
          max-width: 900px;
          border-radius: 28px;
          padding: 45px;
          position: relative;
          border: 1px solid rgba(201, 169, 98, 0.2);
          box-shadow: 0 50px 100px rgba(0, 0, 0, 0.6), 0 0 60px rgba(201, 169, 98, 0.1);
        }

        .modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.4s ease;
        }

        .modal-close:hover {
          background: #c9a962;
          color: #0a0a0f;
          border-color: #c9a962;
          transform: rotate(90deg);
        }

        .modal-image-wrapper {
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
          border-radius: 20px;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          aspect-ratio: 1 / 1;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-image {
          max-height: 100%;
          object-fit: contain;
        }

        .modal-brand-badge {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #c9a962;
          display: inline-block;
        }

        .modal-product-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }

        .modal-price-tag {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #c9a962;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .modal-description {
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.8;
          font-size: 14px;
          margin-bottom: 24px;
          font-weight: 400;
        }

        .minimal-qty-selector {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 40px;
          padding: 6px;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .qty-btn:hover {
          background: rgba(201, 169, 98, 0.2);
          color: #c9a962;
        }

        .qty-value {
          min-width: 50px;
          text-align: center;
          font-weight: 600;
          font-size: 15px;
          color: #ffffff;
        }

        .btn-modal-primary {
          background: linear-gradient(135deg, #c9a962, #d4af37);
          border: none;
          color: #0a0a0f;
          padding: 16px 32px;
          border-radius: 40px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 10px 30px rgba(201, 169, 98, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-modal-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(201, 169, 98, 0.4);
        }

        .btn-modal-secondary {
          background: transparent;
          border: 1px solid rgba(201, 169, 98, 0.3);
          color: #c9a962;
          padding: 16px 32px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.4s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-modal-secondary:hover {
          background: rgba(201, 169, 98, 0.1);
          border-color: #c9a962;
        }

        /* RESPONSIVE ADAPTIVE BREAKPOINTS */
        @media (max-width: 768px) {
          .custom-modal-box { padding: 32px 20px; }
          .actions-btn-group { flex-direction: column; gap: 12px !important; }
          .modal-product-title { font-size: 1.75rem; }
          .luxury-heading { font-size: 2rem; }
        }

        /* LOAD MORE BUTTON */
        .load-more-btn {
          background: linear-gradient(135deg, #c9a962, #d4af37);
          color: #0a0a0f;
          border: none;
          padding: 16px 40px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s ease;
          box-shadow: 0 15px 40px rgba(201, 169, 98, 0.25);
        }

        .load-more-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 50px rgba(201, 169, 98, 0.35);
        }

        .load-more-btn:active {
          transform: scale(0.97);
        }

        /* WHY CHOOSE US - LUXURY STYLES */
        .trust-section-wrapper {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .section-subtitle {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.5px;
        }

        .trust-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 45px 28px;
          text-align: center;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .trust-card:hover {
          transform: translateY(-12px);
          border-color: rgba(201, 169, 98, 0.3);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(201, 169, 98, 0.1);
        }

        .trust-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(201, 169, 98, 0.05);
          border-radius: 50%;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .trust-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 169, 98, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #c9a962;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .trust-card:hover .trust-icon-wrapper {
          background: rgba(201, 169, 98, 0.1);
          transform: scale(1.1);
        }

        .trust-card:hover .trust-icon {
          background: linear-gradient(135deg, #c9a962, #d4af37);
          color: #0a0a0f;
          border-color: transparent;
          box-shadow: 0 0 30px rgba(201, 169, 98, 0.4);
        }

        .trust-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 600;
          margin-bottom: 14px;
          color: #ffffff;
          transition: color 0.3s ease;
        }

        .trust-card:hover .trust-title {
          color: #c9a962;
        }

        .trust-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.45);
          margin: 0;
          line-height: 1.7;
          font-weight: 400;
        }

        @media (max-width: 576px) {
          .trust-card {
            padding: 35px 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
