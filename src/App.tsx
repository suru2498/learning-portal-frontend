import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./layouts/AppLayout";
import DSACategoryPage from "./pages/DSATopics";
import DSAPage from "./pages/DSA";
import SystemDesignPage from "./pages/SystemDesign";
import SystemDesignTopicPage from "./pages/SystemDesignTopics";
import HLDTheoryPage from "./pages/HLDPage";
import LLDTheoryPage from "./pages/LLDPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* DSA Routes */}
          <Route path="/dsa" element={<DSACategoryPage />} />
          <Route path="/dsa/:topicSlug" element={<DSAPage />} />

          {/* System Design Routes */}
          <Route path="/system-design" element={<SystemDesignPage />} />
          <Route path="/system-design/:type" element={<SystemDesignTopicPage />} />
          <Route
          path="/system-design/:type/:topicSlug"
          element={<HLDTheoryPage />}
        />
        <Route
          path="/system-design/:type/:topicSlug"
          element={<LLDTheoryPage />}
        />
        </Route>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;