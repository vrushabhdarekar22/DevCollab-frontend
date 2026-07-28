import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { ArrowLeft, Github, Linkedin, FileText } from "lucide-react";
import API from "../../api/api";

function badgeList(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills;
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getInitials(name, email) {
  return (name || email || "?")
    .split(" ")
    .map((t) => t[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function PublicProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setError("No user specified");
        setLoading(false);
        return;
      }
      try {
        const res = await API.get(`/user/view-others-profile/${userId}`);
        const payload = res.data?.user || res.data;
        setUser(payload);
      } catch (err) {
        const msg = err.response?.data?.error || err.message || "Failed to load profile";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center flex-col gap-3">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          <p className="text-sm text-gray-400">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center flex-col gap-3">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <span className="text-2xl">🚫</span>
          </div>
          <p className="text-base font-medium text-gray-800 dark:text-gray-200">
            {error || "Profile not found"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const skills = badgeList(user.skills);
  const initials = getInitials(user.fullName, user.email);
  const resumeLink = (() => {
    const candidates = [
      "resumeURL",
      "resumeUrl",
      "resume",
      "resumeLink",
      "resume_link",
      "cv",
      "cvLink",
      "cvURL",
      "cvUrl",
      "resumeFile",
      "resumeFileUrl",
    ];
    for (const key of candidates) {
      if (user?.[key]) return user[key];
    }
    if (user?.links && typeof user.links === "object") {
      for (const [k, v] of Object.entries(user.links)) {
        if (k.toLowerCase().includes("resume") && typeof v === "string" && v.trim()) return v.trim();
      }
    }
    if (user?.socialLinks && typeof user.socialLinks === "object") {
      for (const [k, v] of Object.entries(user.socialLinks)) {
        if (k.toLowerCase().includes("resume") && typeof v === "string" && v.trim()) return v.trim();
      }
    }
    const entry = Object.entries(user || {}).find(
      ([k, v]) => k.toLowerCase().includes("resume") && typeof v === "string" && v.trim()
    );
    return entry ? entry[1].trim() : "";
  })();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-4">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        {/* Hero card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/[0.06] rounded-2xl overflow-hidden">

          {/* Avatar + info */}
          <div className="p-6 flex gap-4 items-start">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="profile"
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-lg font-medium text-blue-600 dark:text-blue-400 flex-shrink-0">
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                {user.fullName || "Unknown user"}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
              {user.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Social links */}
          {(user.githubURL || user.linkedinURL || resumeLink) && (
            <>
              <div className="border-t border-gray-100 dark:border-white/[0.05] mx-6" />
              <div className="px-6 py-3 flex gap-2 flex-wrap">
                {user.githubURL && (
                  <a
                    href={user.githubURL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                  >
                    <Github size={12} />
                    GitHub
                  </a>
                )}
                {user.linkedinURL && (
                  <a
                    href={user.linkedinURL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                  >
                    <Linkedin size={12} />
                    LinkedIn
                  </a>
                )}
                {resumeLink && (
                  <a
                    href={resumeLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20 transition-colors"
                  >
                    <FileText size={12} />
                    Resume
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        {/* Skills card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/[0.06] rounded-2xl p-6">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
            Skills
          </p>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1.5 rounded-lg font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No skills shared yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
