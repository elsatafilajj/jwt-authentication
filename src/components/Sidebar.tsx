// components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { Home, BookOpen, Star, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="h-screen w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          🍳 Let’em Cook
        </h1>
        <nav className="space-y-4">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-amber-100 text-amber-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Home size={20} /> Dashboard
          </NavLink>

          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-amber-100 text-amber-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <BookOpen size={20} /> All Recipes
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-amber-100 text-amber-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <Star size={20} /> Favorites
          </NavLink>
        </nav>
      </div>

      <div>
        <button className="flex items-center gap-2 text-red-500 hover:text-red-600 transition">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
