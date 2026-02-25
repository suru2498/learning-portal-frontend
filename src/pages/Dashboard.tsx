import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaLayerGroup,
  FaServer
} from "react-icons/fa";

interface DashboardProps {
  theme: string;
  setTheme: (theme: string) => void;
}

export default function Dashboard({ theme, setTheme }: DashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const dsaTopics = [
    "Arrays",
    "Linked List",
    "Stack",
    "Queue",
    "Binary Tree",
    "Graph"
  ];

  const systemDesignTopics = [
    "System Design Basics",
    "Load Balancer",
    "Caching",
    "Microservices"
  ];

  return (
    <div
      className="
        flex min-h-screen transition-colors duration-500
        bg-gradient-to-br
        from-gray-100 via-gray-200 to-gray-300
        dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950
        text-black dark:text-white
      "
    >
      {/* Sidebar */}
      <div
        className={`
          ${isOpen ? "w-64" : "w-0"}
          backdrop-blur-xl
          border-r
          transition-all duration-300 overflow-hidden
          bg-white/70 dark:bg-white/10
          border-gray-300 dark:border-white/20
        `}
      >
        <div className="p-6">

          <h2 className="text-2xl font-bold mb-8 text-blue-500 dark:text-blue-300">
            DSA Portal
          </h2>

          <ul className="space-y-4">
            <li
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-300 transition"
            >
              Dashboard
            </li>

            <li className="cursor-pointer hover:text-blue-500 dark:hover:text-blue-300 transition">
              Profile
            </li>

            <li
              onClick={handleLogout}
              className="cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition"
            >
              Logout
            </li>
          </ul>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex-1 p-6 md:p-10">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-10">

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          <h1 className="text-3xl md:text-4xl font-bold tracking-wide">
            Learning Dashboard 🚀
          </h1>

          {/* 🌙 Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="
              px-4 py-2 rounded-xl
              bg-gray-300 dark:bg-white/10
              hover:scale-105 transition
            "
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>

        {/* DSA Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-300 flex items-center gap-2">
            <FaLayerGroup /> Data Structures
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dsaTopics.map((topic, index) => {
              const isActive = location.pathname === `/topic/${topic}`;

              return (
                <div
                  key={index}
                  onClick={() => navigate(`/topic/${topic}`)}
                  className={`
                    p-6 rounded-2xl cursor-pointer shadow-xl transition-all duration-300
                    ${isActive
                      ? "bg-blue-500/40 border border-blue-400 scale-105"
                      : "bg-blue-200/50 dark:bg-blue-400/15 border border-blue-300/40 dark:border-blue-300/30 hover:bg-blue-300/60 dark:hover:bg-blue-400/25 hover:-translate-y-1"
                    }
                  `}
                >
                  {topic}
                </div>
              );
            })}
          </div>
        </div>

        {/* System Design Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-purple-500 dark:text-purple-300 flex items-center gap-2">
            <FaServer /> System Design
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemDesignTopics.map((topic, index) => {
              const isActive = location.pathname === `/topic/${topic}`;

              return (
                <div
                  key={index}
                  onClick={() => navigate(`/topic/${topic}`)}
                  className={`
                    p-6 rounded-2xl cursor-pointer shadow-xl transition-all duration-300
                    ${isActive
                      ? "bg-purple-500/40 border border-purple-400 scale-105"
                      : "bg-purple-200/50 dark:bg-purple-400/15 border border-purple-300/40 dark:border-purple-300/30 hover:bg-purple-300/60 dark:hover:bg-purple-400/25 hover:-translate-y-1"
                    }
                  `}
                >
                  {topic}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}