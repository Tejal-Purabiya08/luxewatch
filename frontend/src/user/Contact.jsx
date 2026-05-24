import React from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function Contact() {

  const handleSubmit = (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "success",
      title: "Message Sent Successfully",
      text: "Our support team will contact you shortly.",
      confirmButtonColor: "#c9a962",
    });

    e.target.reset();
  };

  return (
    <div className="contact-wrapper">

      {/* HERO SECTION */}
      <div className="contact-hero">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="container"
        >
          <div className="hero-content text-center">
            <span className="hero-badge">Luxury Support</span>

            <h1 className="hero-title">
              Contact <span className="text-gold">Us</span>
            </h1>

            <div className="accent-bar mx-auto"></div>

            <p className="hero-subtitle">
              Have questions about our premium collection or your order?
              Our concierge team is here to assist you 24/7.
            </p>
          </div>
        </motion.div>
      </div>

      {/* CONTACT SECTION */}
      <div className="container py-5">

        <div className="row g-4 align-items-stretch">

          {/* LEFT INFO */}
          <div className="col-lg-5">

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="contact-info-card"
            >

              <h3 className="info-heading">
                Get In Touch
              </h3>

              <p className="info-text">
                We’re committed to delivering exceptional service and support.
                Reach out to us anytime regarding orders, products, or partnerships.
              </p>

              <div className="info-item">
                <div className="icon-box">
                  <i className="bi bi-geo-alt"></i>
                </div>

                <div>
                  <h6>Address</h6>
                  <p>Ahmedabad, Gujarat, India</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-box">
                  <i className="bi bi-envelope"></i>
                </div>

                <div>
                  <h6>Email</h6>
                  <p>support@luxurywatch.com</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-box">
                  <i className="bi bi-telephone"></i>
                </div>

                <div>
                  <h6>Phone</h6>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              <div className="info-item">
                <div className="icon-box">
                  <i className="bi bi-clock"></i>
                </div>

                <div>
                  <h6>Working Hours</h6>
                  <p>24/7 Premium Support</p>
                </div>
              </div>

            </motion.div>
          </div>

          {/* RIGHT FORM */}
          <div className="col-lg-7">

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="contact-form-card"
            >

              <h3 className="form-heading">
                Send Message
              </h3>

              <form onSubmit={handleSubmit}>

                <div className="row">

                  <div className="col-md-6 mb-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="luxury-input"
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-4">
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="luxury-input"
                      required
                    />
                  </div>

                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Subject"
                    className="luxury-input"
                    required
                  />
                </div>

                <div className="mb-4">
                  <textarea
                    rows="6"
                    placeholder="Write your message..."
                    className="luxury-input luxury-textarea"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="send-btn"
                >
                  Send Message
                </button>

              </form>

            </motion.div>

          </div>

        </div>

      </div>

      {/* CSS */}
      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .contact-wrapper{
          background:
          linear-gradient(180deg,#0a0a0f 0%,#0d0d14 50%,#0a0a0f 100%);
          min-height:100vh;
          overflow:hidden;
          font-family:'Plus Jakarta Sans',sans-serif;
        }

        .contact-hero{
          padding:120px 20px 90px;
          position:relative;
          text-align:center;
        }

        .contact-hero::before{
          content:"";
          position:absolute;
          width:500px;
          height:500px;
          background:rgba(201,169,98,0.08);
          filter:blur(120px);
          top:-150px;
          left:50%;
          transform:translateX(-50%);
          z-index:0;
        }

        .hero-content{
          position:relative;
          z-index:2;
        }

        .hero-badge{
          display:inline-block;
          padding:10px 24px;
          border-radius:40px;
          background:rgba(201,169,98,0.08);
          border:1px solid rgba(201,169,98,0.2);
          color:#c9a962;
          font-size:12px;
          font-weight:700;
          letter-spacing:2px;
          text-transform:uppercase;
          margin-bottom:24px;
        }

        .hero-title{
          font-family:'Playfair Display',serif;
          font-size:4rem;
          color:#fff;
          font-weight:700;
        }

        .text-gold{
          background:linear-gradient(135deg,#c9a962,#f0d78c,#c9a962);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          font-style:italic;
        }

        .accent-bar{
          width:70px;
          height:2px;
          background:linear-gradient(90deg,transparent,#c9a962,transparent);
          margin-top:20px;
          border-radius:20px;
        }

        .hero-subtitle{
          max-width:720px;
          margin:30px auto 0;
          color:rgba(255,255,255,0.55);
          line-height:1.9;
          font-size:15px;
        }

        .contact-info-card,
        .contact-form-card{
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:28px;
          padding:45px;
          backdrop-filter:blur(15px);
          height:100%;
          transition:0.4s ease;
        }

        .contact-info-card:hover,
        .contact-form-card:hover{
          border-color:rgba(201,169,98,0.25);
          box-shadow:0 25px 60px rgba(0,0,0,0.4);
        }

        .info-heading,
        .form-heading{
          font-family:'Playfair Display',serif;
          color:#fff;
          font-size:2rem;
          margin-bottom:18px;
        }

        .info-text{
          color:rgba(255,255,255,0.5);
          line-height:1.8;
          margin-bottom:35px;
        }

        .info-item{
          display:flex;
          align-items:flex-start;
          gap:18px;
          margin-bottom:28px;
        }

        .icon-box{
          width:58px;
          height:58px;
          border-radius:50%;
          background:rgba(201,169,98,0.08);
          border:1px solid rgba(201,169,98,0.2);
          display:flex;
          align-items:center;
          justify-content:center;
          color:#c9a962;
          font-size:22px;
          flex-shrink:0;
        }

        .info-item h6{
          color:#fff;
          margin-bottom:6px;
          font-size:16px;
        }

        .info-item p{
          color:rgba(255,255,255,0.5);
          margin:0;
          font-size:14px;
        }

        .luxury-input{
          width:100%;
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:18px;
          padding:18px 20px;
          color:#fff;
          outline:none;
          transition:0.4s ease;
          font-size:14px;
        }

        .luxury-input:focus{
          border-color:rgba(201,169,98,0.4);
          box-shadow:0 0 20px rgba(201,169,98,0.08);
        }

        .luxury-input::placeholder{
          color:rgba(255,255,255,0.35);
        }

        .luxury-textarea{
          resize:none;
        }

        .send-btn{
          background:linear-gradient(135deg,#c9a962,#d4af37);
          border:none;
          padding:16px 34px;
          border-radius:50px;
          color:#0a0a0f;
          font-weight:700;
          letter-spacing:1px;
          transition:0.4s ease;
          text-transform:uppercase;
          box-shadow:0 15px 40px rgba(201,169,98,0.25);
        }

        .send-btn:hover{
          transform:translateY(-4px);
          box-shadow:0 20px 50px rgba(201,169,98,0.35);
        }

        @media(max-width:992px){

          .hero-title{
            font-size:3rem;
          }

          .contact-info-card,
          .contact-form-card{
            padding:32px 24px;
          }
        }

        @media(max-width:576px){

          .hero-title{
            font-size:2.3rem;
          }

          .hero-subtitle{
            font-size:14px;
          }

          .info-heading,
          .form-heading{
            font-size:1.6rem;
          }
        }

      `}</style>
    </div>
  );
}

export default Contact;