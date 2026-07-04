# Arogya Care — Your Daily Health Companion

Arogya Care is a full-stack health & wellness app that helps people track vitals, take
medications on time, stay hydrated, support their mental wellness, follow personalized
diet/workout plans, track menstrual cycles, and get help in an emergency.

Built as a **Summer Internship Project**.

> Made by Shivam Tiwari
> VIT Bhopal University

---

## ✨ Features

| Feature | Status |
|---|---|
| Auth (Signup/Login with JWT) | ✅ Real, backed by MongoDB |
| Dashboard (hydration, steps, mood, points) | ✅ Real |
| Vitals & BMI tracker (BP, sugar, steps, sleep, trend chart) | ✅ Real |
| Medication reminders (CRUD, taken log, refill alerts) | ✅ Real |
| Water intake tracker (personalized goal) | ✅ Real |
| Mental wellness (mood tracker, journaling, meditation library) | ✅ Real |
| Diet & workout plans | ⚙️ Rule-based logic (not a live AI model — see note below) |
| Menstrual cycle tracker & prediction | ✅ Real (date-math based prediction) |
| Emergency assistant (first aid guides, ICE contacts) | ✅ Real content |
| Nearby hospitals/pharmacies | 🧪 Mock data (swap in a real Maps API — see below) |
| Gamification (points) | ✅ Basic implementation |

---

## 🛠 Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router + Recharts
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt password hashing
- **HTTP client:** Axios

---

## 📁 Project Structure

```
arogya-care/
├── backend/
│   ├── config/db.js
│   ├── models/            # User, Vital, Medication, WaterLog, Mood, JournalEntry, MenstrualCycle
│   ├── middleware/         # auth.js, errorHandler.js
│   ├── routes/             # auth, vitals, medications, water, wellness, plans, menstrual, emergency, dashboard
│   ├── utils/               # generateToken.js, healthEngine.js (rule-based logic)
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/     # AppShell, ProtectedRoute, WellnessRing
    │   ├── pages/            # Login, Signup, Dashboard, Vitals, Medications, Water, Wellness, Plans, Menstrual, Emergency, Profile
    │   ├── App.jsx, main.jsx, index.css
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Running Locally

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env — add your MongoDB URI and a JWT secret
npm install
npm run dev      # starts on http://localhost:5000
```


### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev      # starts on http://localhost:5173
```

Open `http://localhost:5173`, sign up for a new account, and explore.

---

## ☁️ Deploying (so you have a live link)

### Backend → Render
1. Push this repo to GitHub.
2. On [render.com](https://render.com), create a **New Web Service** from your repo, root
   directory `backend`.
3. Build command: `npm install` — Start command: `npm start`.
4. Add environment variables from your `.env` (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
5. Deploy. Note the resulting URL, e.g. `https://arogya-care-api.onrender.com`.

### Frontend → Vercel (or Netlify)
1. On [vercel.com](https://vercel.com), import the repo, root directory `frontend`.
2. Framework preset: Vite.
3. Add environment variable `VITE_API_URL` = `https://arogya-care-api.onrender.com/api`.
4. Deploy.
5. Go back to your Render backend and set `CLIENT_URL` to your new Vercel URL (for CORS).

---

## 🔑 Optional: wiring in a real AI model

To replace the rule-based diet/workout engine (`backend/utils/healthEngine.js`) with a
real LLM:
1. Get an API key from your preferred provider.
2. In `backend/routes/planRoutes.js`, replace the call to `suggestDietPlan` /
   `suggestWorkoutPlan` with a call to the provider's chat completion endpoint, passing the
   user's BMI, goal, and preferences as context.
3. Keep the current rule-based functions as a fallback in case the API call fails.

## 🗺 Optional: real nearby hospitals/pharmacies

`backend/routes/emergencyRoutes.js` currently returns mock data for `/api/emergency/nearby`.
To go live, get a Google Places API key and replace the mock array with a call to the
[Places Nearby Search API](https://developers.google.com/maps/documentation/places/web-service/nearby-search),
filtered by `hospital` / `pharmacy` type and the user's geolocation (sent from the frontend
via `navigator.geolocation`).

---
