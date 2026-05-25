const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const PDFDocument = require("pdfkit");

const Order = require("../model/Order");
const Cart = require("../model/Cart");

// 📦 PLACE ORDER
router.post("/place", async (req, res) => {
  try {
    const {
      userId,
      items,
      address,
      totalAmount,
      paymentMethod,
      paymentDetails,
    } = req.body;

    const order = await Order.create({
      userId,
      items,
      address,
      totalAmount,
      paymentMethod,
      paymentDetails,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",

      orderStatus:
        paymentMethod === "COD" ? "Pending Confirmation" : "Confirmed",

      trackingHistory: [
        {
          status:
            paymentMethod === "COD" ? "Pending Confirmation" : "Confirmed",

          message:
            paymentMethod === "COD"
              ? "Waiting for admin confirmation"
              : "Payment successful. Order confirmed.",
        },
      ],

      invoiceNumber: "INV-" + Date.now(),
    });

    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ALL ORDERS
router.get("/admin/all", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId");

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ SINGLE ORDER
router.get("/single/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("items.productId");

    res.json(order);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/verify-payment", async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      dbOrderId,
    } = req.body;

    // GENERATE SIGNATURE

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest("hex");

    // VERIFY PAYMENT

    if (
      generatedSignature ===
      razorpay_signature
    ) {

      // PAYMENT SUCCESS

      await Order.findByIdAndUpdate(

        dbOrderId,

        {

          paymentStatus: "Paid",

          orderStatus: "Confirmed",

          "paymentDetails.razorpayOrderId":
            razorpay_order_id,

          "paymentDetails.razorpayPaymentId":
            razorpay_payment_id,

          "paymentDetails.razorpaySignature":
            razorpay_signature,

          $push: {

            trackingHistory: {

              status: "Confirmed",

              message:
                "Payment verified successfully.",

              time: new Date(),

            },

          },

        }

      );

      return res.json({

        success: true,

        message:
          "Payment verified successfully",

      });

    } else {

      // INVALID SIGNATURE

      await Order.findByIdAndUpdate(

        dbOrderId,

        {

          paymentStatus: "Failed",

          orderStatus: "Payment Failed",

          $push: {

            trackingHistory: {

              status: "Payment Failed",

              message:
                "Invalid payment signature.",

              time: new Date(),

            },

          },

        }

      );

      return res.status(400).json({

        success: false,

        message:
          "Invalid payment signature",

      });

    }

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

});

// UPDATE ORDER STATUS
router.put("/admin/update-status/:id", async (req, res) => {

  try {

    const { status, message } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(

      req.params.id,

      {
        orderStatus: status,

        $push: {
          trackingHistory: {
            status,
            message,
          },
        },

        ...(status === "Delivered" && {
          deliveredAt: new Date(),
        }),

      },

      { new: true }

    );

    res.json(updatedOrder);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// 📄 PREMIUM & SAFE INVOICE GENERATION
router.get("/invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      bufferPages: true 
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice-${order._id}.pdf`);
    doc.pipe(res);

    // ====================================
    // REUSABLE HEADER FUNCTION
    // ====================================
    const drawHeader = () => {
      doc.rect(0, 0, 600, 110).fill("#0f172a");
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(24).text("LUXE STORE", 40, 35, { characterSpacing: 1 });
      doc.fontSize(10).font("Helvetica").fillColor("#94a3b8").text("Premium E-Commerce Experience", 40, 68);
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(26).text("INVOICE", 40, 42, { align: "right", width: 515 });
    };

    // First page header print karein
    drawHeader();

    // ====================================
    // METADATA DETAILS (Clean Two-Column Grid)
    // ====================================
    let currentY = 135;
    doc.fillColor("#0f172a").fontSize(10);
    
    doc.font("Helvetica-Bold").text("Invoice To:", 40, currentY);
    doc.font("Helvetica").text(order.address?.name || "Customer", 40, currentY + 15);
    
    const invNumber = order.invoiceNumber || "INV-" + order._id.toString().slice(-6).toUpperCase();
    const invDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    
    doc.font("Helvetica-Bold").text(`Invoice No:`, 380, currentY);
    doc.font("Helvetica").text(invNumber, 460, currentY, { align: "right", width: 95 });
    
    doc.font("Helvetica-Bold").text(`Order ID:`, 380, currentY + 15);
    doc.font("Helvetica").text(order._id.toString().slice(-8).toUpperCase(), 460, currentY + 15, { align: "right", width: 95 });
    
    doc.font("Helvetica-Bold").text(`Date:`, 380, currentY + 30);
    doc.font("Helvetica").text(invDate, 460, currentY + 30, { align: "right", width: 95 });

    // ====================================
    // SHIPPING & BILLING BOX
    // ====================================
    currentY = 200;
    doc.roundedRect(40, currentY, 515, 75, 6).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("Shipping Address", 55, currentY + 12);
    
    doc.font("Helvetica").fontSize(10).fillColor("#475569");
    doc.text(`Phone:  ${order.address?.phone || '-'}`, 55, currentY + 32);
    doc.text(`City:   ${order.address?.city || '-'}`, 55, currentY + 48);
    doc.text(`Address: ${order.address?.fullAddress || '-'}`, 260, currentY + 32, { width: 280, lineGap: 3 });

    // ====================================
    // REUSABLE TABLE HEADER FUNCTION
    // ====================================
    currentY = 300;
    const drawTableHeader = (startY) => {
      doc.rect(40, startY, 515, 26).fill("#1e293b");
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
      doc.text("Product Details", 55, startY + 8);
      doc.text("Qty", 320, startY + 8, { width: 40, align: "center" });
      doc.text("Price", 380, startY + 8, { width: 70, align: "right" });
      doc.text("Total", 460, startY + 8, { width: 85, align: "right" });
    };

    drawTableHeader(currentY);
    currentY += 26;

    // ====================================
    // PRODUCT ROWS (Dynamic Height)
    // ====================================
    order.items.forEach((item, index) => {
      const total = item.price * item.quantity;
      const productName = item.productId?.name || "Premium Product";
      
      const textHeight = doc.heightOfString(productName, { width: 250 });
      const rowHeight = Math.max(textHeight + 16, 32); 

      if (currentY + rowHeight > 700) {
        doc.addPage();
        drawHeader();
        currentY = 135;
        drawTableHeader(currentY);
        currentY += 26;
      }

      if (index % 2 === 0) {
        doc.rect(40, currentY, 515, rowHeight).fill("#f8fafc");
      }

      // Explicitly reset fill state context to avoid rendering engine locks
      doc.fillColor("#0f172a").font("Helvetica").fontSize(10);

      doc.text(productName, 55, currentY + 10, { width: 250 });
      doc.text(item.quantity.toString(), 320, currentY + 10, { width: 40, align: "center" });
      doc.text(`INR ${item.price.toLocaleString('en-IN')}`, 380, currentY + 10, { width: 70, align: "right" });
      doc.text(`INR ${total.toLocaleString('en-IN')}`, 460, currentY + 10, { width: 85, align: "right" });

      doc.moveTo(40, currentY + rowHeight).lineTo(555, currentY + rowHeight).strokeColor("#f1f5f9").stroke();
      currentY += rowHeight;
    });

    // ====================================
    // SUMMARY / TOTALS SECTION
    // ====================================
    currentY += 15;
    if (currentY + 65 > 710) {
      doc.addPage();
      drawHeader();
      currentY = 135;
    }

    doc.font("Helvetica").fontSize(10).fillColor("#64748b");
    doc.text("Subtotal:", 360, currentY, { width: 100, align: "right" });
    doc.font("Helvetica-Bold").fillColor("#1e293b");
    doc.text(`INR ${order.totalAmount.toLocaleString('en-IN')}`, 460, currentY, { width: 85, align: "right" });

    currentY += 20;
    doc.rect(360, currentY, 195, 35).fill("#0f172a");

    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(11);
    doc.text("Grand Total", 375, currentY + 12);
    doc.fontSize(12).text(`INR ${order.totalAmount.toLocaleString('en-IN')}`, 450, currentY + 11, { width: 95, align: "right" });

    // ====================================
    // FOOTER (Multi-page Loop Engine)
    // ====================================
    const pages = doc._bufferedPages;
    pages.forEach((page, i) => {
      doc.switchToPage(i);
      doc.moveTo(40, 730).lineTo(555, 730).strokeColor("#e2e8f0").stroke();
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(10).text("Thank you for shopping with Luxe Store!", 40, 745, { align: "center", width: 515 });
      doc.fillColor("#94a3b8").font("Helvetica").fontSize(8).text(`Page ${i + 1} of ${pages.length}  |  If you have any questions, please contact support@luxestore.com`, 40, 760, { align: "center", width: 515 });
    });

    doc.end();
  } catch (err) {
    console.error("Critical PDF Generation Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
  }
});

// 📦 GET ORDERS
router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate(
      "items.productId",
      "name image price brand",
    );

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
