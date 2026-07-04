import express from "express";
import { protect } from "../middleware/auth.js";
import Vital from "../models/Vital.js";
import WaterLog from "../models/WaterLog.js";
import Mood from "../models/Mood.js";
import Medication from "../models/Medication.js";
import User from "../models/User.js";
import { hydrationGoalMl } from "../utils/healthEngine.js";

const router = express.Router();
router.use(protect);

const todayStr = () => new Date().toISOString().slice(0, 10);

// @route GET /api/dashboard/summary
router.get("/summary", async (req, res, next) => {
  try {
    const date = todayStr();
    const [latestVital, water, latestMood, medications] = await Promise.all([
      Vital.findOne({ user: req.user._id }).sort({ recordedAt: -1 }),
      WaterLog.findOne({ user: req.user._id, date }),
      Mood.findOne({ user: req.user._id }).sort({ date: -1 }),
      Medication.find({ user: req.user._id, active: true }),
    ]);

    const goalMl = water?.goalMl || hydrationGoalMl({ weightKg: req.user.weightKg || 65 });
    const consumedMl = water?.consumedMl || 0;
    const stepsGoal = 10000;
    const steps = latestVital?.steps || 0;

    const waterProgress = Math.min(100, Math.round((consumedMl / goalMl) * 100));
    const stepsProgress = Math.min(100, Math.round((steps / stepsGoal) * 100));
    const overallProgress = Math.round((waterProgress + stepsProgress) / 2);

    res.json({
      greetingName: req.user.name,
      hydration: { consumedMl, goalMl, progress: waterProgress },
      steps: { steps, goal: stepsGoal, progress: stepsProgress },
      mood: latestMood ? { mood: latestMood.mood, date: latestMood.date } : null,
      medicationsToday: medications.map((m) => ({ id: m._id, name: m.name, times: m.times })),
      overallProgress,
      points: req.user.points,
      streak: req.user.streak,
    });
  } catch (error) {
    next(error);
  }
});

// @route POST /api/dashboard/award-points  { amount, reason }
router.post("/award-points", async (req, res, next) => {
  try {
    const { amount = 10 } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { points: amount } },
      { new: true }
    ).select("-password");
    res.json({ points: user.points });
  } catch (error) {
    next(error);
  }
});

export default router;
