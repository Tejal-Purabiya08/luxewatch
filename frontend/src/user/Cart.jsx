import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (!userId) return;

        const res = await API.get(
          `/api/cart/${userId}`
        );

        const items = res.data?.items || [];

        setCartItems(
          items
            .filter((i) => i.productId)
            .map((i) => ({
              _id: i.productId._id,
              name: i.productId.name,
              price: i.productId.price,
              image: i.productId.image,
              brand: i.productId.brand,
              quantity: i.quantity || 1,
            }))
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, [userId]);

  // ✅ UPDATE QUANTITY
  const updateQuantity = async (index, type) => {
    const updated = [...cartItems];

    if (type === "inc") {
      updated[index].quantity += 1;
    }

    if (type === "dec" && updated[index].quantity > 1) {
      updated[index].quantity -= 1;
    }

    setCartItems(updated);

    try {
      await API.post(
        "/api/cart/save",
        {
          userId,
          items: updated.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ REMOVE ITEM
  const removeItem = async (productId) => {
    try {
      await API.delete(
        `/api/cart/remove`,
        {
          data: {
            userId,
            productId,
          },
        }
      );

      const updated = cartItems.filter(
        (item) => item._id !== productId
      );

      setCartItems(updated);

      await API.post(
        "/api/cart/save",
        {
          userId,
          items: updated.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
        }
      );

      Swal.fire({
        title: "Removed",
        text: "Item removed from cart",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff",
      });
      
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ COUPON HANDLER
  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      Swal.fire({
        title: "Empty Code",
        text: "Please enter a coupon code first.",
        icon: "warning",
        background: "#1a1a2e",
        color: "#fff"
      });
      return;
    }

    if (coupon.toUpperCase() === "LUXURY10") {
      const discountAmount = totalPrice * 0.10;
      setDiscount(discountAmount);
      setCouponApplied(true);
      Swal.fire({
        title: "Success!",
        text: "10% discount applied successfully.",
        icon: "success",
        background: "#1a1a2e",
        color: "#fff"
      });
    } else if (coupon.toUpperCase() === "WELCOME500") {
      setDiscount(totalPrice > 2000 ? 500 : 0);
      setCouponApplied(true);
      Swal.fire({
        title: "Success!",
        text: "Flat $500 discount applied.",
        icon: "success",
        background: "#1a1a2e",
        color: "#fff"
      });
    } else {
      Swal.fire({
        title: "Invalid Coupon",
        text: "This promo code does not exist.",
        icon: "error",
        background: "#1a1a2e",
        color: "#fff"
      });
    }
  };

  // ✅ REMOVE COUPON
  const handleRemoveCoupon = () => {
    setCoupon("");
    setDiscount(0);
    setCouponApplied(false);
    Swal.fire({
      title: "Removed",
      text: "Coupon code removed.",
      icon: "info",
      background: "#1a1a2e",
      color: "#fff"
    });
  };

  // ✅ TOTALS
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (t, item) => t + Number(item.price) * item.quantity,
      0
    );
  }, [cartItems]);

  const gst = useMemo(() => {
    const taxableAmount = totalPrice - discount;
    return taxableAmount > 0 ? taxableAmount * 0.18 : 0;
  }, [totalPrice, discount]);

  const finalTotal = useMemo(() => {
    const netTotal = totalPrice - discount + gst;
    return netTotal > 0 ? netTotal : 0;
  }, [totalPrice, discount, gst]);

  return (
    <div className="cart-page">
      {/* Background Elements */}
      <div className="bg-gradient-overlay"></div>
      <div className="bg-grid-pattern"></div>

      {/* Floating Orbs */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>

      <div className="container py-5 mt-5 position-relative" style={{ zIndex: 2 }}>
        
        {/* ================= BREADCRUMB NAVIGATION ================= */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb custom-cart-breadcrumb">
            <li className="breadcrumb-item">
              <button
                className="btn-cart-breadcrumb-link"
                onClick={() => navigate("/home")}
              >
                Home
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Shopping Cart
            </li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* HEADER */}
          <div className="col-12 mb-4 heading-section text-start">
            <span className="section-badge">Your Bag</span>
            <h1 className="main-title mb-1">
              Shopping <span className="text-gold">Cart</span>
            </h1>
            <p className="subtitle mb-3">
              Verify your premium product selection before proceeding to checkout.
            </p>
            <div className="divider-line"></div>
          </div>

          {cartItems.length === 0 ? (
            <div className="col-12 text-center py-5 empty-card border shadow-sm rounded-4">
              <div className="mb-3">
                <i className="bi bi-bag-x text-gold" style={{ fontSize: "3rem" }}></i>
              </div>
              <h4 className="fw-semibold text-white">Your cart feels light.</h4>
              <p className="text-muted small">Add items from our collection to check out options here.</p>
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
              {/* LEFT SIDE: PRODUCTS LIST */}
              <div className="col-lg-8">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="item-card-luxury mb-3 p-3 shadow-sm rounded-4"
                  >
                    <div className="row align-items-center g-3">
                      
                      {/* IMAGE */}
                      <div className="col-3 col-md-2 text-center">
                        <div className="cart-img-frame">
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

                      {/* QUANTITY COUNTER */}
                      <div className="col-6 col-md-3 mt-md-0 d-flex justify-content-start justify-content-md-center">
                        <div className="qty-box-custom">
                          <button
                            onClick={() => updateQuantity(index, "dec")}
                            className="qty-action-btn"
                          >
                            −
                          </button>
                          <span className="qty-count-val">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, "inc")}
                            className="qty-action-btn"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="col-4 col-md-2 text-md-center mt-md-0 text-start">
                        <span className="fw-bold d-block card-item-price">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* DELETE ACTION */}
                      <div className="col-2 col-md-1 text-end pe-3 mt-md-0">
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

              {/* RIGHT SIDE: SUMMARY COLUMN */}
              <div className="col-lg-4">
                <div className="summary-box-luxury p-4 shadow-sm rounded-4">
                  <h5 className="fw-bold mb-4 pb-2 border-bottom text-white text-start" style={{ borderColor: 'rgba(201,169,98,0.15)' }}>
                    Order Summary
                  </h5>

                  {/* PROMO INPUT BOX */}
                  <div className="coupon-wrapper mb-4 text-start">
                    <label className="form-label subtitle small text-muted fw-semibold mb-2" style={{ color: 'rgba(255,255,255,0.6) !important' }}>
                      Have a Promo Code?
                    </label>
                    <div className="input-group custom-coupon-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. LUXURY10"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        disabled={couponApplied}
                      />
                      {couponApplied ? (
                        <button 
                          className="btn btn-outline-danger px-3" 
                          type="button"
                          onClick={handleRemoveCoupon}
                          style={{ borderRadius: '0 40px 40px 0', fontSize: '13px', fontWeight: '600' }}
                        >
                          Remove
                        </button>
                      ) : (
                        <button 
                          className="btn-modal-primary px-4" 
                          type="button"
                          onClick={handleApplyCoupon}
                          style={{ borderRadius: '0 40px 40px 0', fontSize: '13px' }}
                        >
                          Apply
                        </button>
                      )}
                    </div>
                    {couponApplied && (
                      <div className="text-success small mt-2 fw-semibold">
                        Code applied successfully!
                      </div>
                    )}
                  </div>

                  {/* COMPUTED PRICES SUMMARY */}
                  <div className="summary-details text-start">
                    <div className="d-flex justify-content-between mb-2.5">
                      <span className="text-muted small subtitle">Subtotal</span>
                      <span className="fw-medium text-white">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="d-flex  justify-content-between mb-2.5 text-success small fw-medium">
                        <span className="subtitle">Discount</span>
                        <span>- ${(discount).toLocaleString()}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between mb-2.5">
                      <span className="text-muted small subtitle">GST (18%)</span>
                      <span className="fw-medium text-white">
                        ${gst.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between mt-3 pt-3 border-top" style={{ borderColor: 'rgba(201,169,98,0.15) !important' }}>
                      <span className="h5 fw-bold text-white">Total</span>
                      <span className="h5 fw-bold text-gold-total">
                        ${finalTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </span>
                    </div>
                  </div>

                  {/* CHECKOUT SUBMIT LINK */}
                  <button
                    className="btn-modal-primary w-100 mt-4 py-3"
                    onClick={() =>
                      navigate("/checkout", {
                        state: {
                          cartItems,
                          subtotal: totalPrice,
                          gst,
                          discount,
                          coupon,
                          finalTotal,
                        },
                      })
                    }
                  >
                    Secure Checkout
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

        .cart-page {
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
        .custom-cart-breadcrumb {
          background: transparent;
          padding: 0;
          margin: 0;
          font-size: 13px;
        }
        .btn-cart-breadcrumb-link {
          border: none;
          background: none;
          padding: 0;
          color: rgba(255, 255, 255, 0.4);
          font-weight: 500;
          transition: color 0.2s;
        }
        .btn-cart-breadcrumb-link:hover {
          color: #c9a962;
        }
        .custom-cart-breadcrumb .breadcrumb-item.active {
          color: #c9a962;
          font-weight: 600;
        }
        .custom-cart-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
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
        .text-gold-total {
          color: #c9a962;
          font-weight: 700;
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

        /* Upgraded Luxury Cart Product View Cards */
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

        .cart-img-frame {
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

        /* Clean Counter Logic Controls */
        .qty-box-custom {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 25px;
          padding: 4px 14px;
          border: 1px solid rgba(201, 169, 98, 0.2);
        }
        .qty-action-btn {
          border: none;
          background: none;
          font-size: 16px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.6);
          padding: 0 8px;
          cursor: pointer;
          transition: color 0.15s;
        }
        .qty-action-btn:hover {
          color: #c9a962;
        }
        .qty-count-val {
          font-size: 13px;
          font-weight: 600;
          min-width: 28px;
          text-align: center;
          color: #fff;
        }

        .card-item-price {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
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
          padding: 0;
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

        .custom-coupon-group {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 40px;
          border: 1px solid rgba(201, 169, 98, 0.2);
          overflow: hidden;
          padding: 2px;
        }
        .custom-coupon-group input {
          background: transparent !important;
          border: none !important;
          color: #fff !important;
          font-size: 13px;
          box-shadow: none !important;
          padding-left: 18px;
        }
        .custom-coupon-group input::placeholder {
          color: rgba(255, 255, 255, 0.3);
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
      `}</style>
    </div>
  );
}

export default Cart;