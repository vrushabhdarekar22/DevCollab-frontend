import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { Crown, Users, ArrowRight } from "lucide-react";

function MyProjects() {
  const [activeTab, setActiveTab] = useState("owned");
  const navigate = useNavigate();

  const ownedProjects = [
    {
      id: "1",
      title: "DevCollab Platform",
      techStack: ["React", "Node", "MongoDB"],
      description: "Developer collaboration platform with task tracking and team management.",
      members: 4,
    },
    {
      id: "2",
      title: "AI Resume Analyzer",
      techStack: ["Python", "ML", "Flask"],
      description: "Analyze resumes using AI and provide actionable feedback.",
      members: 2,
    },
  ];

  const joinedProjects = [
    {
      id: "3",
      title: "E-Commerce App",
      techStack: ["MERN", "Stripe"],
      description: "Full stack ecommerce platform with payment integration.",
      members: 6,
    },
  ];

  const projects = activeTab === "owned" ? ownedProjects : joinedProjects;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <Navbar />

      <div className="relative z-10 px-6 py-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Dashboard
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            My Projects
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your projects and collaborate with your team.
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-2 mb-8 bg-gray-900/60 border border-white/6 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("owned")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "owned"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Crown size={14} />
            Owned
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === "owned" ? "bg-blue-500/40" : "bg-white/8 text-gray-500"
              }`}
            >
              {ownedProjects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("joined")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "joined"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users size={14} />
            Joined
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === "joined" ? "bg-blue-500/40" : "bg-white/8 text-gray-500"
              }`}
            >
              {joinedProjects.length}
            </span>
          </button>
        </div>

        {/* Project grid */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              {activeTab === "owned"
                ? "Create your first project and start building."
                : "Join a project from the Explore page."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-gray-900/60 border border-white/6 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 hover:bg-gray-900/80 flex flex-col"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.06) 0%, transparent 70%)",
                  }}
                />

                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${
                      activeTab === "owned"
                        ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/15"
                        : "bg-green-500/10 text-green-400 border border-green-500/15"
                    }`}
                  >
                    {activeTab === "owned" ? <Crown size={11} /> : <Users size={11} />}
                    {activeTab === "owned" ? "Owner" : "Member"}
                  </span>
                  <span className="text-xs text-gray-600 flex items-center gap-1">
                    <Users size={11} />
                    {project.members} members
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold mb-2 text-white">
                  {project.title}
                </h3>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium text-blue-300 bg-blue-500/10 border border-blue-500/15"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>

                {/* Open Workspace button */}
                <button
                  onClick={() => navigate(`/workspace/${project.id}`)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.2)",
                  }}
                >
                  Open Workspace
                  <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;