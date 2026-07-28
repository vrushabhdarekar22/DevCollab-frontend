import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import { useToast } from "../../components/ui/ToastProvider";
import ThemeToggle from "../../components/ui/ThemeToggle";

function ForgotPassword() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDevOtp(null);

    try {
      const res = await API.post("/auth/forgot-password", { email });
      addToast(res.data?.message || "If that email exists, a reset link has been sent.", "success");

      if (res.data?.devOtp) {
        setDevOtp(res.data.devOtp);
      }
      navigate("/reset-password", { state: { email, devOtp: res.data?.devOtp } });
    } catch (err) {
      const error = err.response?.data?.message || err.message || "Something went wrong";
      addToast(error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)",
        }}
      />

      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm bg-gray-950/60">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-blue-500 text-xl">↺</span>
          <span className="text-lg font-bold tracking-tight">DevCollab</span>
        </button>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <p className="text-sm text-gray-500">
            Remembered?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Back to login
            </Link>
          </p>
        </div>
      </nav>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div
            className="rounded-2xl border border-white/8 p-8 md:p-10"
            style={{
              background: "linear-gradient(145deg, var(--surface), var(--surface-muted))",
              boxShadow:
                "0 0 0 1px var(--border), 0 40px 80px -20px rgba(15,23,42,0.45)",
            }}
          >
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full mb-5 tracking-wide"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                RESET ACCESS
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
                Forgot your password?
              </h1>
              <p className="text-sm text-gray-500">
                Enter the email you used to sign up. We’ll send a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                </div>
              </div>

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
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </div>
            </form>

            {devOtp && (
              <div className="mt-6 p-4 rounded-xl bg-gray-900/70 border border-white/10 text-sm text-gray-300 space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">DEV ONLY</p>
                <p className="break-all">OTP: {devOtp}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
