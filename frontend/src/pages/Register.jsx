import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(email, password, { displayName: "" });
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold text-slate-900">GetRespondr</Link>
          <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-slate-900">Home</Link>
            <Link to="/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link to="/live-map" className="hover:text-slate-900">Live Map</Link>
            <Link to="/incidents" className="hover:text-slate-900">Incidents</Link>
            <Link to="/login" className="rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">Sign in</Link>
          </nav>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Join GetRespondr</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Create account</h2>
            <p className="mt-2 text-sm text-slate-600">A normal account lets you browse public information immediately.</p>
          </div>
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <label className="mb-4 block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" type="email" required />
          </label>
          <label className="mb-4 block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" type="password" required />
          </label>
          <label className="mb-5 block">
            <span className="text-sm font-medium text-slate-700">Confirm Password</span>
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" type="password" required />
          </label>
          <button disabled={loading} className="w-full rounded-xl bg-green-600 px-4 py-3 text-white transition hover:bg-green-700">{loading ? "Creating..." : "Create account"}</button>

          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
