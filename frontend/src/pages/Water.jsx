import { useEffect, useState } from "react";
import api from "../api/axios.js";

const quickAmounts = [150, 250, 500];

const Water = () => {
  const [water, setWater] = useState(null);
  const [custom, setCustom] = useState("");

  const load = async () => {
    const { data } = await api.get("/water/today");
    setWater(data.water);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (amountMl) => {
    const { data } = await api.post("/water/add", { amountMl });
    setWater(data.water);
  };

  const progress = water ? Math.min(100, Math.round((water.consumedMl / water.goalMl) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Water Intake</h1>
        <p className="text-ink/50 mt-1">Stay hydrated — your personalized daily goal is calculated from your profile.</p>
      </div>

      <div className="card flex flex-col items-center text-center py-8">
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 120 120" className="w-40 h-40 -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#0F766E1A" strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#0F766E"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-display font-semibold text-ink">{progress}%</span>
            <span className="text-xs text-ink/50">
              {water?.consumedMl || 0} / {water?.goalMl || 0} ml
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          {quickAmounts.map((amt) => (
            <button key={amt} onClick={() => add(amt)} className="btn-secondary">
              +{amt} ml
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4 w-full max-w-xs">
          <input
            type="number"
            className="input"
            placeholder="Custom amount (ml)"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
          />
          <button
            className="btn-primary"
            onClick={() => {
              if (custom) {
                add(Number(custom));
                setCustom("");
              }
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Water;
