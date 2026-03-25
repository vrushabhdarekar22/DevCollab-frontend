import { useState } from "react";
import { Send, Smile, Paperclip, Hash, Lock } from "lucide-react";

// ── Mock conversation for visual richness ─────────────────────────────────────
const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "Alex Rivera",
    time: "10:14 AM",
    text: "Hey team 👋 I've pushed the initial boilerplate — take a look when you get a chance.",
    self: false,
  },
  {
    id: 2,
    sender: "You",
    time: "10:16 AM",
    text: "Nice! Looks clean. I'll start on the auth module today.",
    self: true,
  },
  {
    id: 3,
    sender: "Sarah Kim",
    time: "10:22 AM",
    text: "I can take the dashboard UI once the routes are set up. Should I follow the Figma file or are we going freestyle?",
    self: false,
  },
  {
    id: 4,
    sender: "Alex Rivera",
    time: "10:25 AM",
    text: "Figma file is mostly finalized — I'll share the link in a sec. Let's keep the dark theme consistent.",
    self: false,
  },
  {
    id: 5,
    sender: "You",
    time: "10:30 AM",
    text: "Sounds good. I'll have the login + register flows done by EOD.",
    self: true,
  },
];

// ── Avatar ────────────────────────────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const GRADIENTS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
];

function Avatar({ name }) {
  const idx = (name || "").charCodeAt(0) % GRADIENTS.length;
  return (
    <div
      className={`w-8 h-8 rounded-full bg-gradient-to-br ${GRADIENTS[idx]} flex-shrink-0
                  flex items-center justify-center text-[11px] font-bold text-white`}
    >
      {getInitials(name)}
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Message({ msg }) {
  return msg.self ? (
    // Self
    <div className="flex items-end justify-end gap-2.5">
      <div className="flex flex-col items-end gap-1 max-w-[72%]">
        <div
          className="px-4 py-2.5 rounded-2xl rounded-br-sm text-sm text-white leading-relaxed"
          style={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            boxShadow: "0 2px 12px rgba(59,130,246,0.25)",
          }}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-600">{msg.time}</span>
      </div>
    </div>
  ) : (
    // Other
    <div className="flex items-end gap-2.5">
      <Avatar name={msg.sender} />
      <div className="flex flex-col gap-1 max-w-[72%]">
        <span className="text-[11px] text-gray-500 font-medium px-1">
          {msg.sender}
        </span>
        <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm text-gray-200 leading-relaxed bg-gray-800/70 border border-white/6">
          {msg.text}
        </div>
        <span className="text-[10px] text-gray-600 px-1">{msg.time}</span>
      </div>
    </div>
  );
}

// ── ChatTab ───────────────────────────────────────────────────────────────────
export default function ChatTab({ projectName = "Project" }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    // No-op: UI only
    setInput("");
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Channel header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <Hash className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none">
              general
            </h2>
            <p className="text-[11px] text-gray-600 mt-0.5">{projectName}</p>
          </div>
        </div>

        {/* Coming soon badge */}
        <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-gray-800/80 border border-white/8 text-gray-500">
          <Lock className="w-3 h-3" />
          Coming Soon
        </span>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 pb-2 min-h-0">
        {/* Date divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-[10px] font-medium text-gray-600 uppercase tracking-widest">
            Today
          </span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {MOCK_MESSAGES.map((msg) => (
          <Message key={msg.id} msg={msg} />
        ))}

        {/* "Coming soon" overlay message */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 text-blue-400 text-xs font-medium"
            style={{ background: "rgba(59,130,246,0.07)" }}
          >
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Real-time messaging coming soon
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 pt-3 border-t border-white/5 mt-2">
        <div
          className="flex items-center gap-2 rounded-xl border border-white/8 px-3 py-2.5 transition-colors
                     focus-within:border-blue-500/30"
          style={{ background: "rgba(17,24,39,0.7)" }}
        >
          <button className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
            placeholder="Message #general…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled
          />

          <button className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0">
            <Smile className="w-4 h-4" />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, #2563eb, #3b82f6)"
                : "rgba(59,130,246,0.12)",
            }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-700 mt-2">
          Chat functionality is not active yet — stay tuned!
        </p>
      </div>
    </div>
  );
}