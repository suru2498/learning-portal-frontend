import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItemClass = (path: string) =>
    `
    w-full text-left px-4 py-2 rounded-lg transition-all duration-200
    ${isActive(path)
      ? "bg-blue-100 dark:bg-slate-700 text-blue-600 font-medium"
      : "text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600"
    }
  `;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-900">

      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-700 flex flex-col p-6">

        {/* Logo */}
        <div className="mb-8">
          <h2
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold text-blue-600 cursor-pointer"
          >
            DSA Portal
          </h2>
        </div>

        {/* User */}
        <div className="mb-6 text-gray-500 dark:text-gray-400">
          Suraj Singh Kanyal
        </div>

        {/* Menu */}
        <div className="space-y-2">

          <button
            onClick={() => navigate("/dashboard")}
            className={menuItemClass("/dashboard")}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/profile")}
            className={menuItemClass("/profile")}
          >
            Profile
          </button>
          <button
            onClick={() => navigate("/dsa")}
            className={menuItemClass("/dsa")}
          >
            DSA Topics
          </button>

          <button
            onClick={() => navigate("/system-design")}
            className={menuItemClass("/system-design")}
          >
            System Design Topics
          </button>



          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
          >
            Logout
          </button>

        </div>

        <div className="flex-grow" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
}