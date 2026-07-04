import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const firstAidGuides = [
  {
    id: "cpr",
    title: "CPR (Adult)",
    steps: [
      "Check the scene is safe, then check responsiveness and breathing.",
      "Call your local emergency number immediately.",
      "Place hands centered on the chest, interlock fingers.",
      "Push hard and fast, 100-120 compressions per minute, ~5cm deep.",
      "Give 30 compressions, then 2 rescue breaths if trained. Repeat.",
      "Continue until help arrives or the person responds.",
    ],
  },
  {
    id: "choking",
    title: "Choking (Adult)",
    steps: [
      "Ask 'Are you choking?' — if they cannot speak/cough, act fast.",
      "Give 5 sharp back blows between the shoulder blades.",
      "If unresolved, give 5 abdominal thrusts (Heimlich maneuver).",
      "Alternate back blows and abdominal thrusts until object is expelled.",
      "Call emergency services if the person becomes unresponsive.",
    ],
  },
  {
    id: "burns",
    title: "Burns",
    steps: [
      "Remove the person from the heat source.",
      "Cool the burn under cool (not ice-cold) running water for 20 minutes.",
      "Remove jewelry/tight clothing near the area before it swells.",
      "Cover loosely with a clean, non-fluffy cloth or cling film.",
      "Seek medical help for large, deep, or facial/genital burns.",
    ],
  },
  {
    id: "bleeding",
    title: "Severe Bleeding",
    steps: [
      "Apply firm, direct pressure to the wound with a clean cloth.",
      "Keep pressure continuous; do not repeatedly check the wound.",
      "Raise the injured area above heart level if possible.",
      "If bleeding soaks through, add more cloth on top — do not remove the first layer.",
      "Call emergency services for deep or uncontrolled bleeding.",
    ],
  },
];

// Mock nearby facilities — swap with a real Google Places/Maps API call
// (see README) once you have an API key.
const mockNearbyFacilities = [
  { name: "City General Hospital", type: "hospital", distanceKm: 1.2, phone: "+91-100" },
  { name: "Sunrise Multispecialty Hospital", type: "hospital", distanceKm: 2.4, phone: "+91-100" },
  { name: "Apollo Pharmacy", type: "pharmacy", distanceKm: 0.6, phone: "+91-100" },
  { name: "24x7 MedPlus Pharmacy", type: "pharmacy", distanceKm: 0.9, phone: "+91-100" },
  { name: "Wellness Diagnostic Lab", type: "lab", distanceKm: 1.8, phone: "+91-100" },
];

// @route GET /api/emergency/first-aid
router.get("/first-aid", (req, res) => {
  res.json({ guides: firstAidGuides });
});

// @route GET /api/emergency/nearby?type=hospital
router.get("/nearby", protect, (req, res) => {
  const { type } = req.query;
  const results = type ? mockNearbyFacilities.filter((f) => f.type === type) : mockNearbyFacilities;
  res.json({ results, note: "Demo data — connect a real maps API for live results." });
});

// @route GET /api/emergency/contacts
router.get("/contacts", protect, (req, res) => {
  res.json({
    icePhone: req.user.icePhone || null,
    emergencyNumbers: [
      { label: "National Emergency Number (India)", number: "112" },
      { label: "Ambulance", number: "102" },
      { label: "Women's Helpline", number: "1091" },
    ],
  });
});

export default router;
