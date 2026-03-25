import { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  Calendar,
  User,
  Flag,
  Circle,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";

// ── Priority config ──────────────────────────────────────────────────────────
const PRIORITY = {
  high: {
    label: "High",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    dot: "bg-red-400",
  },
  medium: {
    label: "Medium",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    dot: "bg-yellow-400",
  },
  low: {
    label: "Low",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
};

const STATUS = {
  todo: {
    label: "To Do",
    color: "text-gray-400",
    bg: "bg-gray-500/10 border-gray-500/20",
    icon: Circle,
  },
  "in-progress": {
    label: "In Progress",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: CheckCircle2,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function isOverdue(dateStr) {
  return new Date(dateStr) < new Date() && dateStr;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = "sm" }) {
  const colors = [
    "from-blue-500 to-blue-700",
    "from-purple-500 to-purple-700",
    "from-emerald-500 to-emerald-700",
    "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700",
  ];
  const idx = (name || "").charCodeAt(0) % colors.length;
  const sz = size === "sm" ? "w-7 h-7 text-[11px]" : "w-9 h-9 text-xs";
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center font-bold text-white flex-shrink-0`}
    >
      {getInitials(name)}
    </div>
  );
}

// ── TaskCard ─────────────────────────────────────────────────────────────────
function TaskCard({ task, isOwner, onStatusChange }) {
  const p = PRIORITY[task.priority] || PRIORITY.low;
  const s = STATUS[task.status] || STATUS.todo;
  const StatusIcon = s.icon;
  const overdue =
    task.status !== "completed" && isOverdue(task.dueDate);

  return (
    <div
      className="group relative flex flex-col gap-3 p-4 rounded-xl border border-white/6 bg-gray-900/40
                 hover:border-blue-500/25 hover:bg-gray-900/70 transition-all duration-300 overflow-hidden"
    >
      {/* hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 10% 20%, rgba(59,130,246,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <StatusIcon
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${s.color}`}
          />
          <span className="text-sm font-medium text-white leading-snug truncate">
            {task.title}
          </span>
        </div>

        {/* Priority badge */}
        <span
          className={`flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${p.bg} ${p.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
          {p.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 pl-6">
          {task.description}
        </p>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between gap-2 pl-6">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {task.assignedTo ? (
            <>
              <Avatar name={task.assignedTo} size="sm" />
              <span className="text-xs text-gray-400">{task.assignedTo}</span>
            </>
          ) : (
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <User className="w-3 h-3" /> Unassigned
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Due date */}
          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-[11px] font-medium ${
                overdue ? "text-red-400" : "text-gray-500"
              }`}
            >
              {overdue ? (
                <AlertCircle className="w-3 h-3" />
              ) : (
                <Calendar className="w-3 h-3" />
              )}
              {formatDate(task.dueDate)}
            </span>
          )}

          {/* Status selector */}
          {isOwner ? (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer
                         bg-transparent outline-none appearance-none ${s.bg} ${s.color}`}
            >
              {Object.entries(STATUS).map(([val, cfg]) => (
                <option
                  key={val}
                  value={val}
                  className="bg-gray-900 text-white"
                >
                  {cfg.label}
                </option>
              ))}
            </select>
          ) : (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${s.bg} ${s.color}`}
            >
              {s.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── CreateTaskModal ───────────────────────────────────────────────────────────
function CreateTaskModal({ members, onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    assignedTo: "",
    dueDate: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    onSubmit({ ...form, _id: Date.now().toString() });
    onClose();
  };

  const inputCls =
    "w-full bg-gray-900/60 border border-white/8 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors";
  const labelCls = "block text-xs font-medium text-gray-400 mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/8 p-6 shadow-2xl"
        style={{ background: "linear-gradient(145deg, #111827, #0f172a)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-white">Create New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Title *</label>
            <input
              className={inputCls}
              placeholder="Task title..."
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={2}
              placeholder="Optional description..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Priority</label>
              <select
                className={`${inputCls} cursor-pointer`}
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                <option value="low" className="bg-gray-900">Low</option>
                <option value="medium" className="bg-gray-900">Medium</option>
                <option value="high" className="bg-gray-900">High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={`${inputCls} cursor-pointer`}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="todo" className="bg-gray-900">To Do</option>
                <option value="in-progress" className="bg-gray-900">In Progress</option>
                <option value="completed" className="bg-gray-900">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Assign To</label>
              <select
                className={`${inputCls} cursor-pointer`}
                value={form.assignedTo}
                onChange={(e) => set("assignedTo", e.target.value)}
              >
                <option value="" className="bg-gray-900">Unassigned</option>
                {members.map((m) => (
                  <option key={m.id} value={m.name} className="bg-gray-900">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <input
                type="date"
                className={`${inputCls} [color-scheme:dark]`}
                value={form.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-white/8 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: form.title.trim()
                ? "0 0 20px rgba(59,130,246,0.3)"
                : "none",
            }}
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FilterSelect ─────────────────────────────────────────────────────────────
function FilterSelect({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-gray-900/60 border border-white/8 rounded-lg px-3 py-2 pr-8 text-sm text-gray-400
                   focus:outline-none focus:border-blue-500/40 transition-colors cursor-pointer"
      >
        <option value="" className="bg-gray-900">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-gray-900">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
    </div>
  );
}

// ── TasksTab ─────────────────────────────────────────────────────────────────
export default function TasksTab({ tasks: initialTasks = [], members = [], isOwner = false }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleCreateTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = filterStatus ? t.status === filterStatus : true;
    const matchPriority = filterPriority ? t.priority === filterPriority : true;
    return matchSearch && matchStatus && matchPriority;
  });

  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Tasks</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {counts.all} tasks · {counts.completed} completed
          </p>
        </div>
        {isOwner && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #2563eb, #3b82f6)",
              boxShadow: "0 0 20px rgba(59,130,246,0.3)",
            }}
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        )}
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          { key: "", label: "All", count: counts.all },
          { key: "todo", label: "To Do", count: counts.todo },
          { key: "in-progress", label: "In Progress", count: counts["in-progress"] },
          { key: "completed", label: "Completed", count: counts.completed },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filterStatus === key
                ? "bg-blue-500/15 border-blue-500/40 text-blue-400"
                : "bg-white/3 border-white/8 text-gray-500 hover:border-white/15 hover:text-gray-400"
            }`}
          >
            {label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                filterStatus === key ? "bg-blue-500/20" : "bg-white/5"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
          <input
            className="w-full bg-gray-900/60 border border-white/8 rounded-lg pl-9 pr-3 py-2 text-sm text-white
                       placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition-colors"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <FilterSelect
          value={filterPriority}
          onChange={setFilterPriority}
          placeholder="All Priorities"
          options={[
            { value: "high", label: "High" },
            { value: "medium", label: "Medium" },
            { value: "low", label: "Low" },
          ]}
        />
      </div>

      {/* Task list */}
      <div className="flex flex-col gap-2.5 overflow-y-auto pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-900/60 border border-white/5 flex items-center justify-center mb-3">
              <Flag className="w-5 h-5 text-gray-700" />
            </div>
            <p className="text-sm font-medium text-gray-500">No tasks found</p>
            <p className="text-xs text-gray-700 mt-1">
              {isOwner ? "Create your first task to get started." : "Check back later."}
            </p>
          </div>
        ) : (
          filtered.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isOwner={isOwner}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <CreateTaskModal
          members={members}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateTask}
        />
      )}
    </div>
  );
}