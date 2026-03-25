import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { Crown, Users, Github, Linkedin, Pencil, X, Check } from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fullName: "Vrushabh Darekar",
    email: "vrushabh@example.com",
    bio: "Passionate full-stack developer building scalable apps 🚀",
    skills: "React, Node.js, MongoDB, Express, Tailwind CSS",
    githubURL: "https://github.com/",
    linkedinURL: "https://linkedin.com/",
    profileImage: "",
    ownedProjects: [1, 2],
    joinedProjects: [1],
  });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...user });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser({ ...form });
    setShowModal(false);
    // API call goes here
  };

  const skillList = user.skills
    ? user.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Navbar />

      <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Account
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT: Profile card */}
          <div className="bg-gray-900/60 border border-white/6 rounded-2xl p-6 flex flex-col items-center text-center h-fit">

            {/* Avatar */}
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

            {/* Stats */}
            <div className="flex gap-4 mt-5 w-full">
              <div
                className="flex-1 flex flex-col items-center py-3 rounded-xl border border-white/6 cursor-pointer hover:border-blue-500/30 transition-all duration-200"
                onClick={() => navigate("/my-projects")}
              >
                <Crown size={14} className="text-yellow-400 mb-1" />
                <p className="text-lg font-bold">{user.ownedProjects.length}</p>
                <p className="text-xs text-gray-500">Owned</p>
              </div>
              <div
                className="flex-1 flex flex-col items-center py-3 rounded-xl border border-white/6 cursor-pointer hover:border-blue-500/30 transition-all duration-200"
                onClick={() => navigate("/my-projects")}
              >
                <Users size={14} className="text-green-400 mb-1" />
                <p className="text-lg font-bold">{user.joinedProjects.length}</p>
                <p className="text-xs text-gray-500">Joined</p>
              </div>
            </div>

            {/* Links */}
            <div className="mt-5 flex flex-col gap-2 w-full">
              {user.githubURL && (
                <a
                  href={user.githubURL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
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
            </div>

            {/* Edit Profile button */}
            <button
              onClick={() => { setForm({ ...user }); setShowModal(true); }}
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

          {/* RIGHT: Details */}
          <div className="md:col-span-2 space-y-5">

            {/* Bio */}
            <div className="bg-gray-900/60 border border-white/6 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Bio
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {user.bio || "No bio added yet. Click Edit Profile to add one."}
              </p>
            </div>

            {/* Skills */}
            <div className="bg-gray-900/60 border border-white/6 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Skills
              </h3>
              {skillList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillList.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-blue-300 bg-blue-500/10 border border-blue-500/15"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No skills added yet.</p>
              )}
            </div>

            {/* Projects Overview */}
            <div className="bg-gray-900/60 border border-white/6 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Projects Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-500/5 border border-yellow-500/15 p-4 rounded-xl text-center">
                  <Crown size={18} className="text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-extrabold">{user.ownedProjects.length}</p>
                  <p className="text-gray-500 text-xs mt-1">Projects Owned</p>
                </div>
                <div className="bg-green-500/5 border border-green-500/15 p-4 rounded-xl text-center">
                  <Users size={18} className="text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-extrabold">{user.joinedProjects.length}</p>
                  <p className="text-gray-500 text-xs mt-1">Projects Joined</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/8 p-7 z-10"
            style={{
              background: "linear-gradient(145deg, #111827, #0f172a)",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px -10px rgba(0,0,0,0.8)",
            }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold">Edit Profile</h2>
                <p className="text-gray-500 text-xs mt-0.5">Update your developer profile</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tell other developers about yourself..."
                  className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  Skills
                  <span className="normal-case text-gray-600 font-normal ml-2">
                    (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB..."
                  className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="githubURL"
                  value={form.githubURL}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedinURL"
                  value={form.linkedinURL}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-gray-900/80 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 hover:bg-white/10 border border-white/6 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  boxShadow: "0 0 20px rgba(59,130,246,0.3)",
                }}
              >
                <Check size={15} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;