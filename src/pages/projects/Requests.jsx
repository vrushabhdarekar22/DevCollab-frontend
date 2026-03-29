import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import API from "../../api/api";
import { Check, X, Clock, Users, Crown } from "lucide-react";

const TABS = ["incoming", "outgoing"];

function Requests() {
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


  

  const statusStyle = (status) => {
    if (status === "accepted")
      return "bg-green-500/10 text-green-400 border border-green-500/20";
    if (status === "rejected")
      return "bg-red-500/10 text-red-400 border border-red-500/20";
    return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";
  };

  const statusIcon = (status) => {
    if (status === "accepted") return <Check size={11} />;
    if (status === "rejected") return <X size={11} />;
    return <Clock size={11} />;
  };

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

      <div className="relative z-10 px-6 py-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Collaboration
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Requests
          </h1>
          <p className="text-gray-500 text-sm">
            Manage join requests for your projects and track your own applications.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-900/60 border border-white/6 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("incoming")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "incoming"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Crown size={14} />
            Incoming
            {incomingRequests.length > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                  activeTab === "incoming"
                    ? "bg-blue-500/40"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("outgoing")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "outgoing"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={14} />
            Outgoing
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === "outgoing"
                    ? "bg-blue-500/40"
                    : "bg-white/8 text-gray-500"
              }`}
            >
              {outgoingRequests.length}
            </span>
          </button>
        </div>

        {/* ── INCOMING ── */}
        {activeTab === "incoming" && (
          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  No pending join requests for your projects right now.
                </p>
              </div>
            ) : (
              incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="group bg-gray-900/60 border border-white/6 rounded-2xl p-5 hover:border-blue-500/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Avatar */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-extrabold shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    }}
                  >
                    {req.user?.fullName
                      ? req.user.fullName
                          .split(" ")
                          .map((t) => t[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()
                      : req.user?.email?.slice(0, 2).toUpperCase() || "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-white">
                        {req.user?.fullName || req.user?.email || "Unknown"}
                      </p>
                      <span className="text-xs text-gray-600">•</span>
                      <p className="text-xs text-gray-500">{req.sentAt}</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      Wants to join{" "}
                      <span className="text-blue-400 font-semibold">
                        {req.project}
                      </span>
                    </p>
                    {req.role && (
                      <p className="text-xs text-gray-600">Role: {req.role}</p>
                    )}
                    {req.message && (
                      <p className="text-xs text-gray-600">Message: {req.message}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleReject(req.id, req.projectId, req.user?._id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/15 hover:bg-red-500/20 transition-all duration-200"
                    >
                      <X size={13} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleAccept(req.id, req.projectId, req.user?._id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
                      style={{
                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                        boxShadow: "0 0 16px rgba(59,130,246,0.25)",
                      }}
                    >
                      <Check size={13} />
                      Accept
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── OUTGOING ── */}
        {activeTab === "outgoing" && (
          <div className="space-y-4">
            {outgoingRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="text-lg font-semibold mb-2">No requests sent</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Browse the Explore page and send a join request to a project.
                </p>
              </div>
            ) : (
              outgoingRequests.map((req) => (
                <div
                  key={req.id}
                  className="group bg-gray-900/60 border border-white/6 rounded-2xl p-5 hover:border-blue-500/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Project icon */}
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-lg shrink-0">
                    📁
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white mb-1">
                      {req.project}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      {req.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded-md font-medium text-blue-300 bg-blue-500/10 border border-blue-500/15"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600">{req.sentAt}</p>
                  </div>

                  {/* Status badge */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${statusStyle(req.status)}`}
                  >
                    {statusIcon(req.status)}
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;