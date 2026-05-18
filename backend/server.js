const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const productRoutes = require("./Routes/productRoutes");
const userRoutes = require("./Routes/userRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const paymentRoutes = require("./Routes/paymentRoutes");
const wishlistRoutes = require("./Routes/wishlist");

const app = express();


// ================== MIDDLEWARE ==================

// JSON middleware
app.use(express.json());

// ✅ CORS FIX (IMPORTANT for Vercel frontend)
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://luxewatchh.netlify.app"
    ],
    credentials: true,
  })
);


// ================== DATABASE ==================
connectDB();


// ================== ROUTES ==================
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);


// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});


// ================== SERVER ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});