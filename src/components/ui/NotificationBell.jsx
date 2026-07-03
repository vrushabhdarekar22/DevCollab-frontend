import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import API from "../../api/api";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const socketRef = useRef(null);

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items]);

  // Fetch initial list
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await API.get("/notification");
        if (mounted) setItems(res.data.notifications || []);
      } catch (err) {
        console.error("Notifications load failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Socket listener
  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("notification", (notification) => {
      setItems((prev) => [notification, ...prev].slice(0, 100));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const markAllRead = async () => {
    try {
      await API.post("/notification/mark-all-read");
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("markAllRead failed", err);
    }
  };

  const handleClickItem = async (id, link) => {
    try {
      await API.post("/notification/mark-read", { ids: [id] });
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("markRead failed", err);
    }
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 text-gray-200 hover:border-blue-500/40 hover:text-white transition-colors bg-white/5"
        title="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-[11px] font-bold text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-[var(--surface)] shadow-2xl z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <p className="text-xs font-semibold text-gray-400">Notifications</p>
            <button
              onClick={markAllRead}
              className="text-[11px] inline-flex items-center gap-1 text-blue-500 hover:text-blue-400"
            >
              <Check size={12} />
              Mark all read
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-6 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">No notifications</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {items.map((n) => (
                <li key={n.id} className={`px-4 py-3 flex flex-col gap-1 ${n.isRead ? "opacity-70" : ""}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[var(--text)]">{n.title}</p>
                    {!n.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-xs text-[var(--muted)]">{n.message}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-gray-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleClickItem(n.id, n.link)}
                      className="text-[11px] text-blue-500 hover:text-blue-400 font-semibold"
                    >
                      Open
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
