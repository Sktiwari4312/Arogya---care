import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    dosage: { type: String },
    times: [{ type: String }], // e.g. ["08:00", "20:00"]
    frequency: { type: String, default: "daily" },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    pillsRemaining: { type: Number, default: 0 },
    refillThreshold: { type: Number, default: 5 },
    takenLog: [
      {
        date: { type: Date, default: Date.now },
        time: String,
        taken: { type: Boolean, default: true },
      },
    ],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Medication", medicationSchema);
