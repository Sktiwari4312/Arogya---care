import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    heightCm: Number,
    weightKg: Number,
    bmi: Number,
    bmiCategory: String,
    systolic: Number,
    diastolic: Number,
    bloodSugar: Number,
    steps: { type: Number, default: 0 },
    heartRate: Number,
    sleepHours: Number,
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Vital", vitalSchema);
