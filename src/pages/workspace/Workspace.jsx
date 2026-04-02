import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import API from "../../api/api";
import Sidebar from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import TasksTab from "./components/TasksTab";
import MembersTab from "./components/MembersTab";
import ChatTab from "./components/ChatTab";

function Workspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      const tasksRes = await API.get(`/task/get-tasks`, { params: { projectId } });
      setTasks(tasksRes.data?.data || []);
    } catch (err) {
      console.error("Could not fetch tasks", err);
      setError(err.response?.data?.message || err.message || "Failed to load tasks");
    }
  };

  const fetchWorkspaceData = async () => {
    try {
      setLoading(true);

      const [profileRes, projectRes, tasksRes] = await Promise.all([
        API.get("/user/view-profile"),
        API.get(`/project/view-project/${projectId}`),
        API.get(`/task/get-tasks`, { params: { projectId } }),
      ]);

      setCurrentUser(profileRes.data);

      const proj = projectRes.data.project || projectRes.data;
      setProject(proj);
      setTasks(tasksRes.data?.data || []);

      const backendMembers = Array.isArray(proj.members) ? proj.members : [];

      const normalizedMembers = backendMembers.map((item) => {
        const user = item.user || item;
        return {
          id: user._id || user.id,
          name: user.fullName || user.name || "Unknown",
          email: user.email || "",
          role: item.role || "member",
          avatar:
            (user.fullName || user.name || "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
          skills: user.skills || [],
        };
      });

      if (proj.createdBy && !normalizedMembers.some((m) => m.id === proj.createdBy._id)) {
        normalizedMembers.unshift({
          id: proj.createdBy._id,
          name: proj.createdBy.fullName || "Owner",
          email: proj.createdBy.email || "",
          role: "owner",
          avatar: (proj.createdBy.fullName || "O").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
          skills: [],
        });
      }

      setMembers(normalizedMembers);
    } catch (err) {
      console.error("Workspace load failed", err);
      setError(err.response?.data?.message || err.message || "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchWorkspaceData();
    } else {
      setError("Invalid project ID");
      setLoading(false);
    }
  }, [projectId]);

  const isOwner =
    currentUser && project?.createdBy && currentUser._id === project.createdBy._id;
  const isMember =
    currentUser && members.some((m) => m.id?.toString() === currentUser._id?.toString());

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-400">Loading workspace...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🚫</p>
        <h2 className="text-xl font-bold">{error || "Project not found"}</h2>
        <button
          onClick={() => navigate("/my-projects")}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to My Projects
        </button>
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab tasks={tasks} currentUser={currentUser} isOwner={isOwner} />;
      case "tasks":
        return (
          <TasksTab
            tasks={tasks}
            setTasks={setTasks}
            members={members}
            isOwner={!!isOwner}
            projectId={project._id}
            onTasksChange={fetchTasks}
          />
        );
      case "members":
        return <MembersTab members={members} />;
      case "chat":
        return <ChatTab projectId={projectId} currentUser={currentUser} projectName={project.title || project.name} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projectName={project.title || project.name}
        onBack={() => navigate("/my-projects")}
      />

      {/* Main content */}
      <div className="flex-1 ml-64 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-sm border-b border-white/6 px-8 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/my-projects")}
            className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft size={16} />
            My Projects
          </button>
          <span className="text-gray-700">/</span>
          <span className="text-sm font-semibold text-white">{project.title || project.name}</span>
          <span className="text-gray-700">/</span>
          <span className="text-sm text-blue-400 capitalize">{activeTab}</span>
        </div>

        {/* Tab content */}
        <div className="p-8">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}

export default Workspace;