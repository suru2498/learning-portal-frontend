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
} from "lucide-react";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [systemDesignOpen, setSystemDesignOpen] = useState(false);

  useEffect(() => {
    if (location.pathname.startsWith("/system-design")) {
      setSystemDesignOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItemClass = (path: string) => `
    flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors duration-200
    ${
      isActive(path)
        ? "bg-blue-100 dark:bg-slate-700 text-blue-600 font-medium"
        : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600"
    }
  `;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Sidebar */}
      <div
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-white dark:bg-slate-900 border-r dark:border-slate-700 flex flex-col p-4 transition-all duration-300`}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between mb-8">
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

        {/* User */}
        {!collapsed && (
          <div className="mb-6 text-gray-500 dark:text-gray-400">
            Suraj Singh Kanyal
          </div>
        )}

        {/* Menu */}
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
                if (!systemDesignOpen) {
                  navigate("/system-design");
                }
                setSystemDesignOpen(!systemDesignOpen);
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

            {/* Sub Menu */}
            {systemDesignOpen && !collapsed && (
              <div className="ml-8 mt-1 space-y-1">
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
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>
        </div>

        <div className="flex-grow" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center transition-all duration-300">
        <div className="w-full max-w-6xl p-10">
          <Outlet />
        </div>
      </div>

    </div>
  );
}