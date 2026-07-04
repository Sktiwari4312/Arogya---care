import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    gender: user?.gender || "prefer_not_to_say",
    heightCm: user?.heightCm || "",
    weightKg: user?.weightKg || "",
    icePhone: user?.icePhone || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/auth/me", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      });
      await refreshUser();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Your Profile</h1>
        <p className="text-ink/50 mt-1">Keep this up to date — it powers your personalized plans and goals.</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 max-w-lg">
        <div>
          <label className="text-sm font-medium text-ink/70">Full name</label>
          <input className="input mt-1" value={form.name} onChange={update("name")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/70">Age</label>
            <input type="number" className="input mt-1" value={form.age} onChange={update("age")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Gender</label>
            <select className="input mt-1" value={form.gender} onChange={update("gender")}>
              <option value="prefer_not_to_say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-ink/70">Height (cm)</label>
            <input type="number" className="input mt-1" value={form.heightCm} onChange={update("heightCm")} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Weight (kg)</label>
            <input type="number" className="input mt-1" value={form.weightKg} onChange={update("weightKg")} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Emergency (ICE) contact number</label>
          <input className="input mt-1" value={form.icePhone} onChange={update("icePhone")} placeholder="+91-XXXXXXXXXX" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary">
          {saved ? "Saved ✓" : saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
