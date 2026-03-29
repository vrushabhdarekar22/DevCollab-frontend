import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/ToastProvider";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import "./index.css";
import Landing from "./pages/Landing";
import Explore from "./pages/projects/Explore";
import Profile from "./pages/profile/Profile";
import MyProjects from "./pages/projects/MyProjects";
import Requests from "./pages/projects/Requests";
import Workspace from "./pages/workspace/Workspace";
import ViewProject from "./pages/projects/ViewProject";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
        {/* Default Redirect */}

        <Route path="/" element={<Landing />} />
        <Route path="/projects" element={<Explore />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/requests" element={<Requests />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Workspace routes */}
        <Route path="/workspace/:projectId" element={<Workspace />} />
        <Route path="/projects/view-project/:projectId" element={<ViewProject />} />
      </Routes>
    </BrowserRouter>
  </ToastProvider>
  );
}

export default App;