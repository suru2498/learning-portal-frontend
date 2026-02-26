import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
    { name: "Logout", action: handleLogout },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 p-6">

        {/* Logo + User */}
        <div className="mb-10">
          <h1 className="text-xl font-bold text-blue-600">
            DSA Portal
          </h1>

          <div className="mt-6">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              {name}
            </p>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-3">
          {menuItems.map((item, index) => {
            const isActive =
              item.path && location.pathname === item.path;

            return (
              <button
                key={index}
                onClick={() =>
                  item.action ? item.action() : navigate(item.path!)
                }
                className={`
                  w-full text-left px-4 py-2 rounded-lg transition
                  ${
                    isActive
                      ? "bg-blue-100 dark:bg-slate-700 font-medium"
                      : "hover:bg-gray-100 dark:hover:bg-slate-700"
                  }
                  ${
                    item.name === "Logout"
                      ? "text-red-500 hover:text-red-600"
                      : ""
                  }
                `}
              >
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <header className="flex justify-end items-center px-8 py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">

          {role === "ADMIN" && (
            <span className="mr-4 px-3 py-1 text-xs rounded-full bg-purple-600 text-white">
              ADMIN MODE
            </span>
          )}

          <button
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 hover:opacity-80 transition"
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}