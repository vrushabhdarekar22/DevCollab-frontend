import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500); // replace with API call
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm bg-gray-950/60">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-blue-500 text-xl">⬡</span>
          <span className="text-lg font-bold tracking-tight">DevCollab</span>
        </button>
        <p className="text-sm text-gray-500">
          No account?{" "}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign up free
          </Link>
        </p>
      </nav>

      {/* Main */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Card */}
          <div
            className="rounded-2xl border border-white/8 p-8 md:p-10"
            style={{
              background: "linear-gradient(145deg, #111827, #0f172a)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px -20px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5 tracking-wide"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                WELCOME BACK
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                Sign in to{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)",
                  }}
                >
                  DevCollab
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                Continue building. Continue collaborating.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 pr-16 py-3.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors text-xs"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
                  style={{
                    background: loading
                      ? "rgba(59,130,246,0.5)"
                      : "linear-gradient(135deg, #2563eb, #3b82f6)",
                    boxShadow: loading ? "none" : "0 0 30px rgba(59,130,246,0.35)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Signing in…
                    </span>
                  ) : (
                    "Sign In →"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-xs text-gray-600 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-500">
              New to DevCollab?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Create a free account
              </Link>
            </p>
          </div>

          {/* Trust line */}
          <p className="text-center text-xs text-gray-700 mt-6">
            🔒 Secured with JWT · HTTP-only cookies
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;