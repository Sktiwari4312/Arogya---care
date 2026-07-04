import express from "express";
import MenstrualCycle from "../models/MenstrualCycle.js";
import { protect } from "../middleware/auth.js";
import { predictNextPeriod } from "../utils/healthEngine.js";

const router = express.Router();
router.use(protect);

// @route POST /api/menstrual  - log/update cycle start
router.post("/", async (req, res, next) => {
  try {
    const { lastPeriodStart, periodLengthDays, cycleLengthDays } = req.body;
    let cycle = await MenstrualCycle.findOne({ user: req.user._id });
    if (!cycle) {
      cycle = await MenstrualCycle.create({
        user: req.user._id,
        lastPeriodStart,
        periodLengthDays,
        cycleLengthDays,
      });
    } else {
      cycle.lastPeriodStart = lastPeriodStart || cycle.lastPeriodStart;
      cycle.periodLengthDays = periodLengthDays || cycle.periodLengthDays;
      cycle.cycleLengthDays = cycleLengthDays || cycle.cycleLengthDays;
      await cycle.save();
    }
    const prediction = predictNextPeriod(cycle);
    res.json({ cycle, prediction });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/menstrual
router.get("/", async (req, res, next) => {
  try {
    const cycle = await MenstrualCycle.findOne({ user: req.user._id });
    if (!cycle) return res.json({ cycle: null, prediction: null });
    const prediction = predictNextPeriod(cycle);
    res.json({ cycle, prediction });
  } catch (error) {
    next(error);
  }
});

// @route POST /api/menstrual/symptom
router.post("/symptom", async (req, res, next) => {
  try {
    const cycle = await MenstrualCycle.findOne({ user: req.user._id });
    if (!cycle) return res.status(404).json({ message: "No cycle data yet. Log a period start date first." });
    cycle.symptoms.push({ date: req.body.date || new Date(), tags: req.body.tags || [], notes: req.body.notes });
    await cycle.save();
    res.json({ cycle });
  } catch (error) {
    next(error);
  }
});

export default router;
