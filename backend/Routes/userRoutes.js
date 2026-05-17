const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Model/userModel");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "User Registered",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Your account is inactive. Contact admin.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.json({
      message: "Login Success",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= GET ALL USERS =================

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= GET SINGLE USER =================

router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= UPDATE PROFILE =================

router.put("/:id", protect, async (req, res) => {
  try {
    // user can update only own profile

    if (req.user.id !== req.params.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          city: req.body.city,
          address: req.body.address,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ================= DELETE USER =================

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= LOGGED IN USER PROFILE =================

router.get("/profile/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= TOGGLE USER STATUS =================

router.put("/toggle-status/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = user.status === "active" ? "inactive" : "active";

    await user.save();

    res.json({
      message: "User status updated",
      status: user.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
