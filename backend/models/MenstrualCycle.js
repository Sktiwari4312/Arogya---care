import mongoose from "mongoose";

const menstrualCycleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lastPeriodStart: { type: Date, required: true },
    periodLengthDays: { type: Number, default: 5 },
    cycleLengthDays: { type: Number, default: 28 },
    symptoms: [
      {
        date: Date,
        tags: [String], // e.g. cramps, headache, fatigue
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("MenstrualCycle", menstrualCycleSchema);
