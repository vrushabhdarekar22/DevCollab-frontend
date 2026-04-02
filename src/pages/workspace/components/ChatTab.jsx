import { useState, useEffect, useRef } from "react";
import { Send, Smile, Paperclip, Hash, ChevronDown, Circle } from "lucide-react";
import { io } from "socket.io-client";
import API from "../../../api/api";

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_PALETTES = [
  { bg: "from-violet-500 via-purple-500 to-indigo-600", ring: "ring-violet-400/30" },
  { bg: "from-emerald-400 via-teal-500 to-cyan-600",   ring: "ring-teal-400/30"   },
  { bg: "from-amber-400 via-orange-500 to-rose-500",   ring: "ring-orange-400/30" },
  { bg: "from-pink-500 via-rose-500 to-red-500",       ring: "ring-rose-400/30"   },
  { bg: "from-blue-500 via-sky-500 to-cyan-500",       ring: "ring-sky-400/30"    },
];

function Avatar({ name, size = "md" }) {
  const idx = (name || "").charCodeAt(0) % AVATAR_PALETTES.length;
  const palette = AVATAR_PALETTES[idx];
  const dim = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-[11px]";
  return (
    <div
      className={`${dim} rounded-full bg-gradient-to-br ${palette.bg}
                  ring-2 ${palette.ring} flex-shrink-0
                  flex items-center justify-center font-bold text-white shadow-lg`}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Timestamp formatter ───────────────────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Typing indicator ──────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Message({ msg, showAvatar, isFirst }) {
  const isSelf = msg.self;

  if (isSelf) {
    return (
      <div className={`flex items-end justify-end gap-2 ${isFirst ? "mt-3" : "mt-0.5"}`}>
        <div className="flex flex-col items-end gap-0.5 max-w-[68%]">
          {showAvatar && (
            <span className="text-[10px] text-gray-500 font-medium mr-1 mb-0.5">You</span>
          )}
          <div
            className="relative px-4 py-2.5 rounded-2xl rounded-br-[4px] text-sm text-white leading-relaxed
                       shadow-[0_4px_20px_rgba(99,102,241,0.35)]"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
            }}
          >
            {msg.text}
            {/* Gloss overlay */}
            <div className="absolute inset-0 rounded-2xl rounded-br-[4px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          </div>
          <span className="text-[10px] text-gray-600 mr-1">{msg.time}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2.5 ${isFirst ? "mt-3" : "mt-0.5"}`}>
      {showAvatar ? (
        <Avatar name={msg.sender} />
      ) : (
        <div className="w-9 flex-shrink-0" />
      )}
      <div className="flex flex-col gap-0.5 max-w-[68%]">
        {showAvatar && (
          <span className="text-[11px] text-gray-400 font-semibold px-1 tracking-wide">
            {msg.sender}
          </span>
        )}
        <div
          className="relative px-4 py-2.5 rounded-2xl rounded-bl-[4px] text-sm leading-relaxed"
          style={{
            background: "rgba(30, 32, 44, 0.85)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#e2e4ef",
            backdropFilter: "blur(12px)",
          }}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-600 px-1">{msg.time}</span>
      </div>
    </div>
  );
}

// ── Date divider ──────────────────────────────────────────────────────────────
function DateDivider({ label }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06))" }} />
      <span
        className="text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1 rounded-full"
        style={{
          color: "#6b7280",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.06))" }} />
    </div>
  );
}

// ── Group consecutive messages by sender ─────────────────────────────────────
function groupMessages(messages) {
  return messages.map((msg, i) => {
    const prev = messages[i - 1];
    const sameGroup =
      prev &&
      prev.sender === msg.sender &&
      msg.timestamp - prev.timestamp < 5 * 60 * 1000;
    return { ...msg, showAvatar: !sameGroup, isFirst: !sameGroup };
  });
}

// ── ChatTab ───────────────────────────────────────────────────────────────────
export default function ChatTab({
  projectId,
  currentUser,
  projectName = "Project",
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Scroll management ─────────────────────────────────────────────────────
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
    setUnreadCount(0);
    setIsAtBottom(true);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom);
    if (atBottom) setUnreadCount(0);
  };

  useEffect(() => {
    if (isAtBottom) scrollToBottom();
    else setUnreadCount((c) => c + 1);
  }, [messages]);

  // ── Socket & fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!projectId || !currentUser) return;

    const newSocket = io("http://localhost:8000", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("joinProject", projectId);
    });

    newSocket.on("newMessage", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          id: message.id,
          sender: message.sender,
          senderName: message.senderName || currentUser.fullName || "Unknown",
          text: message.text,
          timestamp: new Date(message.timestamp),
        },
      ]);
    });

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/project/messages/${projectId}`);
        setMessages(
          res.data.messages.map((msg) => ({
            id: msg._id,
            sender: msg.sender._id,
            senderName: msg.sender.fullName,
            senderImage: msg.sender.profileImage,
            text: msg.text,
            timestamp: new Date(msg.timestamp),
          }))
        );
        setTimeout(() => scrollToBottom(false), 0);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
    return () => newSocket.disconnect();
  }, [projectId, currentUser]);

  // ── Send ──────────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!input.trim() || !socket) return;
    socket.emit("sendMessage", { projectId, text: input.trim() });
    setInput("");
    inputRef.current?.focus();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  const grouped = groupMessages(
    messages.map((msg) => ({
      ...msg,
      sender: msg.sender === (currentUser._id || currentUser.id)
        ? msg.sender
        : msg.senderName || msg.sender,
      self: msg.sender === (currentUser._id || currentUser.id),
      time: formatTime(msg.timestamp),
    }))
  );

  return (
    <div
      className="flex flex-col h-full min-h-0 select-none"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-1 pb-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          {/* Channel icon */}
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
              border: "1px solid rgba(99,102,241,0.25)",
              boxShadow: "0 0 16px rgba(99,102,241,0.12)",
            }}
          >
            <Hash className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-[13px] font-bold text-white tracking-tight">general</h2>
              <span className="text-[10px] text-gray-600">·</span>
              <span className="text-[11px] text-gray-500">{projectName}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Circle className="w-1.5 h-1.5 fill-emerald-400 text-emerald-400" />
              <span className="text-[10px] text-emerald-500 font-medium">Active now</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto flex flex-col min-h-0 px-1 pb-2"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.08) transparent",
        }}
      >
        <DateDivider label="Today" />

        {grouped.map((msg) => (
          <Message
            key={msg.id}
            msg={msg}
            showAvatar={msg.showAvatar}
            isFirst={msg.isFirst}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Scroll-to-bottom pill ── */}
      {!isAtBottom && (
        <div className="relative flex justify-center flex-shrink-0">
          <button
            onClick={() => scrollToBottom()}
            className="absolute -top-12 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                       text-white transition-all hover:scale-105 active:scale-95 shadow-lg z-10"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
            }}
          >
            {unreadCount > 0 && (
              <span
                className="min-w-[18px] h-[18px] rounded-full text-[10px] font-bold
                           flex items-center justify-center bg-white text-violet-600 px-1"
              >
                {unreadCount}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── Input ── */}
      <div className="flex-shrink-0 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div
          className="flex items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-200
                     focus-within:shadow-[0_0_0_1.5px_rgba(99,102,241,0.4),0_4px_24px_rgba(99,102,241,0.12)]"
          style={{
            background: "rgba(20, 22, 34, 0.9)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Attachment */}
          <button
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400
                       hover:bg-white/5 transition-all duration-150 flex-shrink-0"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none leading-relaxed"
            placeholder="Message #general…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Emoji */}
          <button
            className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400
                       hover:bg-white/5 transition-all duration-150 flex-shrink-0"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                       transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed
                       hover:scale-105 active:scale-95"
            style={
              input.trim()
                ? {
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "0 2px 12px rgba(99,102,241,0.45)",
                  }
                : { background: "rgba(99,102,241,0.1)" }
            }
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Hint */}
        <p className="text-center text-[10px] text-gray-700 mt-2">
          Press <kbd className="font-mono text-gray-600">Enter</kbd> to send · <kbd className="font-mono text-gray-600">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}