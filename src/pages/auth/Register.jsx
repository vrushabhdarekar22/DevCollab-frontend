import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Success:", data);

      // redirect after success
      navigate("/login");

    } catch (err) {
      console.error(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
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

      {/* Top glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-gray-950/60 backdrop-blur-sm">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-blue-500 text-xl">⬡</span>
          <span className="text-lg font-bold tracking-tight">DevCollab</span>
        </button>
        <p className="text-sm text-gray-500">
          Have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          {/* Card */}
          <div
            className="rounded-2xl border border-white/8 p-8 md:p-10"
            style={{
              background: "linear-gradient(145deg, #111827, #0f172a)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px -20px rgba(0,0,0,0.7)",
            }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5 tracking-wide">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                FREE FOREVER
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                Join{" "}
                <span
                  className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)" }}
                >
                  DevCollab
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                Create your account and start collaborating today.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  value={form.fullname}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Email
                </label>
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

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 pr-16 py-3.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors text-xs font-semibold"
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
                  className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: loading ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #2563eb, #3b82f6)",
                    boxShadow: loading ? "none" : "0 0 30px rgba(59,130,246,0.35)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Creating account…
                    </span>
                  ) : (
                    "Create Account →"
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

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Sign in instead
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

export default Register;