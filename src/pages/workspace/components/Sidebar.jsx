import { LayoutDashboard, CheckSquare, Users, MessageSquare } from "lucide-react";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "tasks", label: "Tasks", icon: CheckSquare },
  { key: "members", label: "Members", icon: Users },
  { key: "chat", label: "Chat", icon: MessageSquare },
];

function Sidebar({ activeTab, setActiveTab, projectName, onBack }) {
  return (
    <div
      className="fixed top-0 left-0 h-screen w-64 flex flex-col border-r border-white/6 z-40"
      style={{ background: "linear-gradient(180deg, #0f172a 0%, #0a1120 100%)" }}
    >
      {/* Logo / Back */}
      <div className="px-5 py-5 border-b border-white/6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 text-gray-500 hover:text-white transition-colors text-sm"
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
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mb-0.5">
              Workspace
            </p>
            <p className="text-sm font-bold text-white truncate leading-tight">
              {projectName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest px-3 mb-3">
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
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-gray-500 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              {/* Active indicator bar */}
              <span
                className={`w-1 h-4 rounded-full transition-all duration-200 shrink-0 ${
                  isActive ? "bg-blue-400" : "bg-transparent group-hover:bg-white/20"
                }`}
              />
              <Icon size={16} className={isActive ? "text-blue-400" : ""} />
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