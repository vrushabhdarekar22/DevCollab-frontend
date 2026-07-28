import { LayoutDashboard, CheckSquare, Users, MessageSquare, FileText } from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "members", label: "Members", icon: Users },
  { key: "notes", label: "Notes", icon: FileText },
  { key: "chat", label: "Chat", icon: MessageSquare },
];

function Sidebar({ activeTab, setActiveTab, projectName, onBack }) {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r z-40"
      style={{
        background: "linear-gradient(180deg, var(--surface) 0%, var(--surface-muted) 100%)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo / Back */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 task-text-muted hover:text-blue-500 transition-colors text-sm"
        >
          <span>←</span>
          <span>My Projects</span>
        </button>

        {/* Project name */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0"
            style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
          >
            {projectName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs task-text-muted font-medium uppercase tracking-widest mb-0.5">
              Workspace
            </p>
            <p className="text-sm font-bold task-text-strong truncate leading-tight">
              {projectName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold task-text-faint uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>

        {NAV_ITEMS.map(({ key, label, icon: Icon }) => { // eslint-disable-line no-unused-vars
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-blue-500/12 text-blue-600 border border-blue-500/25"
                  : "text-gray-500 hover:text-blue-600 hover:bg-white/10 border border-transparent"
              }`}
            >
              {/* Active indicator bar */}
              <span
                className={`w-1 h-4 rounded-full transition-all duration-200 shrink-0 ${
                  isActive ? "bg-blue-500" : "bg-transparent group-hover:bg-blue-300"
                }`}
              />
              <Icon size={16} className={isActive ? "text-blue-600" : "task-text-muted"} />
              <span>{label}</span>

              {/* Chat — UI only badge */}
              {key === "chat" }
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/6">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-base">⬡</span>
          <span className="text-xs text-gray-600 font-medium">DevCollab</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
