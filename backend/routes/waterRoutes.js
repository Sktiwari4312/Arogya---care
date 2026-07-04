import express from "express";
import WaterLog from "../models/WaterLog.js";
import { protect } from "../middleware/auth.js";
import { hydrationGoalMl } from "../utils/healthEngine.js";

const router = express.Router();
router.use(protect);

const todayStr = () => new Date().toISOString().slice(0, 10);

// @route GET /api/water/today
router.get("/today", async (req, res, next) => {
  try {
    const date = todayStr();
    let entry = await WaterLog.findOne({ user: req.user._id, date });
    if (!entry) {
      const goalMl = hydrationGoalMl({ weightKg: req.user.weightKg || 65 });
      entry = await WaterLog.create({ user: req.user._id, date, goalMl });
    }
    res.json({ water: entry });
  } catch (error) {
    next(error);
  }
});

// @route POST /api/water/add  { amountMl }
router.post("/add", async (req, res, next) => {
  try {
    const { amountMl } = req.body;
    const date = todayStr();
    let entry = await WaterLog.findOne({ user: req.user._id, date });
    if (!entry) {
      const goalMl = hydrationGoalMl({ weightKg: req.user.weightKg || 65 });
      entry = await WaterLog.create({ user: req.user._id, date, goalMl });
    }
    entry.consumedMl += amountMl;
    entry.log.push({ amountMl });
    await entry.save();
    res.json({ water: entry, goalReached: entry.consumedMl >= entry.goalMl });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/water/history
router.get("/history", async (req, res, next) => {
  try {
    const entries = await WaterLog.find({ user: req.user._id }).sort({ date: -1 }).limit(14);
    res.json({ history: entries });
  } catch (error) {
    next(error);
  }
});

export default router;
