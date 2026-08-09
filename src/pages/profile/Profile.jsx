import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { useTheme } from "../../components/ui/ThemeProvider";
import { Crown, Users, Github, Linkedin, Pencil, X, Check } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const lightRafRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalLightPos, setModalLightPos] = useState({ x: 50, y: 25 });
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    skills: "",
    githubURL: "",
    linkedinURL: "",
    resumeURL: "",
    profileImage: ""
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_BASE_URL}/user/view-profile`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error(data.error || "Failed to load profile");
        }
        setUser(data);
        setForm({
          fullName: data.fullName || "",
          bio: data.bio || "",
          skills: data.skills || "",
          githubURL: data.githubURL || "",
          linkedinURL: data.linkedinURL || "",
          resumeURL: data.resumeURL || "",
          profileImage: data.profileImage || ""
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load profile: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (lightRafRef.current) {
        cancelAnimationFrame(lightRafRef.current);
        lightRafRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const scheduleModalLightUpdate = (nextPos) => {
    if (lightRafRef.current) return;
    lightRafRef.current = requestAnimationFrame(() => {
      setModalLightPos(nextPos);
      lightRafRef.current = null;
    });
  };

  const handleModalPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    scheduleModalLightUpdate({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleModalPointerLeave = () => {
    scheduleModalLightUpdate({ x: 50, y: 25 });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        fullName: form.fullName,
        bio: form.bio,
        skills: form.skills,
        githubURL: form.githubURL,
        linkedinURL: form.linkedinURL,
        resumeURL: form.resumeURL,
        profileImage: form.profileImage,
      };

      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${API_BASE_URL}/user/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error || body.message || "Update failed");
      }
      setUser({ ...user, ...updates });
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Failed to load profile</p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const skillList = user.skills
    ? user.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--overlay) 1px, transparent 1px), linear-gradient(90deg, var(--overlay) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Navbar />

      <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Account
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/6 rounded-2xl p-6 flex flex-col items-center text-center h-fit">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="profile"
                className="w-24 h-24 rounded-2xl object-cover"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-extrabold"
                style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
              >
                {user.fullName.charAt(0)}
              </div>
            )}

            <h2 className="mt-4 text-xl font-bold">{user.fullName}</h2>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>

            <div className="flex gap-4 mt-5 w-full">
              <div
                className="flex-1 flex flex-col items-center py-3 rounded-xl border border-gray-200 dark:border-white/6 cursor-pointer hover:border-blue-500/30 transition-all duration-200"
                onClick={() => navigate("/my-projects")}
              >
                <Crown size={14} className="text-yellow-400 mb-1" />
                <p className="text-lg font-bold">{user.ownedProjects?.length || 0}</p>
                <p className="text-xs text-gray-500">Owned</p>
              </div>
              <div
                className="flex-1 flex flex-col items-center py-3 rounded-xl border border-gray-200 dark:border-white/6 cursor-pointer hover:border-blue-500/30 transition-all duration-200"
                onClick={() => navigate("/my-projects")}
              >
                <Users size={14} className="text-green-400 mb-1" />
                <p className="text-lg font-bold">{user.joinedProjects?.length || 0}</p>
                <p className="text-xs text-gray-500">Joined</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 w-full">
              {user.githubURL && (
                <a
                  href={user.githubURL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  <Github size={15} />
                  GitHub
                </a>
              )}
              {user.linkedinURL && (
                <a
                  href={user.linkedinURL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/15 text-blue-400 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  <Linkedin size={15} />
                  LinkedIn
                </a>
              )}
              {user.resumeURL && (
                <a
                  href={user.resumeURL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  Resume
                </a>
              )}
            </div>

            <button
              onClick={() => {
                setForm({
                  fullName: user.fullName || "",
                  bio: user.bio || "",
                  skills: user.skills || "",
                  githubURL: user.githubURL || "",
                  linkedinURL: user.linkedinURL || "",
                  resumeURL: user.resumeURL || "",
                  profileImage: user.profileImage || "",
                });
                setShowModal(true);
              }}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                boxShadow: "0 0 20px rgba(59,130,246,0.25)",
              }}
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>

          <div className="md:col-span-2 space-y-5">
            <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/6 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-3">
                Bio
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {user.bio || "No bio added yet. Click Edit Profile to add one."}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/6 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
                Skills
              </h3>
              {skillList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/15"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills added yet.</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-white/6 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
                Projects Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-500/5 border border-yellow-500/15 p-4 rounded-xl text-center">
                  <Crown size={18} className="text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-extrabold">{user.ownedProjects?.length || 0}</p>
                  <p className="text-gray-500 text-xs mt-1">Projects Owned</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/15 p-4 rounded-xl text-center">
                  <Users size={18} className="text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-extrabold">{user.joinedProjects?.length || 0}</p>
                  <p className="text-gray-500 text-xs mt-1">Projects Joined</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div
            className="relative w-full max-w-lg rounded-2xl border border-gray-200 dark:border-white/8 p-7 z-10 overflow-hidden"
            style={{
              background: "linear-gradient(145deg, var(--surface), var(--surface-muted))",
              boxShadow:
                theme === "light"
                  ? "0 0 0 1px rgba(15,23,42,0.06), 0 40px 80px -10px rgba(15,23,42,0.22)"
                  : "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px -10px rgba(0,0,0,0.8)",
            }}
            onPointerMove={handleModalPointerMove}
            onPointerLeave={handleModalPointerLeave}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  theme === "light"
                    ? `radial-gradient(650px circle at ${modalLightPos.x}% ${modalLightPos.y}%, rgba(37,99,235,0.16), transparent 60%), radial-gradient(520px circle at ${modalLightPos.x}% ${modalLightPos.y}%, rgba(14,165,233,0.10), transparent 64%)`
                    : `radial-gradient(650px circle at ${modalLightPos.x}% ${modalLightPos.y}%, rgba(59,130,246,0.22), transparent 58%), radial-gradient(500px circle at ${modalLightPos.x}% ${modalLightPos.y}%, rgba(168,85,247,0.10), transparent 62%)`,
                mixBlendMode: theme === "light" ? "multiply" : "screen",
                opacity: theme === "light" ? 0.55 : 0.9,
                transition: "opacity 200ms ease",
              }}
            />
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Edit Profile</h2>
                <p className="text-gray-600 dark:text-gray-500 text-xs mt-0.5">Update your developer profile</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/8 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell other developers about yourself..."
                  className="w-full bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/8 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                  Skills
                  <span className="normal-case text-gray-500 dark:text-gray-600 font-normal ml-2">
                    (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB..."
                  className="w-full bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/8 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubURL"
                  value={form.githubURL}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/8 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinURL"
                  value={form.linkedinURL}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/8 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-2">
                  Resume URL
                </label>
                <input
                  type="url"
                  name="resumeURL"
                  value={form.resumeURL}
                  onChange={handleChange}
                  placeholder="https://example.com/resume.pdf"
                  className="w-full bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-white/8 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-400 bg-gray-100 hover:bg-gray-200 border border-gray-200 dark:border-white/6 dark:bg-white/5 dark:hover:bg-white/10 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: saving ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #2563eb, #3b82f6)",
                  boxShadow: saving ? "none" : "0 0 20px rgba(59,130,246,0.3)",
                }}
              >
                {saving ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={15} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
