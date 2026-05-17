const mongoose = require("mongoose");
const crypto = require("crypto");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],

    address: {
      name: String,
      phone: String,
      city: String,
      fullAddress: String,
    },

    totalAmount: Number,

    paymentMethod: String,

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending Confirmation",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending Confirmation",
    },

    trackingHistory: [
      {
        status: String,
        message: String,

        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    deliveredAt: Date,

    invoiceNumber: String,

    paymentDetails: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
