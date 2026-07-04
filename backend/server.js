import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import vitalRoutes from "./routes/vitalRoutes.js";
import medicationRoutes from "./routes/medicationRoutes.js";
import waterRoutes from "./routes/waterRoutes.js";
import wellnessRoutes from "./routes/wellnessRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import menstrualRoutes from "./routes/menstrualRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Arogya Care API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/wellness", wellnessRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/menstrual", menstrualRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Arogya Care API listening on port ${PORT}`));
