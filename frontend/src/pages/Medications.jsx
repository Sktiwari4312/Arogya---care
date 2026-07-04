import { useEffect, useState } from "react";
import api from "../api/axios.js";

const Medications = () => {
  const [meds, setMeds] = useState([]);
  const [needsRefill, setNeedsRefill] = useState([]);
  const [form, setForm] = useState({ name: "", dosage: "", times: "", pillsRemaining: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await api.get("/medications");
    setMeds(data.medications);
    setNeedsRefill(data.needsRefill);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/medications", {
        name: form.name,
        dosage: form.dosage,
        times: form.times.split(",").map((t) => t.trim()).filter(Boolean),
        pillsRemaining: Number(form.pillsRemaining) || 0,
      });
      setForm({ name: "", dosage: "", times: "", pillsRemaining: "" });
      await load();
    } finally {
      setSaving(false);
    }
  };

  const markTaken = async (id) => {
    await api.post(`/medications/${id}/taken`, { time: new Date().toTimeString().slice(0, 5) });
    await load();
  };

  const remove = async (id) => {
    await api.delete(`/medications/${id}`);
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Medication Reminders</h1>
        <p className="text-ink/50 mt-1">Never miss a dose. Track pills remaining and refill in time.</p>
      </div>

      {needsRefill.length > 0 && (
        <div className="card bg-coral/10 border border-coral/20">
          <p className="text-coral font-semibold text-sm">⚠️ Low stock — time to refill:</p>
          <p className="text-sm text-ink/70 mt-1">{needsRefill.map((m) => m.name).join(", ")}</p>
        </div>
      )}

      <div className="space-y-3">
        {meds.map((m) => (
          <div key={m._id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold text-ink">{m.name}</p>
              <p className="text-sm text-ink/50">
                {m.dosage} {m.times?.length ? `• ${m.times.join(", ")}` : ""} • {m.pillsRemaining} pills left
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => markTaken(m._id)} className="btn-secondary !px-3 !py-2 text-sm">
                Mark taken
              </button>
              <button onClick={() => remove(m._id)} className="text-coral text-sm font-medium px-2">
                Remove
              </button>
            </div>
          </div>
        ))}
        {meds.length === 0 && <p className="text-ink/40 text-sm">No medications added yet.</p>}
      </div>

      <form onSubmit={handleAdd} className="card space-y-4">
        <h2 className="font-display font-semibold text-lg text-ink">Add medication</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/70">Name</label>
            <input required className="input mt-1" value={form.name} onChange={update("name")} placeholder="Vitamin D" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Dosage</label>
            <input className="input mt-1" value={form.dosage} onChange={update("dosage")} placeholder="1 tablet" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Times (comma separated)</label>
            <input className="input mt-1" value={form.times} onChange={update("times")} placeholder="09:00, 21:00" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Pills remaining</label>
            <input type="number" className="input mt-1" value={form.pillsRemaining} onChange={update("pillsRemaining")} placeholder="30" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Adding…" : "Add medication"}
        </button>
      </form>
    </div>
  );
};

export default Medications;
