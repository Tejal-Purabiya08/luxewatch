import React, { useEffect, useState ,useCallback} from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;


const fetchWishlist = useCallback(async () => {
  try {
    if (!userId) return;

    const res = await API.get(`/api/wishlist/${userId}`);

    const items = res.data?.items || [];

    setWishlistItems(
      items
        .filter((i) => i.productId)
        .map((i) => ({
          _id: i.productId._id,
          name: i.productId.name,
          image: i.productId.image,
          brand: i.productId.brand,
          price: i.productId.price,
        }))
    );
  } catch (err) {
    console.log(err);
  }
}, [userId]);

useEffect(() => {
  fetchWishlist();
}, [fetchWishlist]);

  // REMOVE ITEM
  const removeItem = async (productId) => {
    try {
      await API.delete(
        `/api/wishlist/remove`,
        {
          data: {
            userId,
            productId,
          },
        }
      );

      setWishlistItems(
        wishlistItems.filter(
          (item) => item._id !== productId
        )
      );

      Swal.fire({
        icon: "success",
        title: "Removed From Wishlist",
        timer: 1200,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff",
      });
    } catch (err) {
      console.log(err);
    }
  };

  // MOVE TO CART
  const moveToCart = async (item) => {
    try {
      await API.post(
        `/api/cart/add`,
        {
          userId,
          productId: item._id,
          quantity: 1,
        }
      );

      Swal.fire({
        icon: "success",
        title: "Added To Cart",
        timer: 1200,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff",
      });
      
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="wishlist-page">
      {/* Background Elements */}
      <div className="bg-gradient-overlay"></div>
      <div className="bg-grid-pattern"></div>

      {/* Floating Orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>

      <div className="container py-5 mt-5 position-relative" style={{ zIndex: 2 }}>
        
        {/* ================= BREADCRUMB NAVIGATION ================= */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb custom-wishlist-breadcrumb">
            <li className="breadcrumb-item">
              <button
                className="btn-wishlist-breadcrumb-link"
                onClick={() => navigate("/home")}
              >
                Home
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              My Wishlist
            </li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* HEADER */}
          <div className="col-12 mb-4 heading-section text-start">
            <span className="section-badge">Favorites</span>
            <h1 className="main-title mb-1">
              My <span className="text-gold">Wishlist</span>
            </h1>
            <p className="subtitle mb-3">
              Keep track of your favorite premium pieces and luxury collections.
            </p>
            <div className="divider-line"></div>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="col-12 text-center py-5 empty-card border shadow-sm rounded-4">
              <div className="mb-3">
                <i className="bi bi-heart text-gold" style={{ fontSize: "3rem" }}></i>
              </div>
              <h4 className="fw-semibold text-white">Your wishlist is empty.</h4>
              <p className="text-muted small">Save your favorite luxury pieces here to review them later.</p>
              <Link
                to="/all-products"
                className="btn btn-modal-primary rounded-pill px-4 mt-2 py-2"
                style={{ fontSize: "14px", fontWeight: "500" }}
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <>
              {/* LEFT SIDE: WISHLIST ITEMS LIST */}
              <div className="col-lg-8">
                {wishlistItems.map((item) => (
                  <div
                    key={item._id}
                    className="item-card-luxury mb-3 p-3 shadow-sm rounded-4"
                  >
                    <div className="row align-items-center g-3">
                      
                      {/* IMAGE */}
                      <div className="col-3 col-md-2 text-center">
                        <div className="wishlist-img-frame">
                          <div className="image-glow"></div>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid position-relative"
                            style={{ zIndex: 1, cursor: 'pointer' }}
                            onClick={() => navigate(`/product/${item._id}`)}
                          />
                        </div>
                      </div>

                      {/* DETAILS */}
                      <div className="col-9 col-md-4 text-start">
                        <span className="brand-label d-block text-uppercase mb-1">
                          {item.brand}
                        </span>
                        <h6 
                          className="product-item-name fw-bold mb-0 text-white"
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/product/${item._id}`)}
                        >
                          {item.name}
                        </h6>
                      </div>

                      {/* PRICE */}
                      <div className="col-6 col-md-3 text-md-center mt-md-0 text-start">
                        <span className="fw-bold d-block card-item-price">
                          ${item.price.toLocaleString()}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="col-6 col-md-3 mt-md-0 d-flex align-items-center justify-content-end gap-3 pe-3">
                        <button
                          className="btn-modal-primary btn-sm rounded-pill px-3 py-2"
                          style={{ fontSize: "12px", fontWeight: "600" }}
                          onClick={() => moveToCart(item)}
                        >
                          Add To Cart
                        </button>
                        
                        <button
                          className="del-btn-custom"
                          onClick={() => removeItem(item._id)}
                          title="Remove item"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT SIDE: SUMMARY/QUICK ACTIONS COLUMN */}
              <div className="col-lg-4">
                <div className="summary-box-luxury p-4 shadow-sm rounded-4 text-center">
                  <h5 className="fw-bold mb-3 pb-2 border-bottom text-white text-start" style={{ borderColor: 'rgba(201,169,98,0.15) !important' }}>
                    Wishlist Actions
                  </h5>
                  <p className="subtitle text-muted small text-start mb-4" style={{ color: 'rgba(255,255,255,0.5) !important' }}>
                    Ready to complete your look? Add items to your shopping cart or continue exploring our luxury catalogs.
                  </p>
                  
                  <button
                    className="btn-modal-primary w-100 mb-3 py-3"
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </button>

                  <button
                    className="btn-modal-secondary w-100 py-2.5"
                    style={{ fontSize: "14px", fontWeight: "600" }}
                    onClick={() => navigate("/all-products")}
                  >
                    View All Products
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= LUXURY APP STYLESHEET ================= */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');

        .wishlist-page {
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
        .orb-1 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(201, 169, 98, 0.2) 0%, transparent 70%); top: -100px; right: -100px; }
        .orb-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%); bottom: 10%; left: -150px; }

        .section-badge {
          display: inline-block;
          padding: 8px 20px;
          background: rgba(201, 169, 98, 0.1);
          border: 1px solid rgba(201, 169, 98, 0.3);
          border-radius: 30px;
          color: #c9a962;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        /* Breadcrumb Style fixes */
        .custom-wishlist-breadcrumb {
          background: transparent;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }
        .btn-wishlist-breadcrumb-link {
          border: none;
          background: none;
          padding: 0;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          transition: color 0.2s;
        }
        .btn-wishlist-breadcrumb-link:hover {
          color: #c9a962;
        }
        .custom-wishlist-breadcrumb .breadcrumb-item.active {
          color: #c9a962;
          font-weight: 600;
        }
        .custom-wishlist-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
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
          font-size: 15px;
        }

        .divider-line {
          height: 2px;
          width: 50px;
          background: linear-gradient(90deg, #c9a962, transparent);
          border-radius: 2px;
        }

        .empty-card {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(201, 169, 98, 0.1) !important;
          backdrop-filter: blur(10px);
          padding: 60px 20px;
        }
        .text-gold { color: #c9a962; }

        /* Upgraded Luxury Wishlist Product View Cards */
        .item-card-luxury {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 169, 98, 0.1);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .item-card-luxury:hover {
          transform: translateY(-4px);
          border-color: rgba(201, 169, 98, 0.3);
          box-shadow: 0 12px 30px rgba(0,0,0,0.4), 0 0 30px rgba(201, 169, 98, 0.05) !important;
        }

        .wishlist-img-frame {
          background: linear-gradient(180deg, rgba(201, 169, 98, 0.05) 0%, rgba(0, 0, 0, 0.2) 100%);
          border-radius: 12px;
          padding: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 75px;
          height: 75px;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(201, 169, 98, 0.05);
        }
        .image-glow {
          position: absolute; width: 80%; height: 80%;
          background: radial-gradient(circle, rgba(201, 169, 98, 0.2) 0%, transparent 70%);
          border-radius: 50%;
        }

        .brand-label {
          font-size: 10px;
          color: #c9a962;
          font-weight: 700;
          letter-spacing: 2px;
        }
        .product-item-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          letter-spacing: 0.2px;
          transition: color 0.3s;
        }
        .product-item-name:hover {
          color: #c9a962 !important;
        }

        .card-item-price {
          font-family: 'Inter', sans-serif;
          font-size: 17px;
          color: #c9a962;
          font-weight: 700;
        }

        /* Cleaned Delete Buttons */
        .del-btn-custom {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.3);
          font-size: 18px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .del-btn-custom:hover {
          color: #ff4757;
          transform: scale(1.1);
        }

        /* Right Hand Column Layout */
        .summary-box-luxury {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 169, 98, 0.1);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 100px;
        }

        /* Luxury Reusable Buttons */
        .btn-modal-primary {
          background: linear-gradient(135deg, #c9a962 0%, #a88a4a 100%);
          border: none;
          color: #0a0a0f;
          border-radius: 40px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s ease;
          letter-spacing: 0.5px;
        }
        .btn-modal-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(201, 169, 98, 0.3);
          color: #0a0a0f;
        }

        .btn-modal-secondary {
          background: transparent;
          border: 1px solid rgba(201, 169, 98, 0.3);
          color: #c9a962;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .btn-modal-secondary:hover {
          background: rgba(201, 169, 98, 0.1);
          border-color: #c9a962;
          color: #c9a962;
        }
      `}</style>
    </div>
  );
}

export default Wishlist;