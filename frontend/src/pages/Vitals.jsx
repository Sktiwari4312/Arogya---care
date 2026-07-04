import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios.js";

const Vitals = () => {
  const [history, setHistory] = useState([]);
  const [latest, setLatest] = useState(null);
  const [bpCategory, setBpCategory] = useState(null);
  const [form, setForm] = useState({
    heightCm: "",
    weightKg: "",
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    steps: "",
    heartRate: "",
    sleepHours: "",
  });
  const [saving, setSaving] = useState(false);

  const loadHistory = async () => {
    const { data } = await api.get("/vitals?limit=14");
    setHistory([...data.vitals].reverse());
    if (data.vitals[0]) setLatest(data.vitals[0]);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v !== "").map(([k, v]) => [k, Number(v)])
      );
      const { data } = await api.post("/vitals", payload);
      setLatest(data.vital);
      setBpCategory(data.bpCategory);
      await loadHistory();
      setForm({ heightCm: "", weightKg: "", systolic: "", diastolic: "", bloodSugar: "", steps: "", heartRate: "", sleepHours: "" });
    } finally {
      setSaving(false);
    }
  };

  const chartData = history.map((v) => ({
    date: new Date(v.recordedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    BMI: v.bmi,
    Steps: v.steps,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Vitals & BMI Tracker</h1>
        <p className="text-ink/50 mt-1">Log your stats and watch the trend over time.</p>
      </div>

      {latest && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="card">
            <p className="text-xs text-ink/50 uppercase tracking-wide">BMI</p>
            <p className="text-2xl font-display font-semibold text-ink">{latest.bmi ?? "—"}</p>
            <p className="text-xs text-teal font-medium">{latest.bmiCategory}</p>
          </div>
          <div className="card">
            <p className="text-xs text-ink/50 uppercase tracking-wide">Blood Pressure</p>
            <p className="text-2xl font-display font-semibold text-ink">
              {latest.systolic ?? "—"}/{latest.diastolic ?? "—"}
            </p>
            <p className="text-xs text-coral font-medium">{bpCategory || ""}</p>
          </div>
          <div className="card">
            <p className="text-xs text-ink/50 uppercase tracking-wide">Blood Sugar</p>
            <p className="text-2xl font-display font-semibold text-ink">{latest.bloodSugar ?? "—"}</p>
          </div>
          <div className="card">
            <p className="text-xs text-ink/50 uppercase tracking-wide">Steps</p>
            <p className="text-2xl font-display font-semibold text-ink">{latest.steps ?? "—"}</p>
          </div>
        </div>
      )}

      {chartData.length > 1 && (
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">BMI trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F766E1A" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
              <Tooltip />
              <Line type="monotone" dataKey="BMI" stroke="#0F766E" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-display font-semibold text-lg text-ink">Log new reading</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/70">Height (cm)</label>
            <input type="number" className="input mt-1" value={form.heightCm} onChange={update("heightCm")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Weight (kg)</label>
            <input type="number" className="input mt-1" value={form.weightKg} onChange={update("weightKg")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Systolic BP</label>
            <input type="number" className="input mt-1" value={form.systolic} onChange={update("systolic")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Diastolic BP</label>
            <input type="number" className="input mt-1" value={form.diastolic} onChange={update("diastolic")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Blood sugar (mg/dL)</label>
            <input type="number" className="input mt-1" value={form.bloodSugar} onChange={update("bloodSugar")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Steps today</label>
            <input type="number" className="input mt-1" value={form.steps} onChange={update("steps")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Heart rate (bpm)</label>
            <input type="number" className="input mt-1" value={form.heartRate} onChange={update("heartRate")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Sleep (hours)</label>
            <input type="number" step="0.5" className="input mt-1" value={form.sleepHours} onChange={update("sleepHours")} />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto">
          {saving ? "Saving…" : "Save reading"}
        </button>
      </form>
    </div>
  );
};

export default Vitals;
