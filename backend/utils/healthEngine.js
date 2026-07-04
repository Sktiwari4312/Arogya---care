// Simple, transparent rule-based "intelligence" layer.
// No external AI model is called here — these are deterministic health
// heuristics so the app works fully offline without an API key.

export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

export const bmiCategory = (bmi) => {
  if (bmi === null) return null;
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export const bpCategory = (systolic, diastolic) => {
  if (!systolic || !diastolic) return null;
  if (systolic < 120 && diastolic < 80) return "Normal";
  if (systolic < 130 && diastolic < 80) return "Elevated";
  if (systolic < 140 || diastolic < 90) return "High (Stage 1)";
  return "High (Stage 2)";
};

export const hydrationGoalMl = ({ weightKg = 65, activityLevel = "moderate" }) => {
  // ~35ml per kg body weight, adjusted for activity
  const base = weightKg * 35;
  const multiplier = { low: 0.9, moderate: 1, high: 1.2 }[activityLevel] || 1;
  return Math.round((base * multiplier) / 50) * 50; // round to nearest 50ml
};

export const suggestDietPlan = ({ goal = "maintain", bmiCat = "Normal", dietary = "none" }) => {
  const plans = {
    lose: {
      calories: "1600-1800 kcal/day",
      focus: "High protein, moderate carbs, calorie deficit",
      meals: [
        "Breakfast: Vegetable poha / oats with fruit + boiled egg or sprouts",
        "Lunch: 2 roti, dal, salad, one sabzi (avoid deep fried)",
        "Snack: Roasted chana / a fruit / green tea",
        "Dinner: Grilled paneer or fish/chicken, sauteed vegetables",
      ],
    },
    gain: {
      calories: "2400-2800 kcal/day",
      focus: "Calorie surplus with strength-supportive protein",
      meals: [
        "Breakfast: Paratha with curd, banana milkshake",
        "Lunch: Rice, dal, paneer/chicken curry, ghee",
        "Snack: Peanut butter toast / dry fruits",
        "Dinner: Roti, mixed vegetable curry, extra protein portion",
      ],
    },
    maintain: {
      calories: "2000-2200 kcal/day",
      focus: "Balanced macros, whole foods",
      meals: [
        "Breakfast: Idli/upma with sambhar or eggs and toast",
        "Lunch: Roti, dal, sabzi, curd, salad",
        "Snack: Nuts or fruit",
        "Dinner: Light khichdi or roti with vegetables",
      ],
    },
  };

  const plan = plans[goal] || plans.maintain;
  const notes = [];
  if (bmiCat === "Underweight") notes.push("Consider a slight calorie surplus and resistance training.");
  if (bmiCat === "Overweight" || bmiCat === "Obese") notes.push("Prioritize a calorie deficit with regular cardio and strength work.");
  if (dietary === "vegetarian") notes.push("All suggestions are vegetarian-friendly — swap meat items with paneer, tofu, or legumes.");
  if (dietary === "vegan") notes.push("Replace dairy/egg items with plant-based alternatives (tofu, soy milk, legumes).");

  return { ...plan, notes };
};

export const suggestWorkoutPlan = ({ goal = "maintain", level = "beginner" }) => {
  const base = {
    lose: [
      { day: "Mon", focus: "Cardio", plan: "30 min brisk walk/jog + 15 min bodyweight circuit" },
      { day: "Tue", focus: "Strength (Lower body)", plan: "3x12 squats, lunges, glute bridges" },
      { day: "Wed", focus: "Active recovery", plan: "20 min yoga / stretching" },
      { day: "Thu", focus: "Cardio + Core", plan: "25 min cycling/jump rope + plank series" },
      { day: "Fri", focus: "Strength (Upper body)", plan: "3x12 push-ups, rows, shoulder press" },
      { day: "Sat", focus: "HIIT", plan: "20 min interval training" },
      { day: "Sun", focus: "Rest", plan: "Light walk, full recovery" },
    ],
    gain: [
      { day: "Mon", focus: "Push (Chest/Shoulders/Triceps)", plan: "4x8-10 compound lifts" },
      { day: "Tue", focus: "Pull (Back/Biceps)", plan: "4x8-10 rows, pull-ups" },
      { day: "Wed", focus: "Legs", plan: "4x8-10 squats, deadlifts, lunges" },
      { day: "Thu", focus: "Rest/Mobility", plan: "Stretching, light walk" },
      { day: "Fri", focus: "Push", plan: "Repeat with progressive overload" },
      { day: "Sat", focus: "Pull", plan: "Repeat with progressive overload" },
      { day: "Sun", focus: "Legs + Core", plan: "Moderate volume + ab circuit" },
    ],
    maintain: [
      { day: "Mon", focus: "Full body strength", plan: "3x10 mixed compound lifts" },
      { day: "Tue", focus: "Cardio", plan: "30 min moderate cardio" },
      { day: "Wed", focus: "Yoga/Mobility", plan: "30 min flow" },
      { day: "Thu", focus: "Full body strength", plan: "3x10 mixed compound lifts" },
      { day: "Fri", focus: "Cardio", plan: "30 min moderate cardio" },
      { day: "Sat", focus: "Active hobby", plan: "Sport, hike, or dance for 45 min" },
      { day: "Sun", focus: "Rest", plan: "Full recovery" },
    ],
  };
  const weekly = base[goal] || base.maintain;
  return { level, weekly };
};

export const predictNextPeriod = ({ lastPeriodStart, cycleLengthDays = 28, periodLengthDays = 5 }) => {
  const start = new Date(lastPeriodStart);
  const nextStart = new Date(start);
  nextStart.setDate(start.getDate() + cycleLengthDays);
  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextStart.getDate() + periodLengthDays - 1);

  const ovulation = new Date(start);
  ovulation.setDate(start.getDate() + cycleLengthDays - 14);

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(ovulation.getDate() - 5);
  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(ovulation.getDate() + 1);

  const today = new Date();
  const daysToGo = Math.ceil((nextStart - today) / (1000 * 60 * 60 * 24));

  return {
    nextPeriodStart: nextStart,
    nextPeriodEnd: nextEnd,
    ovulationDate: ovulation,
    fertileWindow: { start: fertileStart, end: fertileEnd },
    daysToGo,
  };
};
