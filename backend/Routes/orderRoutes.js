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


router.get("/invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productId");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const PDFDocument = require("pdfkit");

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    // RESPONSE HEADERS
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice-${order._id}.pdf`);

    doc.pipe(res);

    // ====================================
    // HEADER BANNER
    // ====================================
    doc
      .rect(0, 0, 600, 100) // Fixed width for A4 boundary
      .fill("#111827");

    doc
      .fillColor("white")
      .fontSize(24)
      .text("LUXE STORE", 40, 35, { stroke: false });

    doc
      .fontSize(11)
      .fillColor("#d1d5db")
      .text("Premium Ecommerce Invoice", 40, 65);

    // ====================================
    // INVOICE TITLE (Right Aligned)
    // ====================================
    doc
      .fillColor("#111827")
      .fontSize(24)
      .text("INVOICE", 40, 120, { align: "right", width: 515 });

    // ====================================
    // METADATA DETAILS (Left Side)
    // ====================================
    doc.fontSize(10).fillColor("#4b5563");
    doc.text(`Invoice No: ${order.invoiceNumber || "INV-" + order._id.toString().slice(-6).toUpperCase()}`, 40, 130);
    doc.text(`Order ID: ${order._id}`, 40, 148);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 40, 166);

    // ====================================
    // BILLING BOX (Clean Borders)
    // ====================================
    doc
      .roundedRect(40, 205, 515, 105, 8)
      .strokeColor("#cbd5e1")
      .stroke();

    doc
      .fontSize(13)
      .fillColor("#111827")
      .text("Billing Details", 55, 220);

    doc.fontSize(10).fillColor("#374151");
    
    // Column 1 (Left side info)
    doc.text(`Name:   ${order.address?.name || 'Customer'}`, 55, 250);
    doc.text(`Phone:  ${order.address?.phone || '-'}`, 55, 272);
    
    // Column 2 (Right side info)
    doc.text(`City:      ${order.address?.city || '-'}`, 300, 250);
    doc.text(`Address: ${order.address?.fullAddress || '-'}`, 300, 272, {
      width: 240,
    });

    // ====================================
    // TABLE HEADER
    // ====================================
    let tableTop = 340;

    doc
      .rect(40, tableTop, 515, 30)
      .fill("#111827");

    doc.fillColor("white").fontSize(11);
    doc.text("Product", 55, tableTop + 10);
    doc.text("Qty", 300, tableTop + 10, { width: 40, align: "center" });
    doc.text("Price", 360, tableTop + 10, { width: 80, align: "center" });
    doc.text("Total", 460, tableTop + 10, { width: 80, align: "right" });

    // ====================================
    // PRODUCT ROWS
    // ====================================
    let y = tableTop + 40;

    order.items.forEach((item) => {
      const total = item.price * item.quantity;

      doc.fillColor("#374151").fontSize(10);

      // Product Name wrapping with safe width
      doc.text(item.productId?.name || "Product", 55, y, { width: 230 });
      
      // Dynamic text blocks with strict alignments to stop overlapping
      doc.text(item.quantity.toString(), 300, y, { width: 40, align: "center" });
      doc.text(`Rs. ${item.price}`, 360, y, { width: 80, align: "center" });
      doc.text(`Rs. ${total}`, 460, y, { width: 80, align: "right" });

      // Clean divider lines between rows
      doc
        .moveTo(40, y + 22)
        .lineTo(555, y + 22)
        .strokeColor("#f1f5f9")
        .stroke();

      y += 35;
    });

    // ====================================
    // GRAND TOTAL (Fixed Spacing & Overlay Bug)
    // ====================================
    y += 15;

    // Dark Navy Box Container
    doc
      .roundedRect(315, y, 240, 50, 6)
      .fill("#111827");

    doc.fillColor("white");
    
    // Left Aligned Text inside the card
    doc
      .fontSize(12)
      .text("Grand Total", 335, y + 19);

    // Right Aligned dynamic value inside the card (No overlapping anymore)
    doc
      .fontSize(15)
      .text(`Rs. ${order.totalAmount}`, 365, y + 18, {
        width: 175,
        align: "right"
      });

    // ====================================
    // FOOTER
    // ====================================
    doc
      .fillColor("#94a3b8")
      .fontSize(10)
      .text("Thank you for shopping with Luxe Store!", 40, 765, {
        align: "center",
        width: 515
      });

    doc.end();

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
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
