import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Menu,
  LayoutDashboard,
  User,
  BookOpen,
  Layers,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { clearLogoutTimer } from "../utils/autoLogout";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [systemDesignOpen, setSystemDesignOpen] = useState(false);

  // load saved theme (light by default)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  useEffect(() => {
    setSystemDesignOpen(location.pathname.startsWith("/system-design"));
  }, [location.pathname]);

  // Apply theme + save to localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    clearLogoutTimer();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItemClass = (path: string) => `
    flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition
    ${
      isActive(path)
        ? "bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium"
        : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
    }
  `;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">

      {/* Sidebar */}
      <div
        className={`${collapsed ? "w-[72px]" : "w-[260px]"} 
        h-screen sticky top-0 bg-white dark:bg-slate-900
        border-r border-gray-200 dark:border-slate-700
        flex flex-col px-3 py-6 overflow-hidden
        transition-[width] duration-300 ease-in-out`}
      >

        {/* Top Section */}
        <div className="flex items-center justify-between mb-6 px-3">
          {!collapsed && (
            <h2
              onClick={() => navigate("/dashboard")}
              className="text-xl font-bold text-blue-600 cursor-pointer"
            >
              DSA Portal
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-600 dark:text-gray-300"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* User Section */}
        {!collapsed && (
          <>
            <div className="mb-4 px-3">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {name}
              </p>

              <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold">
                {role}
              </span>
            </div>

            <div className="border-b border-gray-200 dark:border-slate-700 mb-4" />
          </>
        )}

        {/* Menu Items */}
        <div className="space-y-2">

          {/* Dashboard */}
          <button
            onClick={() => navigate("/dashboard")}
            className={menuItemClass("/dashboard")}
          >
            <LayoutDashboard size={18} />
            {!collapsed && "Dashboard"}
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className={menuItemClass("/profile")}
          >
            <User size={18} />
            {!collapsed && "Profile"}
          </button>

          {/* DSA */}
          <button
            onClick={() => navigate("/dsa")}
            className={menuItemClass("/dsa")}
          >
            <BookOpen size={18} />
            {!collapsed && "DSA"}
          </button>

          {/* System Design */}
          <div>
            <button
              onClick={() => {
                if (location.pathname === "/system-design") {
                  setSystemDesignOpen(!systemDesignOpen);
                } else {
                  navigate("/system-design");
                  setSystemDesignOpen(true);
                }
              }}
              className={menuItemClass("/system-design")}
            >
              <Layers size={18} />

              {!collapsed && (
                <>
                  <span className="flex-1 text-left">
                    System Design
                  </span>

                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      systemDesignOpen ? "rotate-180" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {/* Submenu */}
            {systemDesignOpen && !collapsed && (
              <div className="ml-6 mt-1 space-y-1">

                <button
                  onClick={() => navigate("/system-design/hld")}
                  className={menuItemClass("/system-design/hld")}
                >
                  HLD
                </button>

                <button
                  onClick={() => navigate("/system-design/lld")}
                  className={menuItemClass("/system-design/lld")}
                >
                  LLD
                </button>

                <button
                  onClick={() => navigate("/system-design/oops")}
                  className={menuItemClass("/system-design/oops")}
                >
                  OOPs
                </button>

              </div>
            )}
          </div>

        </div>

        {/* Push bottom items */}
        <div className="flex-grow" />

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg 
          text-gray-600 dark:text-gray-300 
          hover:bg-blue-50 dark:hover:bg-slate-700 transition"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg 
          text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>

      </div>

      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        <div className="w-full p-10">
          <Outlet />
        </div>
      </div>

    </div>
  );
}