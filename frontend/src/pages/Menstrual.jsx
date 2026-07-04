import { useEffect, useState } from "react";
import api from "../api/axios.js";

const symptomTags = ["Cramps", "Headache", "Fatigue", "Bloating", "Mood swings", "Backache"];

const fmt = (d) => (d ? new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—");

const Menstrual = () => {
  const [cycle, setCycle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [form, setForm] = useState({ lastPeriodStart: "", periodLengthDays: 5, cycleLengthDays: 28 });
  const [selectedTags, setSelectedTags] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/menstrual");
    setCycle(data.cycle);
    setPrediction(data.prediction);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post("/menstrual", form);
      setCycle(data.cycle);
      setPrediction(data.prediction);
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (tag) =>
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const logSymptoms = async () => {
    if (selectedTags.length === 0) return;
    await api.post("/menstrual/symptom", { tags: selectedTags });
    setSelectedTags([]);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Menstrual Health Tracker</h1>
        <p className="text-ink/50 mt-1">Predict your cycle and log symptoms for personalized care tips.</p>
      </div>

      {prediction && (
        <div className="card bg-lavender/10 border border-lavender/20">
          <p className="text-lavender font-semibold text-sm">
            {prediction.daysToGo >= 0 ? `${prediction.daysToGo} days to go` : "Period may be starting"}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div>
              <p className="text-ink/50 text-xs uppercase">Next period</p>
              <p className="font-semibold text-ink">
                {fmt(prediction.nextPeriodStart)} – {fmt(prediction.nextPeriodEnd)}
              </p>
            </div>
            <div>
              <p className="text-ink/50 text-xs uppercase">Fertile window</p>
              <p className="font-semibold text-ink">
                {fmt(prediction.fertileWindow.start)} – {fmt(prediction.fertileWindow.end)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-display font-semibold text-lg text-ink mb-3">Log today's symptoms</h2>
        <div className="flex flex-wrap gap-2">
          {symptomTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-2 rounded-full text-sm border-2 transition-colors ${
                selectedTags.includes(tag) ? "border-lavender bg-lavender/10 text-lavender" : "border-black/5 text-ink/60"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <button onClick={logSymptoms} disabled={selectedTags.length === 0} className="btn-primary mt-4">
          Log symptoms
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-display font-semibold text-lg text-ink">{cycle ? "Update" : "Set up"} cycle info</h2>
        <div>
          <label className="text-sm font-medium text-ink/70">Last period start date</label>
          <input
            type="date"
            required
            className="input mt-1"
            value={form.lastPeriodStart}
            onChange={(e) => setForm({ ...form, lastPeriodStart: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/70">Period length (days)</label>
            <input
              type="number"
              className="input mt-1"
              value={form.periodLengthDays}
              onChange={(e) => setForm({ ...form, periodLengthDays: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Cycle length (days)</label>
            <input
              type="number"
              className="input mt-1"
              value={form.cycleLengthDays}
              onChange={(e) => setForm({ ...form, cycleLengthDays: Number(e.target.value) })}
            />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
};

export default Menstrual;
