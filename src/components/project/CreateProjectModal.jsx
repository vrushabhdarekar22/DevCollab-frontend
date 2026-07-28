import { useState } from "react";
import { X, Check } from "lucide-react";
import API from "../../api/api"
import { useToast } from "../ui/ToastProvider";

function CreateProjectModal({ onClose, onProjectCreated }) {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    roleSelection: "",
    roleCount: "",
    requiredRoles: [],
  });

  const [loading, setLoading] = useState(false); // ✅ added

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ start loading

    try {
      // ✅ convert techStack string → array
      const payload = {
        ...form,
        techStack: form.techStack
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
        requiredRoles: form.requiredRoles,
      };

      const res = await API.post('/project/create-project', payload);

      console.log(res.data);
      addToast("Project created successfully", "success");

      // ✅ refresh explore page
      if (onProjectCreated) {
        onProjectCreated();
      }

      onClose();

    } catch (err) {
      console.log(err.response?.data || err.message);
      const message = err.response?.data?.message || "Failed to create project";
      addToast(message, "error");
      alert(message);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-lg rounded-2xl border p-7 z-10 project-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Project</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Fill in the details to post your project
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. AI Chat App"
              required
              className="w-full bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Briefly describe what your project does..."
              rows={3}
              required
              className="w-full bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200 resize-none"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Tech Stack
              <span className="normal-case text-gray-600 font-normal ml-2">
                (comma separated)
              </span>
            </label>
            <input
              type="text"
              name="techStack"
              value={form.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB..."
              required
              className="w-full bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
            />
          </div>

          {/* Team Requirements */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Team Requirements
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Role
                  </label>
                  <select
                    name="roleSelection"
                    value={form.roleSelection}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  >
                    <option value="" className="text-gray-700">Select a role</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                  
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Headcount
                  </label>
                  <input
                    type="number"
                    name="roleCount"
                    value={form.roleCount}
                    onChange={handleChange}
                    placeholder="Enter number of teammates"
                    min="1"
                    className="w-full bg-gray-900 border border-white/10 text-white placeholder-gray-600 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const count = Number(form.roleCount);
                  if (!form.roleSelection || !count || count <= 0) return;
                  setForm((prev) => {
                    const filtered = prev.requiredRoles.filter((r) => r.role !== prev.roleSelection);
                    return {
                      ...prev,
                      requiredRoles: [...filtered, { role: prev.roleSelection, count }],
                      roleSelection: "",
                      roleCount: "",
                    };
                  });
                }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 bg-white/5 hover:bg-white/10 border border-white/10"
              >
                Add Role
              </button>

              {form.requiredRoles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.requiredRoles.map((r) => (
                    <span
                      key={r.role}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-200"
                    >
                      {r.role} &middot; {r.count}
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            requiredRoles: prev.requiredRoles.filter((item) => item.role !== r.role),
                          }))
                        }
                        className="text-blue-200/70 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading} // ✅ added
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 hover:bg-white/10 border border-white/8 transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading} // ✅ added
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                boxShadow: "0 0 20px rgba(59,130,246,0.3)",
              }}
            >
              <Check size={15} />
              {loading ? "Creating..." : "Create Project"} {/* ✅ added */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;
