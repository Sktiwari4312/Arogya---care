import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "low", "stressed"],
      required: true,
    },
    stressLevel: { type: Number, min: 1, max: 5, default: 3 },
    note: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Mood", moodSchema);
