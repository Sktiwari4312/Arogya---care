import express from "express";
import Medication from "../models/Medication.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

// @route POST /api/medications
router.post("/", async (req, res, next) => {
  try {
    const med = await Medication.create({ ...req.body, user: req.user._id });
    res.status(201).json({ medication: med });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/medications
router.get("/", async (req, res, next) => {
  try {
    const meds = await Medication.find({ user: req.user._id, active: true }).sort({ createdAt: -1 });
    const needsRefill = meds.filter((m) => m.pillsRemaining <= m.refillThreshold);
    res.json({ medications: meds, needsRefill });
  } catch (error) {
    next(error);
  }
});

// @route PUT /api/medications/:id
router.put("/:id", async (req, res, next) => {
  try {
    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!med) return res.status(404).json({ message: "Medication not found" });
    res.json({ medication: med });
  } catch (error) {
    next(error);
  }
});

// @route POST /api/medications/:id/taken  - log a dose taken
router.post("/:id/taken", async (req, res, next) => {
  try {
    const med = await Medication.findOne({ _id: req.params.id, user: req.user._id });
    if (!med) return res.status(404).json({ message: "Medication not found" });

    med.takenLog.push({ time: req.body.time, taken: true });
    if (med.pillsRemaining > 0) med.pillsRemaining -= 1;
    await med.save();

    res.json({ medication: med, lowStock: med.pillsRemaining <= med.refillThreshold });
  } catch (error) {
    next(error);
  }
});

// @route DELETE /api/medications/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const med = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { active: false },
      { new: true }
    );
    if (!med) return res.status(404).json({ message: "Medication not found" });
    res.json({ message: "Medication removed" });
  } catch (error) {
    next(error);
  }
});

export default router;
