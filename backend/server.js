const express = require("express");

const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

// const adminRoutes = require("./Routes/adminRoutes");

const productRoutes = require("./Routes/productRoutes");

const userRoutes = require("./Routes/userRoutes");

const cartRoutes = require("./Routes/cartRoutes");

const orderRoutes = require("./Routes/orderRoutes");

const paymentRoutes = require("./Routes/paymentRoutes");

const wishlistRoutes = require("./Routes/wishlist");

const app = express();


// middleware

app.use(cors());

app.use(express.json());


// database

connectDB();


// routes

// app.use("/api/admin", adminRoutes);

app.use("/api/products", productRoutes);

app.use("/api/users", userRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/wishlist", wishlistRoutes);
// test route

app.get("/", (req, res) => {

    res.send("API Running");
});


// server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server Running On ${PORT}`);
});