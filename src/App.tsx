import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./layouts/AppLayout";
import DSACategoryPage from "./pages/DSATopicPage";
import DSAPage from "./pages/DSAPage";
import SystemDesignPage from "./pages/SystemDesignPage";
import SystemDesignTopicPage from "./pages/SystemDesignTopicPage";
import HLDTheoryPage from "./pages/HLDTheoryPage";

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
        </Route>

        <Route 
  path="/system-design/hld/:topicSlug" 
  element={<HLDTheoryPage />} 
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;