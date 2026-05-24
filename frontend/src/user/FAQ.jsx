import React, { useState } from "react";

function FAQ() {
  //activeIndex state se pata chalega kaunsa question open hai
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "How long does shipping take?",
      answer: "We offer complimentary insured shipping worldwide. Domestic deliveries typically take 3-5 business days, while international shipping takes 5-7 business days via our premium courier partners."
    },
    {
      question: "Can I return my watch?",
      answer: "Yes, we accept returns within 7 days of delivery. The timepiece must be completely unworn, with all original protective stickers, tags, and packaging intact."
    },
    {
      question: "Do you provide warranty?",
      answer: "Absolutely. Every timepiece purchased through us comes with a 2-Year Official International Warranty covering manufacturing defects, along with its original stamped warranty card."
    },
    {
      question: "Are your timepieces authentic?",
      answer: "Every single watch in our collection is 100% authentic and comes directly with its original serial number, certificate of authenticity, and luxury presentation box."
    }
  ];

  const toggleFAQ = (index) => {
    // Agar wahi same question dobara click hua toh close kar do, nahi toh naya open karo
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="luxe-faq-wrapper">
      <div className="luxe-faq-container">
        
        {/* Top Header */}
        <div className="faq-header">
          <span className="faq-subtitle">HAVE QUESTIONS?</span>
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-para">
            Find answers to common inquiries regarding our premium services, shipping, and warranty policies.
          </p>
        </div>

        {/* Interactive Accordion List */}
        <div className="faq-accordion-group">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item ${isOpen ? "faq-item-open" : ""}`}
              >
                {/* Question Row */}
                <button 
                  className="faq-question-btn" 
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className="question-text">{item.question}</span>
                  <span className={`faq-icon-arrow ${isOpen ? "rotate-arrow" : ""}`}>
                    ✕
                  </span>
                </button>

                {/* Animated Answer Box */}
                <div className={`faq-answer-pane ${isOpen ? "pane-visible" : ""}`}>
                  <div className="faq-answer-content">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      <style>{`
        .luxe-faq-wrapper {
          min-height: 100vh;
          background-color: #050505;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          font-family: 'Inter', sans-serif;
        }

        .luxe-faq-container {
          width: 100%;
          max-width: 800px;
        }

        /* HEADER DESIGN */
        .faq-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .faq-subtitle {
          color: #c9a962;
          font-size: 11px;
          letter-spacing: 4px;
          font-weight: 600;
          display: block;
          margin-bottom: 12px;
        }

        .faq-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          color: #ffffff;
          margin: 0 0 16px 0;
          font-weight: 400;
          letter-spacing: -0.5px;
        }

        .faq-para {
          color: #888888;
          font-size: 15px;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ACCORDION DESIGN */
        .faq-accordion-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .faq-item {
          background: #0a0a0a;
          border: 1px solid #161616;
          border-radius: 16px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item:hover {
          border-color: rgba(201, 169, 98, 0.3);
          background: #0e0e0e;
        }

        .faq-item-open {
          border-color: #c9a962;
          background: #0e0e0e;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        /* QUESTION BUTTON */
        .faq-question-btn {
          width: 100%;
          background: transparent;
          border: none;
          padding: 24px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          text-align: left;
          outline: none;
        }

        .question-text {
          color: #ffffff;
          font-size: 17px;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .faq-item:hover .question-text {
          color: #c9a962;
        }

        /* CLOSE/PLUS ICON ANIMATION */
        .faq-icon-arrow {
          color: #888888;
          font-size: 14px;
          transform: rotate(45deg); /* Displays as a + sign initially */
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease;
        }

        .faq-item-open .faq-icon-arrow {
          color: #c9a962;
        }

        .rotate-arrow {
          transform: rotate(0deg); /* Displays as a clean 'X' when open */
        }

        /* SMOOTH COLLAPSE/EXPAND */
        .faq-answer-pane {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .pane-visible {
          max-height: 200px; /* Safe upper bound for text content */
        }

        .faq-answer-content {
          padding: 0 30px 24px 30px;
        }

        .faq-answer-content p {
          color: #aaaaaa;
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 768px) {
          .faq-title {
            font-size: 32px;
          }
          .faq-question-btn {
            padding: 20px;
          }
          .faq-answer-content {
            padding: 0 20px 20px 20px;
          }
          .question-text {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default FAQ;