const express = require("express");
const router = express.Router();
const Cart = require("../model/Cart");

// GET CART
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.productId"
    );

    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD SINGLE PRODUCT (optional use)
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, quantity }],
      });
    } else {
      const index = cart.items.findIndex(
        (i) => i.productId.toString() === productId
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ⭐ IMPORTANT: FULL CART SAVE (FIX FOR YOUR ERROR)
router.post("/save", async (req, res) => {
  try {
    const { userId, items } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items });
    } else {
      cart.items = items;
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// REMOVE ITEM
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    cart.items = cart.items.filter(
      (i) => i.productId.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;