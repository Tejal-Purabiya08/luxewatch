import { useEffect, useState ,useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/axios";

function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

 const fetchProduct = useCallback(async () => {
  try {
    const res = await API.get(`/api/products/${id}`);

    setProduct(res.data);
  } catch (error) {
    console.log(error);
  }
}, [id]);

useEffect(() => {
  fetchProduct();
}, [fetchProduct]);

  if (!product) {
    return (
      <div className="loader-box">
        <div className="spinner-border text-primary"></div>

        <h5 className="mt-3 fw-bold">
          Loading Product Data...
        </h5>

        <p className="text-muted">
          Please wait while syncing inventory
        </p>

        <style>{`
          .loader-box{
            height:100vh;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            background:#f8fafc;
            font-family:'Plus Jakarta Sans',sans-serif;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-details-bg">
      <div className="container-fluid p-4">

        {/* HEADER */}
        <div className="header-nav mb-4">

          <div className="d-flex align-items-center gap-3">

            <button
              className="circle-back-btn"
              onClick={() => navigate(-1)}
            >
              <i className="bi bi-arrow-left"></i>
            </button>

            <div>
              <h2 className="page-title">
                Product Profile
              </h2>

              <div className="system-ref">
                System Node Reference:
                <span className="ref-code">
                  #{product._id.toUpperCase()}
                </span>
              </div>
            </div>

          </div>

          <div className="status-badge-container">
            <span className="status-label">
              OPERATIONAL STATUS:
            </span>

            <div className="status-pill pulse-green">
              <span className="dot"></span>
              Active Inventory
            </div>
          </div>

        </div>

        <div className="row g-4">

          {/* LEFT SIDE */}
          <div className="col-lg-4">

            <motion.div
              className="glass-card h-100"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >

              <div className="card-header-premium">
                <i className="bi bi-box-seam"></i>
                Master Registry
              </div>

              <div className="registry-body">

                <div className="data-group">
                  <label>OFFICIAL NAME</label>

                  <p className="primary-data">
                    {product.name}
                  </p>
                </div>

                <div className="data-group">
                  <label>BRAND ORIGIN</label>

                  <p className="secondary-data">
                    {product.brand}
                  </p>
                </div>

                <div className="data-group">
                  <label>FINANCIAL VALUATION</label>

                  <div className="price-tag-large">
                    <span className="curr">₹</span>

                    {product.price.toLocaleString()}
                  </div>
                </div>

                <div className="data-group">
                  <label>COLLECTION TAGS</label>

                  <div className="tag-cloud">

                    {product.category?.map((cat) => (
                      <span
                        key={cat}
                        className="tag-pill"
                      >
                        {cat}
                      </span>
                    ))}

                  </div>
                </div>

              </div>

            </motion.div>

          </div>

          {/* RIGHT SIDE */}
          <div className="col-lg-8">

            <motion.div
              className="glass-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >

              <div className="card-header-premium d-flex justify-content-between align-items-center">

                <span>
                  <i className="bi bi-card-image"></i>
                  Visual Asset & Manifest
                </span>

                <span className="badge-outline">
                  HD Render
                </span>

              </div>

              <div className="manifest-content">

                <div className="row align-items-center">

                  {/* IMAGE */}
                  <div className="col-md-5 text-center">

                    <div className="visual-frame">

                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-hero-img"
                      />

                    </div>

                  </div>

                  {/* DETAILS */}
                  <div className="col-md-7">

                    <div className="manifest-details">

                      <div className="manifest-id-row">

                        <span className="m-label">
                          MANIFEST ID:
                        </span>

                        <span className="m-val">
                          {product._id.slice(-8)}
                        </span>

                      </div>

                      <h3 className="manifest-title">
                        {product.brand} - {product.name}
                      </h3>

                      <p className="manifest-desc">
                        Authenticated premium asset.
                        Transaction ledger verified.
                        This timepiece has passed all
                        system node checks for
                        distribution in the current region.
                      </p>

                      <div className="action-row mt-4">

                        <button
                          className="btn-action-primary"
                        >
                          <i className="bi bi-pencil-square"></i>
                          Update Ledger
                        </button>

                        <button
                          className="btn-action-outline"
                        >
                          Archive Asset
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

            {/* LOWER CARD */}
            <div className="glass-card mt-4 p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div className="d-flex align-items-center gap-3">

                <div className="icon-circle-bg">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>

                <div>
                  <div className="small-label">
                    MARKET PERFORMANCE
                  </div>

                  <div className="bold-text">
                    Trending - High Volume
                  </div>
                </div>

              </div>

              <div className="text-end">
                <div className="small-label">
                  STOCK LEVEL
                </div>

                <div className="stock-status">
                  Full Inventory
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .admin-details-bg{
          background:#f1f4f9;
          min-height:100vh;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .header-nav{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          flex-wrap:wrap;
        }

        .page-title{
          font-size:1.6rem;
          font-weight:800;
          margin:0;
          color:#1e293b;
        }

        .system-ref{
          font-size:12px;
          color:#64748b;
          margin-top:4px;
        }

        .ref-code{
          background:#e2e8f0;
          padding:3px 8px;
          border-radius:6px;
          margin-left:5px;
          font-family:monospace;
          color:#475569;
        }

        .circle-back-btn{
          width:45px;
          height:45px;
          border:none;
          border-radius:50%;
          background:white;
          box-shadow:0 4px 14px rgba(0,0,0,0.05);
          transition:0.3s ease;
        }

        .circle-back-btn:hover{
          background:#1e293b;
          color:white;
          transform:translateY(-2px);
        }

        .status-badge-container{
          background:white;
          padding:8px 15px;
          border-radius:14px;
          display:flex;
          align-items:center;
          gap:10px;
          border:1px solid #e2e8f0;
        }

        .status-label{
          font-size:10px;
          font-weight:800;
          color:#94a3b8;
        }

        .status-pill{
          display:flex;
          align-items:center;
          gap:8px;
          font-weight:700;
          font-size:13px;
        }

        .dot{
          width:8px;
          height:8px;
          border-radius:50%;
          background:#10b981;
        }

        .glass-card{
          background:white;
          border-radius:24px;
          border:1px solid #e2e8f0;
          box-shadow:0 10px 30px rgba(0,0,0,0.03);
          overflow:hidden;
          transition:all 0.35s ease;
        }

        .glass-card:hover{
          transform:translateY(-4px);
        }

        .card-header-premium{
          padding:20px 25px;
          border-bottom:1px solid #f1f5f9;
          font-size:13px;
          font-weight:800;
          color:#334155;
          text-transform:uppercase;
          letter-spacing:1px;
        }

        .registry-body{
          padding:30px;
          display:flex;
          flex-direction:column;
          gap:25px;
        }

        .data-group label{
          display:block;
          font-size:10px;
          font-weight:800;
          color:#94a3b8;
          margin-bottom:5px;
        }

        .primary-data{
          font-size:22px;
          font-weight:800;
          color:#1e293b;
          margin:0;
        }

        .secondary-data{
          font-size:16px;
          font-weight:600;
          color:#64748b;
          margin:0;
        }

        .price-tag-large{
          font-size:32px;
          font-weight:800;
          color:#4f46e5;
        }

        .curr{
          font-size:18px;
          color:#94a3b8;
          margin-right:4px;
        }

        .tag-cloud{
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        }

        .tag-pill{
          background:#eef2ff;
          color:#4f46e5;
          padding:7px 14px;
          border-radius:10px;
          font-size:12px;
          font-weight:700;
        }

        .manifest-content{
          padding:40px;
        }

        .visual-frame{
          background:#f8fafc;
          border-radius:20px;
          padding:20px;
          border:1px dashed #cbd5e1;
        }

        .product-hero-img{
          width:100%;
          max-width:280px;
          height:280px;
          object-fit:contain;
          filter:drop-shadow(0 20px 30px rgba(0,0,0,0.1));
        }

        .manifest-title{
          font-size:26px;
          font-weight:800;
          color:#1e293b;
          margin:15px 0;
        }

        .m-label{
          font-size:11px;
          font-weight:800;
          color:#94a3b8;
        }

        .m-val{
          font-family:monospace;
          margin-left:8px;
          color:#6366f1;
          font-weight:700;
        }

        .manifest-desc{
          color:#64748b;
          font-size:14px;
          line-height:1.7;
        }

        .btn-action-primary{
          background:#4f46e5;
          color:white;
          border:none;
          padding:12px 24px;
          border-radius:14px;
          font-weight:700;
          transition:0.3s;
        }

        .btn-action-primary:hover{
          background:#3730a3;
          transform:translateY(-2px);
        }

        .btn-action-outline{
          background:transparent;
          border:1.5px solid #e2e8f0;
          padding:12px 24px;
          border-radius:14px;
          font-weight:700;
          margin-left:10px;
          color:#64748b;
          transition:0.3s;
        }

        .btn-action-outline:hover{
          background:#f8fafc;
          border-color:#cbd5e1;
          transform:translateY(-2px);
        }

        .badge-outline{
          border:1px solid #cbd5e1;
          padding:6px 12px;
          border-radius:10px;
          font-size:11px;
          color:#64748b;
        }

        .icon-circle-bg{
          width:45px;
          height:45px;
          border-radius:50%;
          background:#eef2ff;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#4f46e5;
        }

        .small-label{
          font-size:10px;
          font-weight:800;
          color:#94a3b8;
        }

        .bold-text{
          font-weight:700;
          color:#1e293b;
        }

        .stock-status{
          color:#10b981;
          font-weight:800;
        }

        @media(max-width:768px){

          .manifest-content{
            padding:20px;
          }

          .registry-body{
            padding:20px;
          }

          .manifest-title{
            font-size:22px;
          }

          .btn-action-primary,
          .btn-action-outline{
            width:100%;
            margin-left:0;
            margin-top:10px;
          }

        }

      `}</style>
    </div>
  );
}

export default AdminProductDetails;