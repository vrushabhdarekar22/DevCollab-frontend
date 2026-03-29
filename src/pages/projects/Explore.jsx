import { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { Plus, Search } from "lucide-react";
import CreateProjectModal from "../../components/project/CreateProjectModal";
import API from "../../api/api"

function Explore() {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  //  Fetch projects
  const fetchProjects = async () => {
    try {
      const res = await API.get("/project/explore");
      console.log("Success", res.data);
      setProjects(res.data.projects);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  //  Filter projects
  const filteredProjects = projects.filter((p) => {
    const title = p.title || "";
    const term = search || "";
    return title.toLowerCase().includes(term.toLowerCase());
  });



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

      {/* Page header + search */}
      <div className="relative z-10 px-6 pt-10 pb-8 border-b border-white/6">
        <div className="max-w-7xl mx-auto">

          {/* Title */}
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-2">
            Discover
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">
            Explore Projects
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Find projects to collaborate on or create your own.
          </p>

          {/* Search bar */}
          <div className="flex items-center gap-3 bg-gray-900/80 border border-white/8 px-4 py-3 rounded-xl max-w-lg focus-within:border-blue-500/40 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all duration-200">
            <Search size={16} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Search by project name or tech stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-600"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Project grid */}
      <div className="relative z-10 px-6 py-8 max-w-7xl mx-auto">

        {/* Result count */}
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-5 font-medium">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? "s" : ""} found
        </p>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="group relative bg-gray-900/60 border border-white/6 rounded-2xl p-5 hover:border-blue-500/30 transition-all duration-300 hover:bg-gray-900/80 flex flex-col"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.06) 0%, transparent 70%)",
                  }}
                />

                {/* Title */}
                <h3 className="text-base font-bold mb-3 text-white">
                  {project.title}
                </h3>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack?.map((tech, i) => (
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

                {/* Button */}
                <button
                  onClick={() => navigate(`/projects/view-project/${project._id}`)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.2)",
                  }}
                >
                  View Project →
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No projects found</h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Try searching with a different keyword or tech stack.
            </p>
            <button
              onClick={() => setSearch("")}
              className="mt-5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Floating create button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #2563eb, #3b82f6)",
          boxShadow: "0 0 30px rgba(59,130,246,0.45)",
        }}
      >
        <Plus size={18} />
        New Project
      </button>

      {/* Modal */}
      {showModal && <CreateProjectModal onClose={() => setShowModal(false)} onProjectCreated={fetchProjects} />}
    </div>
  );
}

export default Explore;