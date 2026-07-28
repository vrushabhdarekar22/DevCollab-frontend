import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/api";
import { Check, X, Clock, Eye, ArrowRight, Inbox, Send } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

function initials(user) {
  if (user?.fullName)
    return user.fullName
      .split(" ")
      .map((t) => t[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  return (user?.email?.slice(0, 2) || "??").toUpperCase();
}

const AVATAR_COLORS = [
  { bg: "bg-blue-500/15", text: "text-blue-400" },
  { bg: "bg-violet-500/15", text: "text-violet-400" },
  { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  { bg: "bg-amber-500/15", text: "text-amber-400" },
  { bg: "bg-rose-500/15", text: "text-rose-400" },
];

function avatarColor(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function StatusBadge({ status }) {
  const map = {
    accepted: {
      label: "Accepted",
      icon: <Check size={10} strokeWidth={2.5} />,
      cls: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    rejected: {
      label: "Rejected",
      icon: <X size={10} strokeWidth={2.5} />,
      cls: "bg-red-500/10 text-red-400 border border-red-500/20",
    },
    pending: {
      label: "Pending",
      icon: <Clock size={10} strokeWidth={2.5} />,
      cls: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.cls}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
}

// ── sub-components ────────────────────────────────────────────────────────────

function IncomingCard({ req, onAccept, onReject, onViewProfile }) {
  const color = avatarColor(req.user?.fullName || req.user?.email || "");
  return (
    <div className="group bg-gray-900/50 border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] hover:bg-gray-900/70 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-semibold shrink-0 ${color.bg} ${color.text}`}
        >
          {initials(req.user)}
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0">
          {/* Name + time */}
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="text-sm font-semibold text-white leading-tight">
              {req.user?.fullName || req.user?.email || "Unknown"}
            </p>
            <span className="text-[11px] text-gray-600 shrink-0">{req.sentAt}</span>
          </div>

          {/* Project line */}
          <p className="text-xs text-gray-500 mb-3">
            Wants to join{" "}
            <span className="text-gray-300 font-medium">{req.project}</span>
            {req.role && (
              <>
                {" "}
                &middot; <span className="text-gray-500">{req.role}</span>
              </>
            )}
          </p>

          {/* Message block */}
          <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-semibold mb-1.5">
              Message
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {req.message?.trim() || "No message provided."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onAccept(req.id, req.projectId, req.user?._id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-150"
            >
              <Check size={12} strokeWidth={2.5} />
              Accept
            </button>
            <button
              onClick={() => onReject(req.id, req.projectId, req.user?._id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors duration-150"
            >
              <X size={12} strokeWidth={2.5} />
              Reject
            </button>
            <button
              onClick={() => onViewProfile(req.user?._id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:text-gray-200 transition-colors duration-150 ml-auto"
            >
              <Eye size={12} />
              View profile
              <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutgoingCard({ req }) {
  return (
    <div className="group bg-gray-900/50 border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] hover:bg-gray-900/70 transition-all duration-200 flex items-center gap-4">
      {/* Project icon */}
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-lg shrink-0">
        📁
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white mb-1.5">{req.project}</p>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {req.techStack?.map((tech, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md font-medium text-gray-400 bg-white/[0.05] border border-white/[0.07]"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-gray-600">{req.sentAt}</p>
      </div>

      {/* Status */}
      <div className="shrink-0">
        <StatusBadge status={req.status} />
      </div>
    </div>
  );
}

// ── empty states ──────────────────────────────────────────────────────────────

function EmptyIncoming() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
        <Inbox size={22} className="text-gray-600" />
      </div>
      <p className="text-sm font-semibold text-white mb-1">All caught up</p>
      <p className="text-xs text-gray-500 max-w-[220px] leading-relaxed">
        No pending join requests for your projects right now.
      </p>
    </div>
  );
}

function EmptyOutgoing() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-4">
        <Send size={20} className="text-gray-600" />
      </div>
      <p className="text-sm font-semibold text-white mb-1">No requests sent</p>
      <p className="text-xs text-gray-500 max-w-[220px] leading-relaxed">
        Browse the Explore page and send a join request to a project you like.
      </p>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

function Requests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("incoming");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/project/requests");
      setIncomingRequests(res.data.incoming || []);
      setOutgoingRequests(res.data.outgoing || []);
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId, projectId, userId) => {
    try {
      await API.post(`/project/accept-request/${projectId}/${userId}`);
      fetchRequests();
    } catch (err) {
      console.error("Accept request failed:", err);
      alert(err.response?.data?.message || "Could not accept request");
    }
  };

  const handleReject = async (requestId, projectId, userId) => {
    try {
      await API.post(`/project/reject-request/${projectId}/${userId}`);
      fetchRequests();
    } catch (err) {
      console.error("Reject request failed:", err);
      alert(err.response?.data?.message || "Could not reject request");
    }
  };

  const tabs = [
    {
      id: "incoming",
      label: "Incoming",
      icon: <Inbox size={13} />,
      count: incomingRequests.length,
      countStyle:
        incomingRequests.length > 0
          ? "bg-blue-500/20 text-blue-400"
          : "bg-white/[0.06] text-gray-500",
    },
    {
      id: "outgoing",
      label: "Outgoing",
      icon: <Send size={13} />,
      count: outgoingRequests.length,
      countStyle: "bg-white/[0.06] text-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Navbar />

      <div className="relative z-10 px-5 py-10 max-w-3xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-500 mb-2">
            Collaboration
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Requests</h1>
          <p className="text-sm text-gray-500">
            Manage join requests for your projects and track your applications.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center border-b border-white/[0.07] mb-7 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all duration-150 ${
                activeTab === tab.id
                  ? "border-blue-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${tab.countStyle}`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* ── Incoming tab ── */}
        {!loading && activeTab === "incoming" && (
          <div>
            {incomingRequests.length === 0 ? (
              <EmptyIncoming />
            ) : (
              <>
                <p className="text-[11px] uppercase tracking-widest text-gray-600 font-semibold mb-4">
                  {incomingRequests.length} pending{" "}
                  {incomingRequests.length === 1 ? "request" : "requests"}
                </p>
                <div className="space-y-3">
                  {incomingRequests.map((req) => (
                    <IncomingCard
                      key={req.id}
                      req={req}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onViewProfile={(id) => navigate(`/users/${id}`)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Outgoing tab ── */}
        {!loading && activeTab === "outgoing" && (
          <div>
            {outgoingRequests.length === 0 ? (
              <EmptyOutgoing />
            ) : (
              <>
                <p className="text-[11px] uppercase tracking-widest text-gray-600 font-semibold mb-4">
                  {outgoingRequests.length}{" "}
                  {outgoingRequests.length === 1 ? "request" : "requests"} sent
                </p>
                <div className="space-y-3">
                  {outgoingRequests.map((req) => (
                    <OutgoingCard key={req.id} req={req} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;
