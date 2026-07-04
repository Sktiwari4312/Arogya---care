import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sage flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-teal mx-auto mb-4 flex items-center justify-center text-white text-3xl">
            ♥
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink">Arogya Care</h1>
          <p className="text-ink/50 mt-1">Your daily health companion</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <h2 className="font-display text-xl font-semibold text-ink">Welcome back</h2>

          {error && <p className="text-sm text-coral bg-coral/10 rounded-lg px-3 py-2">{error}</p>}

          <div>
            <label className="text-sm font-medium text-ink/70">Email address</label>
            <input
              type="email"
              required
              className="input mt-1"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <input
              type="password"
              required
              className="input mt-1"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-ink/60">
            New here?{" "}
            <Link to="/signup" className="text-teal font-semibold">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
