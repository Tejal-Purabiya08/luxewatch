const express = require("express");
const router = express.Router();

const Wishlist = require("../model/Wishlist");


// GET WISHLIST
router.get("/:userId", async (req, res) => {

  try {

    const wishlist = await Wishlist.findOne({
      userId: req.params.userId,
    }).populate("items.productId");

    res.json(
      wishlist || {
        userId: req.params.userId,
        items: [],
      }
    );

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// ADD TO WISHLIST
router.post("/add", async (req, res) => {

  try {

    const { userId, productId } = req.body;

    let wishlist = await Wishlist.findOne({
      userId,
    });

    if (!wishlist) {

      wishlist = await Wishlist.create({
        userId,
        items: [{ productId }],
      });

    } else {

      const alreadyExists = wishlist.items.find(
        (i) =>
          i.productId.toString() === productId
      );

      if (!alreadyExists) {

        wishlist.items.push({
          productId,
        });

        await wishlist.save();
      }
    }

    res.json(wishlist);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});


// REMOVE FROM WISHLIST
router.delete("/remove", async (req, res) => {

  try {

    const { userId, productId } = req.body;

    const wishlist = await Wishlist.findOne({
      userId,
    });

    wishlist.items = wishlist.items.filter(
      (i) =>
        i.productId.toString() !== productId
    );

    await wishlist.save();

    res.json(wishlist);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }
});

module.exports = router;