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
  X
} from "lucide-react";
import { clearLogoutTimer } from "../utils/autoLogout";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [systemDesignOpen, setSystemDesignOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  useEffect(() => {
    setSystemDesignOpen(location.pathname.startsWith("/system-design"));
  }, [location.pathname]);

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
    ${isActive(path)
      ? "bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium"
      : "text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
    }
  `;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
  fixed md:static z-50 top-0 left-0 h-screen overflow-hidden
  ${collapsed ? "md:w-[72px]" : "md:w-[260px]"}
  w-[260px]
  bg-white dark:bg-slate-900
  border-r border-gray-200 dark:border-slate-700
  transform transition-all duration-300
  ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0
`}
      >

        <div className="flex flex-col h-full px-3 py-6">

          {/* Top Section */}
          <div>

            {/* Logo */}
            <div className="flex items-center justify-between mb-6 px-3">
              {!collapsed && (
                <h2
                  onClick={() => navigate("/dashboard")}
                  className="text-xl font-bold text-blue-600 cursor-pointer"
                >
                  DSA Portal
                </h2>
              )}

              <div className="flex gap-2">

                {/* Mobile Close */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="md:hidden"
                >
                  <X size={22} />
                </button>

                {/* Collapse Desktop */}
                <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="hidden md:block text-gray-600 dark:text-gray-300"
                >
                  <Menu size={22} />
                </button>

              </div>
            </div>

            {/* User */}
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

          </div>

          {/* Menu */}
          <div className="space-y-2">

            <button
              onClick={() => {
                navigate("/dashboard");
                setMobileOpen(false);
              }}
              className={menuItemClass("/dashboard")}
            >
              <LayoutDashboard size={18} />
              {!collapsed && "Dashboard"}
            </button>

            <button
              onClick={() => {
                navigate("/profile");
                setMobileOpen(false);
              }}
              className={menuItemClass("/profile")}
            >
              <User size={18} />
              {!collapsed && "Profile"}
            </button>

            <button
              onClick={() => {
                navigate("/dsa");
                setMobileOpen(false);
              }}
              className={menuItemClass("/dsa")}
            >
              <BookOpen size={18} />
              {!collapsed && "DSA"}
            </button>

            {/* System Design */}
            <div>

              <div className={menuItemClass("/system-design")}>

                {/* LEFT SIDE (NAVIGATE) */}
                <button
                  onClick={() => {
                    navigate("/system-design");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <Layers size={18} />
                  {!collapsed && "System Design"}
                </button>

                {/* RIGHT SIDE (TOGGLE) */}
                {!collapsed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSystemDesignOpen((prev) => !prev);
                    }}
                  >
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${systemDesignOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                )}

              </div>

              {/* Submenu */}
              {systemDesignOpen && !collapsed && (
                <div className="ml-6 mt-1 space-y-1">

                  <button
                    onClick={() => {
                      navigate("/system-design/hld");
                      setMobileOpen(false);
                    }}
                    className={menuItemClass("/system-design/hld")}
                  >
                    HLD
                  </button>

                  <button
                    onClick={() => {
                      navigate("/system-design/lld");
                      setMobileOpen(false);
                    }}
                    className={menuItemClass("/system-design/lld")}
                  >
                    LLD
                  </button>

                  <button
                    onClick={() => {
                      navigate("/system-design/oops");
                      setMobileOpen(false);
                    }}
                    className={menuItemClass("/system-design/oops")}
                  >
                    OOPs
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Bottom Section */}
          <div className="space-y-2">

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg 
              text-gray-600 dark:text-gray-300 
              hover:bg-blue-50 dark:hover:bg-slate-700 transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {!collapsed && (darkMode ? "Light Mode" : "Dark Mode")}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg 
              text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
            >
              <LogOut size={18} />
              {!collapsed && "Logout"}
            </button>

          </div>

        </div>

      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white dark:bg-slate-900">
          <button onClick={() => setMobileOpen(true)}>
            <Menu size={24} />
          </button>

          <h2
            onClick={() => navigate("/dashboard")}
            className="font-bold text-blue-600 cursor-pointer"
          >
            DSA Portal
          </h2>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}