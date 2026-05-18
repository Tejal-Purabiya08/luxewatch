import React from "react";

function Footer() {
  return (
    <>
      {/* ================= STYLE TAG FOR FOOTER ================= */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* --- PREMIUM LUXURY FOOTER STYLES --- */
        .premium-footer {
          background: linear-gradient(180deg, #0a0c1a 0%, #050608 100%);
          color: #e4e4e7;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .premium-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c9a962, transparent);
        }

        /* Decorative Elements */
        .footer-decoration {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
        }

        .footer-decoration-1 {
          width: 400px;
          height: 400px;
          background: #c9a962;
          top: -200px;
          left: -100px;
        }

        .footer-decoration-2 {
          width: 300px;
          height: 300px;
          background: #c9a962;
          bottom: -150px;
          right: -50px;
        }

        .footer-content {
          position: relative;
          z-index: 1;
        }

        /* Brand Section */
        .footer-brand-section {
          padding-right: 40px;
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 3px;
          color: #ffffff;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #c9a962 0%, #e8d5a3 50%, #c9a962 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #0a0c1a;
        }

        .footer-logo span {
          background: linear-gradient(135deg, #c9a962 0%, #e8d5a3 50%, #c9a962 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer-tagline {
          font-size: 13px;
          color: #c9a962;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .footer-text {
          font-size: 14px;
          color: #a1a1aa;
          line-height: 1.8;
          max-width: 320px;
        }

        /* Social Icons */
        .footer-socials {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .footer-socials a {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(201, 169, 98, 0.08);
          border: 1px solid rgba(201, 169, 98, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a962;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .footer-socials a:hover {
          background: linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%);
          border-color: transparent;
          color: #0a0c1a;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(201, 169, 98, 0.3);
        }

        /* Links Section */
        .footer-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 28px;
          position: relative;
          padding-bottom: 12px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(90deg, #c9a962, transparent);
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links-list li {
          margin-bottom: 14px;
        }

        .footer-links-list li a {
          color: #a1a1aa;
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .footer-links-list li a::before {
          content: '';
          width: 0;
          height: 1px;
          background: #c9a962;
          transition: width 0.3s ease;
        }

        .footer-links-list li a:hover {
          color: #c9a962;
          transform: translateX(5px);
        }

        .footer-links-list li a:hover::before {
          width: 12px;
        }

        /* Contact Info */
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-bottom: 18px;
        }

        .footer-contact-icon {
          width: 36px;
          height: 36px;
          background: rgba(201, 169, 98, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a962;
          font-size: 14px;
          flex-shrink: 0;
        }

        .footer-contact-text {
          font-size: 14px;
          color: #a1a1aa;
          line-height: 1.5;
        }

        .footer-contact-text strong {
          display: block;
          color: #ffffff;
          font-weight: 500;
          margin-bottom: 2px;
        }

        /* Newsletter Section */
        .footer-newsletter {
          background: rgba(201, 169, 98, 0.05);
          border: 1px solid rgba(201, 169, 98, 0.15);
          border-radius: 16px;
          padding: 28px;
        }

        .footer-newsletter-text {
          font-size: 13px;
          color: #a1a1aa;
          margin-bottom: 18px;
          line-height: 1.6;
        }

        .footer-input-group {
          display: flex;
          background: rgba(10, 12, 26, 0.8);
          border: 1px solid rgba(201, 169, 98, 0.2);
          border-radius: 30px;
          padding: 5px;
          transition: all 0.3s ease;
        }

        .footer-input-group:focus-within {
          border-color: #c9a962;
          box-shadow: 0 0 20px rgba(201, 169, 98, 0.15);
        }

        .footer-input {
          background: transparent;
          border: none;
          padding: 12px 18px;
          color: #fff;
          width: 100%;
          font-size: 14px;
        }

        .footer-input::placeholder {
          color: #71717a;
        }

        .footer-input:focus {
          outline: none;
        }

        .footer-btn {
          background: linear-gradient(135deg, #c9a962 0%, #e8d5a3 100%);
          color: #0a0c1a;
          border: none;
          border-radius: 26px;
          padding: 12px 24px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .footer-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 25px rgba(201, 169, 98, 0.35);
        }

        /* Trust Badges */
        .footer-badges {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .footer-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #71717a;
        }

        .footer-badge i {
          color: #c9a962;
          font-size: 14px;
        }

        /* Divider */
        .footer-divider {
          margin: 50px 0 30px 0;
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3), transparent);
        }

        /* Bottom Section */
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-bottom p {
          font-size: 13px;
          color: #71717a;
          margin: 0;
        }

        .footer-bottom p span {
          color: #c9a962;
        }

        .footer-bottom-links {
          display: flex;
          gap: 30px;
        }

        .footer-bottom-links a {
          color: #71717a;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.3s ease;
        }

        .footer-bottom-links a:hover {
          color: #c9a962;
        }

        /* Payment Icons */
        .footer-payments {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .footer-payments span {
          font-size: 12px;
          color: #71717a;
        }

        .footer-payment-icons {
          display: flex;
          gap: 10px;
        }

        .footer-payment-icon {
          width: 40px;
          height: 26px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          color: #a1a1aa;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 991px) {
          .footer-brand-section {
            padding-right: 0;
            margin-bottom: 20px;
          }
          
          .footer-newsletter {
            margin-top: 20px;
          }
        }

        @media (max-width: 767px) {
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          
          .footer-bottom-links {
            justify-content: center;
          }
          
          .footer-payments {
            justify-content: center;
          }
          
          .footer-socials {
            justify-content: center;
          }
          
          .footer-title::after {
            left: 50%;
            transform: translateX(-50%);
          }
          
          .footer-links-list {
            text-align: center;
          }
          
          .footer-links-list li a::before {
            display: none;
          }
        }
      `,
        }}
      />

      {/* ================= FOOTER ================= */}
      <footer className="premium-footer">
        {/* Decorative Elements */}
        <div className="footer-decoration footer-decoration-1"></div>
        <div className="footer-decoration footer-decoration-2"></div>

        <div className="container py-5 footer-content">
          <div className="row g-4 g-lg-5">

            {/* BRAND */}
            <div className="col-lg-4 col-md-6 footer-brand-section">
              <h3 className="footer-logo">
                <div className="footer-logo-icon">
                  <i className="bi bi-watch"></i>
                </div>
                <span>LUXE WATCH</span>
              </h3>
              <p className="footer-tagline">Since 1985</p>
              <p className="footer-text">
                Timeless elegance crafted for modern lifestyles. Every timepiece tells a story of precision, luxury, and uncompromising quality.
              </p>

              <div className="footer-socials">
                <a href="https://www.instagram.com/" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                <a href="https://www.facebook.com/" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                <a href="https://x.com/" aria-label="Twitter"><i className="bi bi-twitter-x"></i></a>
                <a href="https://www.youtube.com/" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
                <a href="https://www.pinterest.com/" aria-label="Pinterest"><i className="bi bi-pinterest"></i></a>
              </div>
            </div>

            {/* SHOP LINKS */}
            <div className="col-lg-2 col-md-3 col-6">
              <h5 className="footer-title">Shop</h5>
              <ul className="footer-links-list">
                <li><a href="/all-products">Men Watches</a></li>
                <li><a href="/all-products">Women Watches</a></li>
                <li><a href="/all-products">New Arrivals</a></li>
                <li><a href="/all-products">Best Sellers</a></li>
                <li><a href="/all-products">Limited Edition</a></li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div className="col-lg-2 col-md-3 col-6">
              <h5 className="footer-title">Support</h5>
              <ul className="footer-links-list">
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/track-order">Track Order</a></li>
                <li><a href="/returns">Returns</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/size-guide">Size Guide</a></li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-newsletter">
                <h5 className="footer-title">Stay Updated</h5>
                <p className="footer-newsletter-text">
                  Subscribe to receive exclusive offers, early access to new collections, and luxury lifestyle updates.
                </p>
                <div className="footer-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="footer-input"
                  />
                  <button className="footer-btn">Subscribe</button>
                </div>
                <div className="footer-badges">
                  <span className="footer-badge">
                    <i className="bi bi-shield-check"></i>
                    Secure
                  </span>
                  <span className="footer-badge">
                    <i className="bi bi-envelope-check"></i>
                    No Spam
                  </span>
                  <span className="footer-badge">
                    <i className="bi bi-gift"></i>
                    Exclusive Deals
                  </span>
                </div>
              </div>
            </div>

          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            <p>&copy; 2026 <span>Luxe Watch</span>. All rights reserved.</p>
            
            <div className="footer-bottom-links">
              <a href="/privacy-policy">Privacy Policy</a>
              <a href="/terms-of-service">Terms of Service</a>
              <a href="/cookie-policy">Cookie Policy</a>
            </div>

            <div className="footer-payments">
              <span>We Accept:</span>
              <div className="footer-payment-icons">
                <div className="footer-payment-icon">VISA</div>
                <div className="footer-payment-icon">MC</div>
                <div className="footer-payment-icon">AMEX</div>
                <div className="footer-payment-icon">PP</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
