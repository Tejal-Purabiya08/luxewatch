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

    // Standard A4 Layout Setup
    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      bufferPages: true // Multi-page handling ke liye helpful hai
    });

    // RESPONSE HEADERS
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice-${order._id}.pdf`);

    doc.pipe(res);

    // Helper Function: Header Draw Karne Ke Liye (For Page 1 and Next Pages)
    const drawHeader = () => {
      // Top Dark Minimal Bar
      doc.rect(0, 0, 600, 90).fill("#0f172a");

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("LUXE STORE", 40, 25, { characterSpacing: 1 });

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#94a3b8")
        .text("Premium Retail Experience", 40, 52);

      doc
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("INVOICE", 40, 32, { align: "right", width: 515 });
    };

    // First page header draw karein
    drawHeader();

    // ====================================
    // METADATA & BILLING GRID (Top Section)
    // ====================================
    let currentY = 115;
    
    // Left Block: Bill To
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(10).text("BILL TO:", 40, currentY);
    doc.fillColor("#475569").font("Helvetica-Bold").fontSize(11).text(order.address?.name || "Customer", 40, currentY + 15);
    
    // Customer Contact Details
    doc.font("Helvetica").fontSize(9).fillColor("#64748b");
    if (order.address?.phone) doc.text(`Phone: ${order.address.phone}`, 40, currentY + 32);
    
    // Right Block: Invoice Meta Data
    const invNumber = order.invoiceNumber || "INV-" + order._id.toString().slice(-6).toUpperCase();
    const invDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(10).text("INVOICE DETAILS:", 380, currentY);
    
    doc.font("Helvetica").fontSize(9).fillColor("#475569");
    doc.text(`Invoice No:   ${invNumber}`, 380, currentY + 16, { width: 175, align: "left" });
    doc.text(`Order ID:     ${order._id.toString().slice(-8).toUpperCase()}`, 380, currentY + 28, { width: 175, align: "left" });
    doc.text(`Date:         ${invDate}`, 380, currentY + 40, { width: 175, align: "left" });

    // Address Strip / Section
    currentY += 65;
    doc.rect(40, currentY, 515, 1).fill("#e2e8f0"); // Thin divider line
    
    currentY += 12;
    doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(9).text("DELIVERY ADDRESS:", 40, currentY);
    doc.fillColor("#475569").font("Helvetica").fontSize(9).text(
      `${order.address?.fullAddress || '-'}, ${order.address?.city || '-'}`, 155, currentY, { width: 400 }
    );

    // ====================================
    // TABLE HEADER SETUP
    // ====================================
    currentY += 30;
    
    const drawTableHeader = (startY) => {
      doc.rect(40, startY, 515, 24).fill("#1e293b");
      doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(9);
      doc.text("ITEMS / DESCRIPTION", 50, startY + 7);
      doc.text("QTY", 320, startY + 7, { width: 40, align: "center" });
      doc.text("PRICE", 380, startY + 7, { width: 70, align: "right" });
      doc.text("TOTAL AMOUNT", 460, startY + 7, { width: 85, align: "right" });
    };

    drawTableHeader(currentY);
    currentY += 24;

    // ====================================
    // DYNAMIC PRODUCT ROWS (With Auto-wrap & Page Break)
    // ====================================
    order.items.forEach((item, index) => {
      const total = item.price * item.quantity;
      const prodName = item.productId?.name || "Premium Product";
      
      // Calculate dynamic height based on text wrap length
      const textHeight = doc.heightOfString(prodName, { width: 250 });
      const rowHeight = Math.max(textHeight + 16, 28); // Dynamic height calculation

      // Page overflow safe-guard check (Standard page limit safe boundary is ~720)
      if (currentY + rowHeight > 710) {
        doc.addPage();
        drawHeader();
        currentY = 115;
        drawTableHeader(currentY);
        currentY += 24;
      }

      // Zebra striping effect (Alternating row color backgrounds)
      if (index % 2 === 0) {
        doc.rect(40, currentY, 515, rowHeight).fill("#f8fafc");
      }

      doc.fillColor("#334155").font("Helvetica").fontSize(9);

      // Product Details render
      doc.text(prodName, 50, currentY + 8, { width: 250 });
      doc.text(item.quantity.toString(), 320, currentY + 8, { width: 40, align: "center" });
      doc.text(`INR ${item.price.toLocaleString('en-IN')}`, 380, currentY + 8, { width: 70, align: "right" });
      doc.text(`INR ${total.toLocaleString('en-IN')}`, 460, currentY + 8, { width: 85, align: "right" });

      // Bottom Row Thin Border Line
      doc
        .moveTo(40, currentY + rowHeight)
        .lineTo(555, currentY + rowHeight)
        .strokeColor("#e2e8f0")
        .lineWidth(0.5)
        .stroke();

      currentY += rowHeight;
    });

    // ====================================
    // GRAND TOTAL SECTION
    // ====================================
    currentY += 15;

    // Check custom space for Summary before writing to prevent hanging sections
    if (currentY + 60 > 720) {
      doc.addPage();
      drawHeader();
      currentY = 115;
    }

    // Subtotal Row
    doc.font("Helvetica").fontSize(9).fillColor("#64748b");
    doc.text("Subtotal:", 360, currentY, { width: 100, align: "right" });
    doc.font("Helvetica-Bold").fillColor("#1e293b");
    doc.text(`INR ${order.totalAmount.toLocaleString('en-IN')}`, 460, currentY, { width: 85, align: "right" });

    // Grand Total Accent Layout
    currentY += 18;
    doc.rect(360, currentY, 195, 30).fill("#0f172a");

    doc.fillColor("#ffffff").font("Helvetica-Bold").fontSize(10);
    doc.text("TOTAL DUE:", 375, currentY + 10);
    doc.fontSize(11).text(`INR ${order.totalAmount.toLocaleString('en-IN')}`, 450, currentY + 9, {
      width: 95,
      align: "right"
    });

    // ====================================
    // GLOBAL STATIC FOOTER
    // ====================================
    // Sabhi pages par static footer generate karne ke liye loop chala rahe hain
    const pages = doc._bufferedPages;
    pages.forEach((page, i) => {
      doc.switchToPage(i);
      
      // Footer base layout line
      doc
        .moveTo(40, 745)
        .lineTo(555, 745)
        .strokeColor("#cbd5e1")
        .lineWidth(0.5)
        .stroke();

      doc
        .fillColor("#475569")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Thank you for your business!", 40, 755, { align: "center", width: 515 });

      doc
        .fillColor("#94a3b8")
        .font("Helvetica")
        .fontSize(7.5)
        .text(`Page ${i + 1} of ${pages.length}  |  For support, email support@luxestore.com`, 40, 770, {
          align: "center",
          width: 515
        });
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
