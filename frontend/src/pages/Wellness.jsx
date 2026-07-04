import { useEffect, useState } from "react";
import api from "../api/axios.js";

const moods = [
  { key: "great", emoji: "😄", label: "Great" },
  { key: "good", emoji: "🙂", label: "Good" },
  { key: "okay", emoji: "😐", label: "Okay" },
  { key: "low", emoji: "😔", label: "Low" },
  { key: "stressed", emoji: "😣", label: "Stressed" },
];

const Wellness = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [journalText, setJournalText] = useState("");
  const [meditations, setMeditations] = useState([]);
  const [history, setHistory] = useState([]);

  const loadPrompt = async () => {
    const { data } = await api.get("/wellness/journal/prompt");
    setPrompt(data.prompt);
  };

  useEffect(() => {
    loadPrompt();
    api.get("/wellness/meditations").then(({ data }) => setMeditations(data.meditations));
    api.get("/wellness/mood/history").then(({ data }) => setHistory(data.history));
  }, []);

  const logMood = async () => {
    if (!selectedMood) return;
    await api.post("/wellness/mood", { mood: selectedMood, note });
    setSaved(true);
    setNote("");
    const { data } = await api.get("/wellness/mood/history");
    setHistory(data.history);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveJournal = async () => {
    if (!journalText.trim()) return;
    await api.post("/wellness/journal", { prompt, content: journalText });
    setJournalText("");
    await loadPrompt();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Mental Wellness</h1>
        <p className="text-ink/50 mt-1">Check in with yourself — small daily moments add up.</p>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-lg text-ink mb-3">How are you feeling right now?</h2>
        <div className="flex gap-2 flex-wrap">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => setSelectedMood(m.key)}
              className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border-2 transition-colors ${
                selectedMood === m.key ? "border-teal bg-teal-light" : "border-black/5 bg-sage"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-xs font-medium text-ink/70">{m.label}</span>
            </button>
          ))}
        </div>
        <textarea
          className="input mt-4"
          rows={2}
          placeholder="What's on your mind? (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button onClick={logMood} disabled={!selectedMood} className="btn-primary mt-3">
          {saved ? "Saved ✓" : "Log mood"}
        </button>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-lg text-ink mb-2">Journal prompt</h2>
        <p className="text-ink/60 italic mb-3">"{prompt}"</p>
        <textarea
          className="input"
          rows={4}
          placeholder="Write freely…"
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
        />
        <button onClick={saveJournal} className="btn-secondary mt-3">
          Save entry
        </button>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-lg text-ink mb-3">Guided meditation</h2>
        <div className="space-y-3">
          {meditations.map((m) => (
            <div key={m.id} className="border border-black/5 rounded-xl p-3">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-ink text-sm">{m.title}</p>
                <span className="text-xs text-teal font-medium">{m.durationMin} min</span>
              </div>
              <p className="text-xs text-ink/50 mt-1">{m.description}</p>
            </div>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="card">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">Recent moods</h2>
          <div className="flex gap-2 flex-wrap">
            {history.slice(0, 10).map((h) => (
              <span key={h._id} className="text-xs bg-sage rounded-full px-3 py-1 text-ink/60">
                {moods.find((m) => m.key === h.mood)?.emoji} {new Date(h.date).toLocaleDateString()}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wellness;
