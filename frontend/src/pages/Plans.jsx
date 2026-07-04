import { useState } from "react";
import api from "../api/axios.js";

const Plans = () => {
  const [goal, setGoal] = useState("maintain");
  const [dietary, setDietary] = useState("none");
  const [level, setLevel] = useState("beginner");
  const [diet, setDiet] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const [dietRes, workoutRes] = await Promise.all([
        api.post("/plans/diet", { goal, dietary }),
        api.post("/plans/workout", { goal, level }),
      ]);
      setDiet(dietRes.data);
      setWorkout(workoutRes.data.plan);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Diet & Workout Plans</h1>
        <p className="text-ink/50 mt-1">
          Rule-based suggestions tailored to your goal and profile — not a substitute for professional medical advice.
        </p>
      </div>

      <div className="card space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/70">Goal</label>
            <select className="input mt-1" value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="lose">Lose weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain weight/muscle</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Dietary preference</label>
            <select className="input mt-1" value={dietary} onChange={(e) => setDietary(e.target.value)}>
              <option value="none">No restriction</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Fitness level</label>
            <select className="input mt-1" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={loading} className="btn-primary">
          {loading ? "Generating…" : "Generate my plan"}
        </button>
      </div>

      {diet && (
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-ink mb-2">Diet plan</h2>
          <p className="text-sm text-teal font-medium">{diet.plan.calories}</p>
          <p className="text-sm text-ink/60 mb-3">{diet.plan.focus}</p>
          <ul className="space-y-2 text-sm text-ink/80">
            {diet.plan.meals.map((meal, i) => (
              <li key={i} className="border-b border-black/5 pb-2 last:border-0">{meal}</li>
            ))}
          </ul>
          {diet.plan.notes?.length > 0 && (
            <div className="mt-3 bg-amber/10 rounded-lg p-3 text-xs text-ink/70 space-y-1">
              {diet.plan.notes.map((n, i) => (
                <p key={i}>💡 {n}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {workout && (
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">Weekly workout plan</h2>
          <div className="space-y-2">
            {workout.weekly.map((d) => (
              <div key={d.day} className="flex gap-3 text-sm border-b border-black/5 pb-2 last:border-0">
                <span className="w-10 font-semibold text-teal">{d.day}</span>
                <div>
                  <p className="font-medium text-ink">{d.focus}</p>
                  <p className="text-ink/50">{d.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Plans;
