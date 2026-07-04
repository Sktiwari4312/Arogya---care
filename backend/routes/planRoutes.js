import express from "express";
import { protect } from "../middleware/auth.js";
import { suggestDietPlan, suggestWorkoutPlan, calculateBMI, bmiCategory } from "../utils/healthEngine.js";

const router = express.Router();
router.use(protect);

// @route POST /api/plans/diet  { goal, dietary }
router.post("/diet", async (req, res) => {
  const { goal = "maintain", dietary = "none" } = req.body;
  const bmi = calculateBMI(req.user.weightKg, req.user.heightCm);
  const plan = suggestDietPlan({ goal, bmiCat: bmiCategory(bmi), dietary });
  res.json({ plan, bmi });
});

// @route POST /api/plans/workout  { goal, level }
router.post("/workout", async (req, res) => {
  const { goal = "maintain", level = "beginner" } = req.body;
  const plan = suggestWorkoutPlan({ goal, level });
  res.json({ plan });
});

export default router;
