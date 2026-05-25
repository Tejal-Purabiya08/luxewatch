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
    const order = await Order.findById(req.params.id).populate("items.productId");

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
    // HEADER BANNER (Premium Dark Top)
    // ====================================
    doc.rect(0, 0, 600, 110).fill("#0f172a");

    doc
      .fillColor("#ffffff")
      .fontSize(24)
      .text("LUXE STORE", 40, 35, { stroke: false, characterSpacing: 1 });

    doc
      .fontSize(10)
      .fillColor("#94a3b8")
      .text("Premium E-Commerce Experience", 40, 68);

    // Right-aligned Invoice Title in Banner
    doc
      .fillColor("#ffffff")
      .fontSize(26)
      .text("INVOICE", 40, 42, { align: "right", width: 515 });

    // ====================================
    // METADATA DETAILS (Clean Two-Column Grid)
    // ====================================
    let metaTop = 135;
    doc.fillColor("#0f172a").fontSize(10);
    
    // Left Details
    doc.font("Helvetica-Bold").text("Invoice To:", 40, metaTop);
    doc.font("Helvetica").text(order.address?.name || "Customer", 40, metaTop + 15);
    
    // Right Details (Invoice Meta)
    const invNumber = order.invoiceNumber || "INV-" + order._id.toString().slice(-6).toUpperCase();
    const invDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    
    doc.font("Helvetica-Bold").text(`Invoice No:`, 380, metaTop);
    doc.font("Helvetica").text(invNumber, 460, metaTop, { align: "right", width: 95 });
    
    doc.font("Helvetica-Bold").text(`Order ID:`, 380, metaTop + 15);
    doc.font("Helvetica").text(order._id.toString().slice(-8).toUpperCase(), 460, metaTop + 15, { align: "right", width: 95 });
    
    doc.font("Helvetica-Bold").text(`Date:`, 380, metaTop + 30);
    doc.font("Helvetica").text(invDate, 460, metaTop + 30, { align: "right", width: 95 });

    // ====================================
    // SHIPPING & BILLING BOX
    // ====================================
    let boxTop = 200;
    doc
      .roundedRect(40, boxTop, 515, 75, 6)
      .strokeColor("#e2e8f0")
      .lineWidth(1)
      .stroke();

    doc.font("Helvetica-Bold").fontSize(11).fillColor("#1e293b").text("Shipping Address", 55, boxTop + 12);
    
    doc.font("Helvetica").fontSize(10).fillColor("#475569");
    doc.text(`Phone:  ${order.address?.phone || '-'}`, 55, boxTop + 32);
    doc.text(`City:   ${order.address?.city || '-'}`, 55, boxTop + 48);
    
    doc.text(`Address: ${order.address?.fullAddress || '-'}`, 260, boxTop + 32, {
      width: 280,
      lineGap: 3
    });

    // ====================================
    // TABLE HEADER
    // ====================================
    let tableTop = 300;

    doc
      .rect(40, tableTop, 515, 26)
      .fill("#1e293b");

    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
    doc.text("Product Details", 55, tableTop + 8);
    doc.text("Qty", 320, tableTop + 8, { width: 40, align: "center" });
    doc.text("Price", 380, tableTop + 8, { width: 70, align: "right" });
    doc.text("Total", 460, tableTop + 8, { width: 85, align: "right" });

    // ====================================
    // PRODUCT ROWS
    // ====================================
    let y = tableTop + 26;

    order.items.forEach((item) => {
      const total = item.price * item.quantity;

      // Card / Row Border Background for alternating feel
      doc.fillColor("#0f172a").font("Helvetica").fontSize(10);

      // Product Name wrapping
      doc.text(item.productId?.name || "Premium Product", 55, y + 10, { width: 250 });
      
      // Values
      doc.text(item.quantity.toString(), 320, y + 10, { width: 40, align: "center" });
      doc.text(`₹${item.price.toLocaleString('en-IN')}`, 380, y + 10, { width: 70, align: "right" });
      doc.text(`₹${total.toLocaleString('en-IN')}`, 460, y + 10, { width: 85, align: "right" });

      // Light Border below row
      doc
        .moveTo(40, y + 32)
        .lineTo(555, y + 32)
        .strokeColor("#f1f5f9")
        .stroke();

      y += 32;
    });

    // ====================================
    // SUMMARY / TOTALS SECTION
    // ====================================
    y += 15;

    // Subtotal Row
    doc.font("Helvetica").fontSize(10).fillColor("#64748b");
    doc.text("Subtotal:", 360, y, { width: 100, align: "right" });
    doc.font("Helvetica-Bold").fillColor("#1e293b");
    doc.text(`₹${order.totalAmount.toLocaleString('en-IN')}`, 460, y, { width: 85, align: "right" });

    // Grand Total Accent Box
    y += 20;
    doc.rect(360, y, 195, 35).fill("#0f172a");

    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(11);
    doc.text("Grand Total", 375, y + 12);
    doc.fontSize(12).text(`₹${order.totalAmount.toLocaleString('en-IN')}`, 450, y + 11, {
      width: 95,
      align: "right"
    });

    // ====================================
    // FOOTER
    // ====================================
    // Bottom border line above footer
    doc
      .moveTo(40, 730)
      .lineTo(555, 730)
      .strokeColor("#e2e8f0")
      .stroke();

    doc
      .fillColor("#475569")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Thank you for shopping with Luxe Store!", 40, 745, {
        align: "center",
        width: 515
      });

    doc
      .fillColor("#94a3b8")
      .font("Helvetica")
      .fontSize(8)
      .text("If you have any questions about this invoice, please contact support@luxestore.com", 40, 760, {
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
