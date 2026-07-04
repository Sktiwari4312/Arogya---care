import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "prefer_not_to_say",
    heightCm: "",
    weightKg: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({
        ...form,
        age: form.age ? Number(form.age) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage flex items-center justify-center p-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-teal mx-auto mb-4 flex items-center justify-center text-white text-3xl">
            ♥
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink">Arogya Care</h1>
          <p className="text-ink/50 mt-1">Create your health profile</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && <p className="text-sm text-coral bg-coral/10 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="text-sm font-medium text-ink/70">Full name</label>
            <input required className="input mt-1" value={form.name} onChange={update("name")} placeholder="Abhijit Chauhan" />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Email address</label>
            <input type="email" required className="input mt-1" value={form.email} onChange={update("email")} placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <input type="password" required minLength={6} className="input mt-1" value={form.password} onChange={update("password")} placeholder="At least 6 characters" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-ink/70">Age</label>
              <input type="number" className="input mt-1" value={form.age} onChange={update("age")} placeholder="21" />
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
              <input type="number" className="input mt-1" value={form.heightCm} onChange={update("heightCm")} placeholder="170" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Weight (kg)</label>
              <input type="number" className="input mt-1" value={form.weightKg} onChange={update("weightKg")} placeholder="65" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-ink/60">
            Already have an account?{" "}
            <Link to="/login" className="text-teal font-semibold">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
