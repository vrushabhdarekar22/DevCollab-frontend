import { CheckSquare, Clock, AlertCircle } from "lucide-react";

const TODAY = new Date().toISOString().split("T")[0];

function formatDay(dateValue) {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function priorityStyle(priority) {
  if (priority === "high") return "text-red-500 bg-red-500/12 border border-red-500/25";
  if (priority === "medium") return "text-amber-500 bg-amber-500/12 border border-amber-500/25";
  return "text-emerald-500 bg-emerald-500/12 border border-emerald-500/25";
}

function statusStyle(status) {
  if (status === "in-progress") return "text-blue-500 bg-blue-500/12 border border-blue-500/20";
  if (status === "completed") return "text-emerald-500 bg-emerald-500/12 border border-emerald-500/20";
  return "text-gray-500 bg-gray-500/12 border border-gray-500/20";
}

function statusLabel(status) {
  if (status === "in-progress") return "In Progress";
  if (status === "completed") return "Completed";
  return "To Do";
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, colorKey }) {
  const styles = {
    blue: {
      icon: "stat-icon-blue",
      value: "stat-value-blue",
    },
    yellow: {
      icon: "stat-icon-yellow",
      value: "stat-value-yellow",
    },
    red: {
      icon: "stat-icon-red",
      value: "stat-value-red",
    },
  };

  const s = styles[colorKey];

  return (
    <div className="task-card rounded-2xl border p-5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${s.icon}`}>
        {icon}
      </div>
      <p className={`text-4xl font-extrabold mb-1 ${s.value}`}>{value}</p>
      <p className="text-xs task-text-muted font-medium uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ── Mini Task Row ──────────────────────────────────────────────────────────
function MiniTaskRow({ task }) {
  const dueDateValue = formatDay(task.dueDate);
  const isOverdue = dueDateValue && dueDateValue < TODAY && task.status !== "completed";

  const assignedName =
    task.assignedTo?.fullName || task.assignedTo?.name ||
    (typeof task.assignedTo === "string" ? task.assignedTo : "Unassigned");

  return (
    <div className="task-card flex items-center justify-between gap-3 rounded-xl px-4 py-3 hover:border-blue-500/35 transition-all duration-200">
      {/* Title + assigned */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold task-text-strong truncate">{task.title}</p>
        <p className="text-xs task-text-muted mt-0.5">{assignedName}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 shrink-0">
        <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${priorityStyle(task.priority)}`}>
          {task.priority || "todo"}
        </span>
        <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${statusStyle(task.status)}`}>
          {statusLabel(task.status)}
        </span>
        <span className={`text-xs font-medium ${isOverdue ? "text-red-500" : "task-text-faint"}`}>
          {dueDateValue || "—"}
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
        <span className="ml-1 task-text-muted font-bold">({tasks.length})</span>
      </h3>

      {tasks.length === 0 ? (
        <div className="task-card flex items-center justify-center py-10 rounded-2xl">
          <p className="text-sm task-text-muted">{emptyText}</p>
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
function DashboardTab({ tasks, currentUser, isOwner }) {
  const filteredTasks = isOwner
    ? tasks
    : tasks.filter((t) => {
        if (!t.assignedTo || !currentUser?._id) return false;
        const assignedId =
          typeof t.assignedTo === "string"
            ? t.assignedTo
            : t.assignedTo?._id || t.assignedTo?.id;
        return assignedId?.toString() === currentUser._id.toString();
      });

  const total = filteredTasks.length;
  const completed = filteredTasks.filter((t) => t.status === "completed").length;
  const dueToday = filteredTasks.filter((t) => {
    const dueDay = formatDay(t.dueDate);
    return dueDay === TODAY && t.status !== "completed";
  });
  const overdue = filteredTasks.filter((t) => {
    const dueDay = formatDay(t.dueDate);
    return dueDay && dueDay < TODAY && t.status !== "completed";
  });

  const completionPct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-8">

      {/* Page heading */}
      <div>
        <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-1">
          Overview
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight task-text-strong">Dashboard</h2>
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
      <div className="task-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold task-text-strong">Overall Progress</p>
          <p className="text-sm font-bold text-blue-400">{completionPct}%</p>
        </div>
        <div className="h-2 w-full progress-track rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${completionPct}%`,
              background: "linear-gradient(90deg, #2563eb, #3b82f6)",
            }}
          />
        </div>
        <p className="text-xs task-text-muted mt-2">
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
