import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { PROJECT_DATA } from "./mockData";
import Sidebar from "./components/Sidebar";
import DashboardTab from "./components/DashboardTab";
import TasksTab from "./components/TasksTab";
import MembersTab from "./components/MembersTab";
import ChatTab from "./components/ChatTab";

function Workspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const project = PROJECT_DATA[projectId];

  const [tasks, setTasks] = useState(project?.tasks || []);

  // Replace with actual logged-in user check
  const currentUser = "Vrushabh Darekar";
  const isOwner = project?.members?.find(
    (m) => m.name === currentUser && m.role === "owner"
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-4xl">🚫</p>
        <h2 className="text-xl font-bold">Project not found</h2>
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
        return <DashboardTab tasks={tasks} />;
      case "tasks":
        return (
          <TasksTab
            tasks={tasks}
            setTasks={setTasks}
            members={project.members}
            isOwner={!!isOwner}
          />
        );
      case "members":
        return <MembersTab members={project.members} />;
      case "chat":
        return <ChatTab projectName={project.name} />;
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
        projectName={project.name}
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
          <span className="text-sm font-semibold text-white">{project.name}</span>
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