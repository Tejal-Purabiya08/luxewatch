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

    const PDFDocument = require("pdfkit");

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    // RESPONSE HEADERS

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // ====================================
    // HEADER
    // ====================================

    doc
      .rect(0, 0, 700, 100)
      .fill("#111827");

    doc
      .fillColor("white")
      .fontSize(26)
      .text("LUXE STORE", 40, 35);

    doc
      .fontSize(12)
      .fillColor("#d1d5db")
      .text("Premium Ecommerce Invoice", 40, 65);

    // ====================================
    // INVOICE TITLE
    // ====================================

    doc
      .fillColor("#111827")
      .fontSize(22)
      .text("INVOICE", 420, 120);

    // ====================================
    // CUSTOMER DETAILS
    // ====================================

    doc
      .fontSize(12)
      .fillColor("black");

    doc.text(
      `Invoice No: ${
        order.invoiceNumber ||
        "INV-" + order._id.toString().slice(-6)
      }`,
      40,
      130
    );

    doc.text(
      `Order ID: ${order._id}`,
      40,
      150
    );

    doc.text(
      `Date: ${new Date(
        order.createdAt
      ).toLocaleDateString()}`,
      40,
      170
    );

    // ====================================
    // BILLING BOX
    // ====================================

    doc
      .roundedRect(40, 210, 520, 100, 8)
      .stroke("#d1d5db");

    doc
      .fontSize(15)
      .fillColor("#111827")
      .text("Billing Details", 55, 225);

    doc
      .fontSize(12)
      .fillColor("#374151");

    doc.text(
      `Name: ${order.address.name}`,
      55,
      255
    );

    doc.text(
      `Phone: ${order.address.phone}`,
      55,
      275
    );

    doc.text(
      `City: ${order.address.city}`,
      300,
      255
    );

    doc.text(
      `Address: ${order.address.fullAddress}`,
      300,
      275,
      {
        width: 220,
      }
    );

    // ====================================
    // TABLE HEADER
    // ====================================

    let tableTop = 350;

    doc
      .rect(40, tableTop, 520, 30)
      .fill("#111827");

    doc
      .fillColor("white")
      .fontSize(12);

    doc.text("Product", 55, tableTop + 8);

    doc.text("Qty", 310, tableTop + 8);

    doc.text("Price", 380, tableTop + 8);

    doc.text("Total", 470, tableTop + 8);

    // ====================================
    // PRODUCT ROWS
    // ====================================

    let y = tableTop + 40;

    order.items.forEach((item) => {

      const total =
        item.price * item.quantity;

      doc
        .fillColor("#374151")
        .fontSize(11);

      doc.text(
        item.productId?.name || "Product",
        55,
        y,
        {
          width: 220,
        }
      );

      doc.text(
        item.quantity.toString(),
        320,
        y
      );

      doc.text(
        `Rs. ${item.price}`,
        370,
        y
      );

      doc.text(
        `Rs. ${total}`,
        460,
        y
      );

      // LINE

      doc
        .moveTo(40, y + 22)
        .lineTo(560, y + 22)
        .strokeColor("#e5e7eb")
        .stroke();

      y += 35;
    });

    // ====================================
    // GRAND TOTAL
    // ====================================

    y += 30;

    doc
      .roundedRect(340, y, 220, 60, 8)
      .fill("#111827");

    doc
      .fillColor("white")
      .fontSize(14)
      .text("Grand Total ", 360, y + 15);

    doc
      .fontSize(18)
      .text(
        `${order.totalAmount}`,
        430,
        y + 14
      );

    // ====================================
    // FOOTER
    // ====================================

    doc
      .fillColor("gray")
      .fontSize(11)
      .text(
        "Thank you for shopping with Luxe Store!",
        40,
        760,
        {
          align: "center",
        }
      );

    doc.end();

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message,
    });

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
