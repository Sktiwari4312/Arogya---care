import mongoose from "mongoose";

const waterLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD, one doc per user per day
    goalMl: { type: Number, default: 2000 },
    consumedMl: { type: Number, default: 0 },
    log: [
      {
        amountMl: Number,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

waterLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("WaterLog", waterLogSchema);
