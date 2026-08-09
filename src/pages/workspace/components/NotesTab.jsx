import { useState, useEffect } from "react";
import { FileText, Save, Loader } from "lucide-react";
import io from "socket.io-client";
import API from "../../../api/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function NotesTab({ projectId, currentUser }) {
  const [note, setNote] = useState({ content: "", updatedBy: null, updatedAt: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    fetchNote();

    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    const authToken = localStorage.getItem("token") || cookieToken;

    // Connect to Socket.IO with token authentication
    const newSocket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token: authToken },
    });

    newSocket.emit("join-project", projectId);

    newSocket.on("note-updated", (updatedNote) => {
      setNote(updatedNote);
    });

    setSocket(newSocket);

    return () => {
      newSocket.emit("leave-project", projectId);
      newSocket.disconnect();
    };
  }, [projectId]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/project/notes/${projectId}`);
      setNote(res.data.note || { content: "", updatedBy: null, updatedAt: null });
    } catch (err) {
      console.error("Fetch note error:", err);
      setError(err.response?.data?.error || err.message || "Failed to load note");
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      setSaving(true);
      const res = await API.put(`/project/notes/${projectId}`, { content: note.content });
      setNote(res.data.note);
    } catch (err) {
      console.error("Save note error:", err);
      setError(err.response?.data?.error || err.message || "Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (e) => {
    setNote({ ...note, content: e.target.value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-blue-400" />
          <h2 className="text-xl font-bold">Shared Notes</h2>
        </div>
        <button
          onClick={saveNote}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* Note textarea */}
      <div className="bg-gray-900/60 border border-white/6 rounded-2xl p-6">
        <textarea
          value={note.content}
          onChange={handleContentChange}
          placeholder="Start writing your shared notes here..."
          className="w-full h-96 bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed"
          style={{ minHeight: "24rem" }}
        />
      </div>

      {/* Metadata */}
      {note.updatedBy && (
        <div className="text-xs text-gray-500">
          Last updated by {note.updatedBy.fullName} on {new Date(note.updatedAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}

export default NotesTab;