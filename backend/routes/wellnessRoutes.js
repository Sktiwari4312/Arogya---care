import express from "express";
import Mood from "../models/Mood.js";
import JournalEntry from "../models/JournalEntry.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);

const journalPrompts = [
  "What's one thing that went well today?",
  "What's weighing on your mind right now?",
  "Name one small thing you're grateful for today.",
  "What would make tomorrow feel 1% better?",
  "Describe your energy today in three words.",
];

const meditations = [
  { id: "m1", title: "Box Breathing", durationMin: 4, description: "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat." },
  { id: "m2", title: "Body Scan", durationMin: 8, description: "Slowly bring attention from head to toe, releasing tension." },
  { id: "m3", title: "5-4-3-2-1 Grounding", durationMin: 5, description: "Notice 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste." },
];

// @route POST /api/wellness/mood
router.post("/mood", async (req, res, next) => {
  try {
    const mood = await Mood.create({ ...req.body, user: req.user._id });
    res.status(201).json({ mood });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/wellness/mood/history
router.get("/mood/history", async (req, res, next) => {
  try {
    const history = await Mood.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/wellness/journal/prompt
router.get("/journal/prompt", (req, res) => {
  const prompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
  res.json({ prompt });
});

// @route POST /api/wellness/journal
router.post("/journal", async (req, res, next) => {
  try {
    const entry = await JournalEntry.create({ ...req.body, user: req.user._id });
    res.status(201).json({ entry });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/wellness/journal
router.get("/journal", async (req, res, next) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id }).sort({ date: -1 }).limit(30);
    res.json({ entries });
  } catch (error) {
    next(error);
  }
});

// @route GET /api/wellness/meditations  (static content library)
router.get("/meditations", (req, res) => {
  res.json({ meditations });
});

export default router;
