import { useState } from "react";
import { X, Check } from "lucide-react";

function CreateProjectModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); // replace with API call
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 p-7 z-10"
        style={{
          background: "linear-gradient(145deg, #111827, #0f172a)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px -10px rgba(0,0,0,0.8)",
        }}
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

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 bg-white/5 hover:bg-white/10 border border-white/8 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                boxShadow: "0 0 20px rgba(59,130,246,0.3)",
              }}
            >
              <Check size={15} />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;