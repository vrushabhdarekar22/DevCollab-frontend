import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/api";
import { useToast } from "../../components/ui/ToastProvider";
import {
  ArrowLeft, Calendar, Crown, Users, Layers,
  Clock, CheckCircle2, Send, Lock, AlertCircle,
} from "lucide-react";

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function formatDate(dateStr) {
  if (!dateStr) return "â€”";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function Avatar({ name }) {
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold text-white preserve-white shrink-0"
      style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
    >
      {getInitials(name)}
    </div>
  );
}

const STATUS_MAP = {
  open: { label: "Open", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/25", dot: "bg-emerald-400" },
  closed: { label: "Closed", color: "text-red-400", bg: "bg-red-500/10 border-red-500/25", dot: "bg-red-400" },
  completed: { label: "Completed", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/25", dot: "bg-blue-400" },
};

const DEFAULT_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Designer",
  "QA Engineer",
  "Product Manager",
];

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.open;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold ${s.bg} ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${s.dot}`} />
      {s.label}
    </span>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/6 bg-gray-900/60 p-6 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

// â”€â”€ MAIN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function ViewProject() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user/view-profile");
        setCurrentUser(res.data);
      } catch {}
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      try {
        const res = await API.get(`/project/view-project/${projectId}`);
        const proj = res.data.project || res.data;
        setProject(proj);
        const pendingMap = {};
        (proj.joinRequests || []).forEach((jr) => {
          if (jr.status === "pending" && jr.role) {
            pendingMap[jr.role] = (pendingMap[jr.role] || 0) + 1;
          }
        });
        const firstRole =
          (proj.requiredRoles || [])
            .map((r) => ({ role: r.role, remaining: (r.count ?? 0) - (pendingMap[r.role] || 0) }))
            .find((r) => r.remaining > 0)?.role ||
          DEFAULT_ROLES[0];
        setSelectedRole(firstRole);
      } catch (err) {
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, navigate]);

  const membersRestricted =
    project?.membersRestricted === true ||
    (!Array.isArray(project?.members) && typeof project?.members === "string");
  const members = Array.isArray(project?.members) ? project.members : [];
  const membersCount =
    typeof project?.membersCount === "number" ? project.membersCount : members.length;
  const requests = Array.isArray(project?.joinRequests) ? project.joinRequests : [];

  const remainingSlotsByRole = (role) => {
    const info = (project?.requiredRoles || []).find((r) => r.role === role);
    if (!info) return 0;
    const pending = requests.filter((r) => r.role === role && r.status === "pending").length;
    return Math.max((info.count ?? 0) - pending, 0);
  };

  const availableRoles = (project?.requiredRoles || [])
    .map((r) => ({ ...r, remaining: remainingSlotsByRole(r.role) }))
    .filter((r) => r.remaining > 0);

  const rolesExhausted = (project?.requiredRoles?.length || 0) > 0 && availableRoles.length === 0;

  const isOwner =
    currentUser && project?.createdBy?._id?.toString?.() === currentUser._id?.toString?.();
  const isMember = currentUser && members.some(
    (m) => (m.user?._id || m._id)?.toString() === currentUser._id?.toString()
  );
  const hasPendingRequest = currentUser && requests.some(
    (r) => (r.user?._id || r.user)?.toString() === currentUser._id?.toString() && r.status === "pending"
  );
  const canRequest =
    !isOwner &&
    !isMember &&
    !hasPendingRequest &&
    project?.status === "open" &&
    !rolesExhausted;

  const handleSendRequest = async () => {
    if (!message.trim()) return;
    if (!selectedRole) return;
    if (project?.requiredRoles?.length > 0) {
      const remaining = remainingSlotsByRole(selectedRole);
      if (remaining <= 0) {
        addToast("Selected role is no longer available", "error");
        return;
      }
    }
    setSending(true);
    try {
      await API.post("/project/send-request", { projectId, message, role: selectedRole });
      setMessage("");
      setSent(true);
      setProject((p) => ({
        ...p,
        joinRequests: [
          ...(p.joinRequests || []),
          { user: currentUser._id, status: "pending", role: selectedRole },
        ],
      }));
      addToast("Request sent successfully", "success");
    } catch (err) {
      const errMsg = err.response?.data?.message || "Something went wrong";
      addToast(errMsg, "error");
      alert(errMsg);
    } finally {
      setSending(false);
    }
  };

  // â”€â”€ Loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center flex-col gap-3">
          <svg className="animate-spin w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-gray-500">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center flex-col gap-3">
          <p className="text-4xl">ðŸš«</p>
          <p className="text-lg font-semibold">Project not found</p>
          <button onClick={() => navigate(-1)} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            â† Go back
          </button>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Explore
        </button>

        {/* â”€â”€ Hero section â”€â”€ */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <StatusBadge status={project.status} />
            {isOwner && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-yellow-500/10 border-yellow-500/25 text-yellow-400 font-semibold">
                <Crown size={11} /> Your Project
              </span>
            )}
            {isMember && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border bg-green-500/10 border-green-500/25 text-green-400 font-semibold">
                <CheckCircle2 size={11} /> You're a Member
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {project.title}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* â”€â”€ Left: main info â”€â”€ */}
          <div className="lg:col-span-2 space-y-6">

            {/* Tech Stack */}
            <Card>
              <SectionLabel>Tech Stack</SectionLabel>
              {project.techStack?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium text-blue-300 bg-blue-500/10 border border-blue-500/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No tech stack listed.</p>
              )}
            </Card>

            {/* Members */}
            <Card>
              <SectionLabel>Team Members ({membersCount})</SectionLabel>
              {membersRestricted ? (
                <p className="text-sm text-gray-600">
                  Join this project to see the member list.
                </p>
              ) : members.length > 0 ? (
                <div className="space-y-3">
                  {members.map((m) => {
                    const member = m.user && typeof m.user === "object" ? m.user : m;
                    const memberId = member?._id || member;
                    const memberName = member?.fullName || member?.name || member?.email || "Unknown";
                    const isThisOwner = project.createdBy?._id?.toString() === memberId?.toString();
                    return (
                      <div
                        key={memberId || m._id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/60 border border-white/5"
                      >
                        <Avatar name={memberName} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {memberName}
                          </p>
                          <p className="text-xs text-gray-500">{member.email || ""}</p>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                            isThisOwner || m.role === "owner"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/15"
                              : "bg-gray-500/10 text-gray-300 border border-gray-500/15"
                          }`}
                        >
                          {isThisOwner || m.role === "owner" ? <Crown size={10} /> : <Users size={10} />}
                          {isThisOwner || m.role === "owner" ? "Owner" : (m.role || "Role not set")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No members yet.</p>
              )}
            </Card>

            {/* â”€â”€ Join Request Box â”€â”€ */}
            {canRequest && (
              <Card>
                <SectionLabel>Request to Join</SectionLabel>
                <p className="text-sm text-gray-500 mb-4">
                  Tell the owner why you'd be a great fit for this project.
                </p>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Role you want to fill
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                    >
                      <option value="">Select a role</option>
                    {(project?.requiredRoles?.length
                      ? availableRoles.map((r) => r.role)
                      : DEFAULT_ROLES
                    ).map((role) => (
                      <option key={role} value={role}>
                        {role}
                        {project?.requiredRoles?.length
                          ? (() => {
                              const remaining = remainingSlotsByRole(role);
                              return remaining >= 0 ? ` (${remaining} open)` : "";
                            })()
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. I have 2 years of experience with React and Node.js, and I'd love to contribute to this project by building out the authentication module..."
                  rows={4}
                  className="w-full bg-gray-900 border border-white/8 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none mb-3"
                />
                <button
                  onClick={handleSendRequest}
                  disabled={
                    sending ||
                    !message.trim() ||
                    !selectedRole
                  }
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white preserve-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    boxShadow: "0 0 24px rgba(59,130,246,0.3)",
                  }}
                >
                  {sending ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Join Request
                    </>
                  )}
                </button>
              </Card>
            )}

            {/* All roles filled */}
            {rolesExhausted && (
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Team is full</p>
                    <p className="text-xs text-gray-500">
                      All listed roles are filled. Check back later or explore other projects.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Already sent */}
            {(hasPendingRequest || sent) && !isOwner && !isMember && (
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <Clock size={16} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Request Pending</p>
                    <p className="text-xs text-gray-500">
                      Your join request is awaiting the owner's approval.
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Closed project */}
            {!isOwner && !isMember && project?.status !== "open" && (
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Lock size={16} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Project Closed</p>
                    <p className="text-xs text-gray-500">
                      This project is no longer accepting new members.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* â”€â”€ Right: meta sidebar â”€â”€ */}
          <div className="space-y-5">

            {/* Open Roles */}
            <Card>
              <SectionLabel>Open Roles</SectionLabel>
              {project.requiredRoles?.length ? (
                <div className="flex flex-col gap-2">
                  {project.requiredRoles.map((r) => {
                    const remaining = remainingSlotsByRole(r.role);
                    return (
                      <div
                        key={r.role}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07]"
                      >
                        <span className="text-sm text-gray-200">{r.role}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          remaining > 0
                            ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                        }`}>
                          {remaining} open
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No specific roles listed.</p>
              )}
            </Card>
            {/* Project Info */}
            <Card>
              <SectionLabel>Project Info</SectionLabel>
              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Crown size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Owner</p>
                    <p className="text-sm font-semibold text-white">
                      {project.createdBy?.fullName || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Users size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Members</p>
                    <p className="text-sm font-semibold text-white">{membersCount}</p>
                  </div>
                </div>

                {(project?.requiredRoles?.length || 0) > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Layers size={14} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Seats Available</p>
                      <p className="text-sm font-semibold text-white">
                        {(project.requiredRoles || []).reduce(
                          (sum, r) => sum + remainingSlotsByRole(r.role),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Calendar size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Created</p>
                    <p className="text-sm font-semibold text-white">
                      {formatDate(project.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <AlertCircle size={14} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p className="text-sm font-semibold text-white capitalize">
                      {project.status || "open"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Owner workspace shortcut */}
            {(isOwner || isMember) && (
              <button
                onClick={() => navigate(`/workspace/${project._id}`)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                  boxShadow: "0 0 24px rgba(59,130,246,0.3)",
                }}
              >
                Open Workspace 
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


