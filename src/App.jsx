import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/ToastProvider";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import "./index.css";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import Landing from "./pages/Landing";
import Explore from "./pages/projects/Explore";
import Profile from "./pages/profile/Profile";
import PublicProfile from "./pages/profile/PublicProfile";
import MyProjects from "./pages/projects/MyProjects";
import Requests from "./pages/projects/Requests";
import Workspace from "./pages/workspace/Workspace";
import ViewProject from "./pages/projects/ViewProject";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Default Redirect */}

            <Route path="/" element={<Landing />} />
            <Route path="/projects" element={<Explore />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/users/:userId" element={<PublicProfile />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/requests" element={<Requests />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Workspace routes */}
            <Route path="/workspace/:projectId" element={<Workspace />} />
            <Route path="/projects/view-project/:projectId" element={<ViewProject />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
