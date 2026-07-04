import express from "express";
import Vital from "../models/Vital.js";
import { protect } from "../middleware/auth.js";
import { calculateBMI, bmiCategory, bpCategory } from "../utils/healthEngine.js";

const router = express.Router();
router.use(protect);

// @route POST /api/vitals
router.post("/", async (req, res, next) => {
  try {
    const { heightCm, weightKg, systolic, diastolic, bloodSugar, steps, heartRate, sleepHours } = req.body;
    const bmi = calculateBMI(weightKg, heightCm);

    const vital = await Vital.create({
      user: req.user._id,
      heightCm,
      weightKg,
      bmi,
      bmiCategory: bmiCategory(bmi),
      systolic,
      diastolic,
      bloodSugar,
      steps,
      heartRate,
      sleepHours,
    });

    res.status(201).json({
      vital,
      bpCategory: bpCategory(systolic, diastolic),
    });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/vitals  (history, most recent first)
router.get("/", async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const vitals = await Vital.find({ user: req.user._id }).sort({ recordedAt: -1 }).limit(limit);
    res.json({ vitals });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/vitals/latest
router.get("/latest", async (req, res, next) => {
  try {
    const vital = await Vital.findOne({ user: req.user._id }).sort({ recordedAt: -1 });
    res.json({ vital });
  } catch (error) {
    next(error);
  }
});

export default router;
