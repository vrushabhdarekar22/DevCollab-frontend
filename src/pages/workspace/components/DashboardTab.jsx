import { CheckSquare, Clock, AlertCircle } from "lucide-react";
import { TODAY, priorityStyle, statusStyle, statusLabel } from "../mockData";

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, colorKey }) {
  const styles = {
    blue: {
      card: "bg-blue-500/8 border-blue-500/20",
      icon: "bg-blue-500/15 text-blue-400",
      value: "text-blue-400",
    },
    yellow: {
      card: "bg-yellow-500/8 border-yellow-500/20",
      icon: "bg-yellow-500/15 text-yellow-400",
      value: "text-yellow-400",
    },
    red: {
      card: "bg-red-500/8 border-red-500/20",
      icon: "bg-red-500/15 text-red-400",
      value: "text-red-400",
    },
  };

  const s = styles[colorKey];

  return (
    <div className={`rounded-2xl border p-5 ${s.card}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${s.icon}`}>
        {icon}
      </div>
      <p className={`text-4xl font-extrabold mb-1 ${s.value}`}>{value}</p>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ── Mini Task Row ──────────────────────────────────────────────────────────
function MiniTaskRow({ task }) {
  const isOverdue = task.dueDate < TODAY && task.status !== "completed";

  return (
    <div className="flex items-center justify-between gap-3 bg-gray-900/60 border border-white/6 rounded-xl px-4 py-3 hover:border-blue-500/20 transition-all duration-200">
      {/* Title + assigned */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">{task.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{task.assignedTo}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${priorityStyle(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${statusStyle(task.status)}`}>
          {statusLabel(task.status)}
        </span>
        <span className={`text-xs font-medium ${isOverdue ? "text-red-400" : "text-gray-600"}`}>
          {task.dueDate}
        </span>
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
function Section({ label, icon, color, tasks, emptyText }) {
  return (
    <div>
      <h3 className={`text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2 ${color}`}>
        {icon}
        {label}
        <span className="ml-1 text-gray-700 font-bold">({tasks.length})</span>
      </h3>

      {tasks.length === 0 ? (
        <div className="flex items-center justify-center py-10 rounded-2xl border border-white/5 bg-gray-900/30">
          <p className="text-sm text-gray-600">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <MiniTaskRow key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── DashboardTab ───────────────────────────────────────────────────────────
function DashboardTab({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const dueToday = tasks.filter(
    (t) => t.dueDate === TODAY && t.status !== "completed"
  );
  const overdue = tasks.filter(
    (t) => t.dueDate < TODAY && t.status !== "completed"
  );

  const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-8">

      {/* Page heading */}
      <div>
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">
          Overview
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight">Dashboard</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Tasks"
          value={total}
          icon={<CheckSquare size={18} />}
          colorKey="blue"
        />
        <StatCard
          label="Due Today"
          value={dueToday.length}
          icon={<Clock size={18} />}
          colorKey="yellow"
        />
        <StatCard
          label="Overdue"
          value={overdue.length}
          icon={<AlertCircle size={18} />}
          colorKey="red"
        />
      </div>

      {/* Progress bar */}
      <div className="bg-gray-900/60 border border-white/6 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-white">Overall Progress</p>
          <p className="text-sm font-bold text-blue-400">{completionPct}%</p>
        </div>
        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${completionPct}%`,
              background: "linear-gradient(90deg, #2563eb, #3b82f6)",
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          {completed} of {total} tasks completed
        </p>
      </div>

      {/* Due Today section */}
      <Section
        label="Due Today"
        icon={<Clock size={13} />}
        color="text-yellow-400"
        tasks={dueToday}
        emptyText="Nothing due today 🎉"
      />

      {/* Overdue section */}
      <Section
        label="Overdue"
        icon={<AlertCircle size={13} />}
        color="text-red-400"
        tasks={overdue}
        emptyText="No overdue tasks 👏"
      />
    </div>
  );
}

export default DashboardTab;