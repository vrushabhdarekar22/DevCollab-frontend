import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icon: "🔍",
    title: "Discover Projects",
    desc: "Explore real-world projects posted by developers worldwide looking for collaborators.",
  },
  {
    icon: "🤝",
    title: "Join & Collaborate",
    desc: "Send join requests, get accepted, and start contributing to meaningful work.",
  },
  {
    icon: "📋",
    title: "Manage Tasks",
    desc: "Owner-controlled task boards with assignment, status tracking, and deadlines.",
  },
  {
    icon: "👤",
    title: "Developer Profiles",
    desc: "Showcase your bio, skills, GitHub and LinkedIn to attract the right teammates.",
  },
];


// do it later
const STATS = [
  { value: "500+", label: "Projects" },
  { value: "2k+", label: "Developers" },
  { value: "10k+", label: "Tasks Done" },
];


// counter starts from 1 when refresh
function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, ""));
  const suffix = target.replace(/[0-9]/g, "");

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(numericTarget / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= numericTarget) {
        setCount(numericTarget);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [numericTarget]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}


function Landing() {
  const navigate = useNavigate();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // this is for when stats counts to show
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden font-sans">
      {/* Animated grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.13) 0%, transparent 70%)",
        }}
      />

      {/* ── NAV ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm bg-gray-950/60">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-xl">⬡</span>
          <span className="text-lg font-bold tracking-tight">DevCollab</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg font-medium"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Collaborate. Build. Ship.
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6 max-w-4xl">
          Build Together.
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)",
            }}
          >
            Ship Faster.
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
          DevCollab connects developers with real-world projects, structured
          collaboration, and powerful task tracking — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => navigate("/register")}
            className="group relative px-8 py-3.5 rounded-xl font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: "0 0 30px rgba(59,130,246,0.35)",
            }}
          >
            <span className="relative z-10">Start Collaborating →</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
            />
          </button>
          <button
            onClick={() => navigate("/projects")}
            className="px-8 py-3.5 rounded-xl font-semibold text-gray-300 border border-white/10 hover:border-blue-500/40 hover:text-white transition-all duration-300 hover:bg-white/5"
          >
            Explore Projects
          </button>
        </div>

        {/* Hero visual */}
        <div className="mt-20 w-full max-w-3xl mx-auto">
          <div
            className="relative rounded-2xl border border-white/8 overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #111827, #0f172a)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px -20px rgba(0,0,0,0.8)",
            }}
          >
            {/* Fake window bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-white/3">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs text-gray-600 font-mono">
                devcollab.app / explore
              </span>
            </div>
            {/* Fake dashboard content */}
            <div className="p-6 grid grid-cols-3 gap-4">
              {["Full-Stack SaaS", "Open Source CLI", "Mobile App"].map(
                (title, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-4 border border-white/5 bg-gray-900/60 flex flex-col gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                      style={{
                        background: [
                          "rgba(59,130,246,0.15)",
                          "rgba(16,185,129,0.15)",
                          "rgba(245,158,11,0.15)",
                        ][i],
                      }}
                    >
                      {["⚡", "🔧", "📱"][i]}
                    </div>
                    <p className="text-xs font-semibold text-white">{title}</p>
                    <div className="flex gap-1 flex-wrap">
                      {[
                        ["React", "Node"],
                        ["Go", "CLI"],
                        ["RN", "Expo"],
                      ][i].map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: ["65%", "40%", "80%"][i],
                            background: [
                              "#3b82f6",
                              "#10b981",
                              "#f59e0b",
                            ][i],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          
          {/* Glow under card */}
          <div
            className="h-10 mx-16 rounded-b-full blur-2xl opacity-30"
            style={{ background: "linear-gradient(90deg, transparent, #3b82f6, transparent)" }}
          />
        </div>
      </section>

      {/* ── STATS ── 
      <section DOM element>
      DOM Element->ref.current
      */}
      
      <section
       ref={statsRef}
        className="relative z-10 border-y border-white/5 py-14"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-around gap-8 text-center px-6">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div
                className="text-4xl font-black mb-1 tabular-nums"
                style={{
                  backgroundImage: "linear-gradient(135deg, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {statsVisible ? <AnimatedCounter target={value} /> : "0"}
              </div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-widest">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ── FEATURES ── */}
      <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Everything You Need
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            One platform. Every stage.
          </h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            From discovering projects to shipping features, DevCollab has all
            the tools your team needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="group relative p-6 rounded-2xl border border-white/6 bg-gray-900/40 hover:border-blue-500/30 hover:bg-gray-900/70 transition-all duration-300 cursor-default overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.06) 0%, transparent 70%)",
                }}
              />
              <div className="text-3xl mb-4">{icon}</div>
              <h3 className="text-base font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="relative z-10 py-24 px-6"
        style={{ background: "rgba(255,255,255,0.015)" }}
      >
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            From signup to shipping
          </h2>
        </div>

        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-start gap-0 md:gap-0">
          {[
            { step: "01", title: "Create Profile", desc: "Add your skills, GitHub, and bio to stand out." },
            { step: "02", title: "Find a Project", desc: "Browse and send a join request to projects you love." },
            { step: "03", title: "Collaborate", desc: "Get accepted, manage tasks, and ship together." },
          ].map(({ step, title, desc }, i) => (
            <div key={i} className="flex-1 flex flex-col md:flex-row items-start">
              <div className="flex flex-col items-center md:items-start flex-1 px-6">
                <div
                  className="text-xs font-black mb-3 px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(59,130,246,0.12)",
                    color: "#60a5fa",
                    fontFamily: "monospace",
                  }}
                >
                  {step}
                </div>
                <h3 className="text-base font-semibold mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:flex items-center pt-5 text-gray-700 text-xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 px-6 py-28 text-center">
        <div
          className="max-w-2xl mx-auto p-12 rounded-3xl border border-blue-500/20 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, rgba(59,130,246,0.08), rgba(37,99,235,0.04))",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 60% 40%, rgba(59,130,246,0.1) 0%, transparent 70%)",
            }}
          />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 relative z-10">
            Ready to build something great?
          </h2>
          <p className="text-gray-400 mb-8 relative z-10">
            Join hundreds of developers already collaborating on DevCollab.
            It's free to get started.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="relative z-10 px-10 py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: "0 0 40px rgba(59,130,246,0.4)",
            }}
          >
            Join DevCollab — It's Free
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-blue-500">⬡</span>
          <span className="font-semibold text-gray-400">DevCollab</span>
        </div>
        <p>Meet developers: Harsh Kavade,Vrushabh Darekar</p>
        <p>© {new Date().getFullYear()} DevCollab. Built for developers, by developers.</p>
      </footer>
    </div>
  );
}

export default Landing;