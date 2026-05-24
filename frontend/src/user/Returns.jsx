import React from "react";

function Returns() {
  const steps = [
    {
      num: "01",
      title: "Initiate Request",
      desc: "Contact our concierge team within 7 days of delivery to request a secure return authorization label."
    },
    {
      num: "02",
      title: "Inspection & Quality Check",
      desc: "Once received, our horologists inspect the timepiece to verify its pristine, unworn condition."
    },
    {
      num: "03",
      title: "Secure Refund Transfer",
      desc: "Approved refunds are credited directly back to your original payment method within 5-7 business days."
    }
  ];

  return (
    <div className="luxe-returns-wrapper">
      <div className="luxe-returns-container">
        
        {/* Header */}
        <div className="returns-header">
          <span className="returns-subtitle">POLICIES & PROCEDURES</span>
          <h1 className="returns-title">Returns & Refunds</h1>
          <p className="returns-para">
            We ensure a seamless, transparent return experience for our exclusive client network.
          </p>
        </div>

        {/* Highlight Banner / Policy Callout */}
        <div className="policy-callout-card">
          <div className="callout-icon">✦</div>
          <div className="callout-text">
            <h3>7-Day Complimentary Return Window</h3>
            <p>
              To eligible for a full refund, items must be completely unused, unaltered, and secured in their original premium packaging with all protective stickers intact.
            </p>
          </div>
        </div>

        {/* Process Steps */}
        <h2 className="section-divider-title">The Return Process</h2>
        <div className="returns-grid-steps">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-number-glow">{step.num}</div>
              <h4 className="step-card-title">{step.title}</h4>
              <p className="step-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Assistance Bottom Alert */}
        <div className="assistance-footer-box">
          <p>
            Need urgent assistance with an ongoing return? Contact our 24/7 dedicated support team at <strong>support@luxewatch.com</strong>.
          </p>
        </div>

      </div>

      <style>{`
        .luxe-returns-wrapper {
          min-height: 100vh;
          background-color: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          font-family: 'Inter', sans-serif;
        }

        .luxe-returns-container {
          width: 100%;
          max-width: 900px;
        }

        /* HEADER */
        .returns-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .returns-subtitle {
          color: #c9a962;
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 600;
          display: block;
          margin-bottom: 12px;
        }

        .returns-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          color: #ffffff;
          margin: 0 0 16px 0;
          font-weight: 400;
        }

        .returns-para {
          color: #888888;
          font-size: 15px;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* HIGHLIGHT CALLOUT CARD */
        .policy-callout-card {
          background: linear-gradient(135deg, #0e0e0e 0%, #0a0a0a 100%);
          border: 1px solid #1c1c1c;
          border-left: 3px solid #c9a962;
          border-radius: 16px;
          padding: 30px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          margin-bottom: 50px;
        }

        .callout-icon {
          color: #c9a962;
          font-size: 24px;
          line-height: 1;
        }

        .callout-text h3 {
          color: #ffffff;
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 500;
        }

        .callout-text p {
          color: #aaaaaa;
          margin: 0;
          font-size: 14.5px;
          line-height: 1.6;
        }

        /* GRID STEPS */
        .section-divider-title {
          font-family: 'Playfair Display', serif;
          color: #ffffff;
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 30px;
          text-align: center;
        }

        .returns-grid-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 50px;
        }

        .step-card {
          background: #0a0a0a;
          border: 1px solid #161616;
          padding: 30px 24px;
          border-radius: 20px;
          position: relative;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }

        .step-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 169, 98, 0.25);
        }

        .step-number-glow {
          font-family: 'Playfair Display', serif;
          color: rgba(201, 169, 98, 0.1);
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 15px;
        }

        .step-card-title {
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 12px 0;
          letter-spacing: 0.3px;
        }

        .step-card-desc {
          color: #888888;
          font-size: 13.5px;
          line-height: 1.6;
          margin: 0;
        }

        /* BOTTOM FOOTER BOX */
        .assistance-footer-box {
          text-align: center;
          border-top: 1px solid #161616;
          padding-top: 30px;
        }

        .assistance-footer-box p {
          color: #666666;
          font-size: 13.5px;
          margin: 0;
        }

        .assistance-footer-box strong {
          color: #c9a962;
          font-weight: 500;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .returns-title {
            font-size: 32px;
          }
          .returns-grid-steps {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .policy-callout-card {
            flex-direction: column;
            gap: 12px;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default Returns;