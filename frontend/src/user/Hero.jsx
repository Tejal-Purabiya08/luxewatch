import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="hero-section">
      {/* Animated Background Elements */}
      <div className="hero-bg-pattern"></div>
      <div className="hero-overlay"></div>
      
      {/* Floating Particles */}
      <div className="hero-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      {/* Animated Light Effects */}
      <div className="hero-light hero-light-1"></div>
      <div className="hero-light hero-light-2"></div>

      {/* Decorative Watch Frame */}
      <div className="hero-watch-frame">
        <div className="watch-ring"></div>
        <div className="watch-ring watch-ring-2"></div>
      </div>

      <div className="hero-content">
        {/* Badge */}
        <div className="hero-badge">
          <span className="badge-icon">&#9733;</span>
          <span>Premium Collection 2024</span>
        </div>

        <h1 className="hero-title">
          <span className="title-line">Timeless</span>
          <span className="title-highlight">Elegance</span>
        </h1>
        
        <p className="hero-description">
          Discover the world&apos;s most prestigious watch brands and elevate your
          style with our premium collection of luxury timepieces.
        </p>

        {/* Features */}
        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">&#10003;</span>
            <span>Authentic Brands</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">&#10003;</span>
            <span>Free Shipping</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">&#10003;</span>
            <span>2 Year Warranty</span>
          </div>
        </div>

        <div className="hero-btn-group">
          <button
            className="btn-luxury"
            onClick={() => navigate("/all-products")}
          >
            <span className="btn-text">Shop Collection</span>
            <span className="btn-icon">&#8594;</span>
          </button>
          <button className="btn-outline-luxury">
            <span className="btn-play-icon">&#9658;</span>
            <span>Watch Video</span>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="hero-trust">
          <div className="trust-rating">
            <span className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
            <span className="rating-text">4.9/5 from 2,500+ reviews</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap');

        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%);
          overflow: hidden;
          text-align: center;
          padding: 100px 20px 60px;
        }

        /* Background Pattern */
        .hero-bg-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(201, 169, 98, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(201, 169, 98, 0.03) 0%, transparent 50%),
            linear-gradient(rgba(201, 169, 98, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201, 169, 98, 0.02) 1px, transparent 1px);
          background-size: 100% 100%, 100% 100%, 60px 60px, 60px 60px;
          animation: patternMove 20s linear infinite;
        }

        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }

        /* Dark overlay */
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 15, 0.4) 70%),
            linear-gradient(to bottom, rgba(10, 10, 15, 0.3) 0%, rgba(10, 10, 15, 0.6) 100%);
        }

        /* Floating Particles */
        .hero-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #c9a962;
          border-radius: 50%;
          opacity: 0.4;
          animation: floatParticle 15s infinite;
        }

        .particle-1 { left: 10%; top: 20%; animation-delay: 0s; }
        .particle-2 { left: 20%; top: 60%; animation-delay: 2s; }
        .particle-3 { left: 70%; top: 30%; animation-delay: 4s; }
        .particle-4 { left: 80%; top: 70%; animation-delay: 6s; }
        .particle-5 { left: 50%; top: 80%; animation-delay: 8s; }

        @keyframes floatParticle {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-100px) scale(1.5);
            opacity: 0.8;
          }
        }

        /* Light effects */
        .hero-light {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .hero-light-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(201, 169, 98, 0.15) 0%, transparent 70%);
          top: -10%;
          left: -10%;
          animation: floatLight1 12s infinite alternate ease-in-out;
        }

        .hero-light-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(201, 169, 98, 0.1) 0%, transparent 70%);
          bottom: -10%;
          right: -10%;
          animation: floatLight2 10s infinite alternate ease-in-out;
        }

        @keyframes floatLight1 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(100px, 50px) scale(1.2); }
        }

        @keyframes floatLight2 {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-80px, -40px) scale(1.1); }
        }

        /* Watch Frame Decoration */
        .hero-watch-frame {
          position: absolute;
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          height: 400px;
          opacity: 0.1;
          pointer-events: none;
        }

        .watch-ring {
          position: absolute;
          inset: 0;
          border: 2px solid #c9a962;
          border-radius: 50%;
          animation: rotateRing 30s linear infinite;
        }

        .watch-ring::before {
          content: '';
          position: absolute;
          top: -5px;
          left: 50%;
          width: 10px;
          height: 10px;
          background: #c9a962;
          border-radius: 50%;
          transform: translateX(-50%);
        }

        .watch-ring-2 {
          inset: 30px;
          animation-direction: reverse;
          animation-duration: 25s;
        }

        @keyframes rotateRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Content */
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
        }

        /* Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(201, 169, 98, 0.1);
          border: 1px solid rgba(201, 169, 98, 0.3);
          padding: 10px 24px;
          border-radius: 50px;
          margin-bottom: 30px;
          opacity: 0;
          animation: fadeInDown 0.8s forwards 0.2s ease-out;
        }

        .badge-icon {
          color: #c9a962;
          font-size: 14px;
        }

        .hero-badge span:last-child {
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #c9a962;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Title */
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 5.5rem;
          color: #fff;
          font-weight: 700;
          margin-bottom: 24px;
          line-height: 1.1;
          opacity: 0;
          animation: fadeInUp 1s forwards 0.4s ease-out;
        }

        .title-line {
          display: block;
          background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-highlight {
          display: block;
          background: linear-gradient(135deg, #c9a962 0%, #e8d5a3 50%, #c9a962 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-style: italic;
          position: relative;
        }

        .title-highlight::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c9a962, transparent);
        }

        /* Description */
        .hero-description {
          font-family: 'Poppins', sans-serif;
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 32px;
          max-width: 550px;
          margin-left: auto;
          margin-right: auto;
          letter-spacing: 0.3px;
          line-height: 1.7;
          opacity: 0;
          animation: fadeInUp 1s forwards 0.6s ease-out;
        }

        /* Features */
        .hero-features {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 40px;
          opacity: 0;
          animation: fadeInUp 1s forwards 0.7s ease-out;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
        }

        .feature-icon {
          width: 20px;
          height: 20px;
          background: rgba(201, 169, 98, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a962;
          font-size: 10px;
        }

        /* Buttons */
        .hero-btn-group {
          display: flex;
          justify-content: center;
          gap: 20px;
          opacity: 0;
          animation: fadeInUp 1s forwards 0.8s ease-out;
        }

        .btn-luxury {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #c9a962 0%, #b8954f 100%);
          color: #0a0a0f;
          padding: 18px 40px;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          border-radius: 50px;
          border: none;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          position: relative;
          overflow: hidden;
        }

        .btn-luxury::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #e8d5a3 0%, #c9a962 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .btn-luxury:hover {
          transform: translateY(-4px);
          box-shadow: 
            0 15px 40px rgba(201, 169, 98, 0.3),
            0 5px 15px rgba(201, 169, 98, 0.2);
        }

        .btn-luxury:hover::before {
          opacity: 1;
        }

        .btn-luxury .btn-text,
        .btn-luxury .btn-icon {
          position: relative;
          z-index: 1;
        }

        .btn-luxury .btn-icon {
          transition: transform 0.3s ease;
        }

        .btn-luxury:hover .btn-icon {
          transform: translateX(5px);
        }

        .btn-outline-luxury {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: transparent;
          color: #fff;
          padding: 18px 40px;
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          border-radius: 50px;
          border: 2px solid rgba(201, 169, 98, 0.5);
          cursor: pointer;
          font-size: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .btn-outline-luxury:hover {
          background: rgba(201, 169, 98, 0.1);
          border-color: #c9a962;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(201, 169, 98, 0.15);
        }

        .btn-play-icon {
          width: 24px;
          height: 24px;
          background: rgba(201, 169, 98, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #c9a962;
          transition: all 0.3s ease;
        }

        .btn-outline-luxury:hover .btn-play-icon {
          background: #c9a962;
          color: #0a0a0f;
        }

        /* Trust Indicators */
        .hero-trust {
          margin-top: 50px;
          opacity: 0;
          animation: fadeInUp 1s forwards 1s ease-out;
        }

        .trust-rating {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .stars {
          color: #c9a962;
          font-size: 16px;
          letter-spacing: 2px;
        }

        .rating-text {
          font-family: 'Poppins', sans-serif;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Scroll Indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0;
          animation: fadeIn 1s forwards 1.2s ease-out;
        }

        .scroll-mouse {
          width: 26px;
          height: 40px;
          border: 2px solid rgba(201, 169, 98, 0.4);
          border-radius: 20px;
          display: flex;
          justify-content: center;
          padding-top: 8px;
        }

        .scroll-wheel {
          width: 4px;
          height: 8px;
          background: #c9a962;
          border-radius: 2px;
          animation: scrollWheel 2s infinite;
        }

        @keyframes scrollWheel {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }

        .scroll-indicator span {
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          color: rgba(201, 169, 98, 0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Responsive */
        @media (max-width: 992px) {
          .hero-watch-frame {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 120px 20px 80px;
          }

          .hero-title {
            font-size: 3.5rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .hero-features {
            flex-direction: column;
            gap: 12px;
          }

          .hero-btn-group {
            flex-direction: column;
            gap: 15px;
          }

          .btn-luxury,
          .btn-outline-luxury {
            width: 100%;
            justify-content: center;
            padding: 16px 30px;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 2.8rem;
          }

          .hero-badge {
            padding: 8px 16px;
          }

          .hero-badge span:last-child {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}

export default Hero;
