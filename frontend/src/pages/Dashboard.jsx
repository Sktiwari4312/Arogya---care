import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import WellnessRing from "../components/WellnessRing.jsx";

const quickLinks = [
  { to: "/vitals", label: "Track Vitals", icon: "📈", color: "bg-teal-light text-teal" },
  { to: "/plans", label: "Diet Plan", icon: "🥗", color: "bg-amber/15 text-amber" },
  { to: "/medications", label: "Medications", icon: "💊", color: "bg-lavender/15 text-lavender" },
  { to: "/wellness", label: "Mental Wellness", icon: "🧠", color: "bg-coral/10 text-coral" },
  { to: "/emergency", label: "Emergency Help", icon: "🚨", color: "bg-coral/15 text-coral" },
];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then(({ data }) => setSummary(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink/50">Loading your day…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-ink">
          Good day, {summary?.greetingName?.split(" ")[0]} 👋
        </h1>
        <p className="text-ink/50 mt-1">Here's how your health is tracking today.</p>
      </div>

      <div className="card flex flex-col md:flex-row items-center gap-6">
        <WellnessRing
          hydration={summary?.hydration.progress || 0}
          steps={summary?.steps.progress || 0}
          overall={summary?.overallProgress || 0}
        />
        <div className="flex-1 grid grid-cols-2 gap-4 w-full">
          <div className="rounded-xl bg-teal-light p-4">
            <p className="text-xs text-teal font-semibold uppercase tracking-wide">Hydration</p>
            <p className="text-xl font-display font-semibold text-ink mt-1">
              {summary?.hydration.consumedMl} / {summary?.hydration.goalMl} ml
            </p>
          </div>
          <div className="rounded-xl bg-coral/10 p-4">
            <p className="text-xs text-coral font-semibold uppercase tracking-wide">Steps</p>
            <p className="text-xl font-display font-semibold text-ink mt-1">
              {summary?.steps.steps.toLocaleString()} / {summary?.steps.goal.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl bg-amber/10 p-4">
            <p className="text-xs text-amber font-semibold uppercase tracking-wide">Mood</p>
            <p className="text-xl font-display font-semibold text-ink mt-1 capitalize">
              {summary?.mood?.mood || "Not logged"}
            </p>
          </div>
          <div className="rounded-xl bg-lavender/10 p-4">
            <p className="text-xs text-lavender font-semibold uppercase tracking-wide">Points</p>
            <p className="text-xl font-display font-semibold text-ink mt-1">{summary?.points} pts</p>
          </div>
        </div>
      </div>

      {summary?.medicationsToday?.length > 0 && (
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">Today's medications</h2>
          <ul className="space-y-2">
            {summary.medicationsToday.map((m) => (
              <li key={m.id} className="flex items-center justify-between text-sm border-b border-black/5 pb-2 last:border-0">
                <span className="font-medium text-ink">{m.name}</span>
                <span className="text-ink/50">{m.times?.join(", ") || "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold text-lg text-ink mb-3">Quick access</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to} className="card flex flex-col items-center gap-2 text-center hover:-translate-y-0.5 transition-transform">
              <span className={`w-11 h-11 rounded-full flex items-center justify-center text-lg ${q.color}`}>{q.icon}</span>
              <span className="text-sm font-medium text-ink">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
