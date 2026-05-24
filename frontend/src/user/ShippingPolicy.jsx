import React from "react";

function ShippingPolicy() {
  const highlights = [
    {
      icon: "⚡",
      title: "Swift Dispatch",
      detail: "Orders are processed and verified within 24 hours.",
      meta: "Priority handling"
    },
    {
      icon: "📦",
      title: "Pan-India Delivery",
      detail: "Completely secure delivery within 3-7 business days.",
      meta: "Tracked courier partners"
    },
    {
      icon: "✨",
      title: "Complimentary Shipping",
      detail: "Free fully-insured shipping on orders above ₹5,000.",
      meta: "Standard orders: ₹150 flat"
    }
  ];

  return (
    <div className="luxe-shipping-wrapper">
      <div className="luxe-shipping-container">
        
        {/* Header Section */}
        <div className="shipping-header">
          <span className="shipping-subtitle">TRANSIT & DELIVERY</span>
          <h1 className="shipping-title">Shipping Policy</h1>
          <p className="shipping-para">
            Every timepiece travels via secure, temperature-controlled transit networks ensuring pristine delivery to your doorstep.
          </p>
        </div>

        {/* Highlight Feature Grid */}
        <div className="shipping-grid">
          {highlights.map((item, index) => (
            <div key={index} className="shipping-card">
              <div className="shipping-icon-circle">{item.icon}</div>
              <h3 className="shipping-card-title">{item.title}</h3>
              <p className="shipping-card-detail">{item.detail}</p>
              <div className="shipping-card-meta">{item.meta}</div>
            </div>
          ))}
        </div>

        {/* Security Assurance Banner */}
        <div className="shipping-assurance-banner">
          <div className="assurance-inner">
            <span className="shield-icon">🛡️</span>
            <div>
              <h4>100% Insured Deliveries</h4>
              <p>All transits are fully covered against loss or damage. A signature requirement upon arrival ensures your order reaches safely.</p>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        .luxe-shipping-wrapper {
          min-height: 100vh;
          background-color: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          font-family: 'Inter', sans-serif;
        }

        .luxe-shipping-container {
          width: 100%;
          max-width: 950px;
        }

        /* HEADER */
        .shipping-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .shipping-subtitle {
          color: #c9a962;
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 600;
          display: block;
          margin-bottom: 12px;
        }

        .shipping-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          color: #ffffff;
          margin: 0 0 16px 0;
          font-weight: 400;
        }

        .shipping-para {
          color: #888888;
          font-size: 15px;
          max-width: 550px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* GRID STRUCTURE */
        .shipping-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 40px;
        }

        .shipping-card {
          background: #0a0a0a;
          border: 1px solid #161616;
          border-radius: 24px;
          padding: 40px 30px;
          text-align: center;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .shipping-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 169, 98, 0.3);
        }

        .shipping-icon-circle {
          font-size: 28px;
          margin-bottom: 20px;
          display: inline-block;
        }

        .shipping-card-title {
          color: #ffffff;
          font-size: 18px;
          font-weight: 500;
          margin: 0 0 12px 0;
        }

        .shipping-card-detail {
          color: #888888;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 20px 0;
          min-height: 45px;
        }

        .shipping-card-meta {
          display: inline-block;
          font-size: 11px;
          color: #c9a962;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: rgba(201, 169, 98, 0.05);
          padding: 4px 12px;
          border-radius: 50px;
          border: 1px solid rgba(201, 169, 98, 0.1);
        }

        /* ASSURANCE BANNER */
        .shipping-assurance-banner {
          background: linear-gradient(135deg, #0e0e0e 0%, #0a0a0a 100%);
          border: 1px solid #161616;
          border-radius: 20px;
          padding: 24px 30px;
          max-width: 800px;
          margin: 0 auto;
        }

        .assurance-inner {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .shield-icon {
          font-size: 28px;
        }

        .assurance-inner h4 {
          color: #ffffff;
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 500;
        }

        .assurance-inner p {
          color: #666666;
          margin: 0;
          font-size: 13.5px;
          line-height: 1.5;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .shipping-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .shipping-card {
            padding: 30px;
          }
          .shipping-card-detail {
            min-height: auto;
          }
          .shipping-title {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}

export default ShippingPolicy;