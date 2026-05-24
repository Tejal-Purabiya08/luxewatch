const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../model/userModel");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone, city, state, address } =
      req.body;

    // CHECK USER
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // PASSWORD VALIDATION
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,

      role: role || "user",

      phone,
      city,
      state,
      address,
    });

    // SAFE RESPONSE
    res.status(201).json({
      message: "User Registered",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        city: user.city,
        state: user.state,
        address: user.address,
      },
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
        message: "Your account is inactive.",
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

// ================= FORGOT PASSWORD =================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // GENERATE OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // HASH OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // SAVE HASHED OTP
    user.otp = hashedOtp;

    // OTP EXPIRE TIME (10 MINUTES)
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: user.email,

      subject: "Password Reset OTP",

      html: `
          <div style="
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f5f5f5;
          ">
            <div style="
              max-width: 500px;
              margin: auto;
              background: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
            ">
              <h2 style="color:#333;">
                Password Reset Request
              </h2>

              <p style="font-size:16px;color:#555;">
                Use the OTP below to reset your password:
              </p>

              <h1 style="
                letter-spacing: 8px;
                color: #c9a962;
                margin: 30px 0;
              ">
                ${otp}
              </h1>

              <p style="color:#777;">
                This OTP will expire in
                <b>10 minutes</b>.
              </p>

              <p style="
                margin-top:30px;
                font-size:13px;
                color:#999;
              ">
                If you did not request this,
                please ignore this email.
              </p>
            </div>
          </div>
        `,
    });

    res.json({
      message: "OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ================= RESET PASSWORD =================

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // OTP FORMAT CHECK
    if (otp.length !== 6) {
      return res.status(400).json({
        message: "Invalid OTP format",
      });
    }

    // PASSWORD VALIDATION
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // CHECK OTP EXPIRE
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // VERIFY HASHED OTP
    const isOtpValid = await bcrypt.compare(otp, user.otp);

    if (!isOtpValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // HASH NEW PASSWORD
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    // CLEAR OTP
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({
      message: "Password reset successful",
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
          state: req.body.state,
          address: req.body.address,
        },
      },
      {
        returnDocument: "after",
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
