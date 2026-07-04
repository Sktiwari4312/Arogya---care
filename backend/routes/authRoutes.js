import express from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route POST /api/auth/signup
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, age, gender, heightCm, weightKg } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, age, gender, heightCm, weightKg });

    res.status(201).json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
});

// @route POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user: user.toSafeObject(),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

// @route PUT /api/auth/me
router.put("/me", protect, async (req, res, next) => {
  try {
    const updates = (({ name, age, gender, heightCm, weightKg, goals, icePhone }) => ({
      name,
      age,
      gender,
      heightCm,
      weightKg,
      goals,
      icePhone,
    }))(req.body);

    Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

export default router;
