import { LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../api/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await API.post("/user/logout");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      alert(err.response?.data?.message || "Could not logout.");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full bg-gray-950/80 backdrop-blur-sm text-white border-b border-white/8 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">

      {/* LEFT: Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/projects")}
      >
        <span className="text-blue-500 text-xl">⬡</span>
        <span className="text-lg font-bold tracking-tight">DevCollab</span>
      </div>

      {/* RIGHT: Nav links + actions */}
      <div className="flex items-center gap-1">

        {/* Explore */}
        <button
          onClick={() => navigate("/projects")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive("/projects")
              ? "bg-blue-500/15 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Explore
        </button>

        {/* My Projects */}
        <button
          onClick={() => navigate("/my-projects")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive("/my-projects")
              ? "bg-blue-500/15 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          My Projects
        </button>

        <button
          onClick={() => navigate("/requests")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive("/requests")
              ? "bg-blue-500/15 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Requests
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10 mx-2" />

        {/* Profile Avatar */}
        <button
          onClick={() => navigate("/profile")}
          className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-blue-500/40"
          style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)" }}
          title="My Profile"
        >
          <User size={16} />
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ml-1"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}

export default Navbar;