import { useEffect, useState } from "react";
import api from "../api/axios.js";

const Emergency = () => {
  const [guides, setGuides] = useState([]);
  const [openGuide, setOpenGuide] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [nearby, setNearby] = useState([]);

  useEffect(() => {
    api.get("/emergency/first-aid").then(({ data }) => setGuides(data.guides));
    api.get("/emergency/contacts").then(({ data }) => setContacts(data));
    api.get("/emergency/nearby").then(({ data }) => setNearby(data.results));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Emergency Assistant</h1>
        <p className="text-ink/50 mt-1">Quick access when every second counts.</p>
      </div>

      {contacts && (
        <div className="card bg-coral/10 border border-coral/20">
          <h2 className="font-display font-semibold text-lg text-coral mb-2">Emergency numbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {contacts.emergencyNumbers.map((n) => (
              <a key={n.number} href={`tel:${n.number}`} className="bg-white rounded-xl p-3 text-center hover:shadow-card transition-shadow">
                <p className="text-xl font-display font-semibold text-coral">{n.number}</p>
                <p className="text-xs text-ink/60 mt-1">{n.label}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="font-display font-semibold text-lg text-ink mb-3">First aid guides</h2>
        <div className="space-y-2">
          {guides.map((g) => (
            <div key={g.id} className="border border-black/5 rounded-xl overflow-hidden">
              <button
                className="w-full text-left px-4 py-3 font-medium text-ink flex justify-between items-center"
                onClick={() => setOpenGuide(openGuide === g.id ? null : g.id)}
              >
                {g.title}
                <span className="text-teal">{openGuide === g.id ? "−" : "+"}</span>
              </button>
              {openGuide === g.id && (
                <ol className="px-4 pb-4 space-y-2 text-sm text-ink/70 list-decimal list-inside">
                  {g.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="font-display font-semibold text-lg text-ink mb-3">Nearby hospitals & pharmacies</h2>
        <p className="text-xs text-ink/40 mb-3">Demo data shown — connect a live maps API for real results (see README).</p>
        <div className="space-y-2">
          {nearby.map((f) => (
            <div key={f.name} className="flex justify-between items-center border-b border-black/5 pb-2 last:border-0 text-sm">
              <div>
                <p className="font-medium text-ink">{f.name}</p>
                <p className="text-ink/50 capitalize">{f.type} • {f.distanceKm} km away</p>
              </div>
              <a href={`tel:${f.phone}`} className="text-teal font-medium">Call</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emergency;
