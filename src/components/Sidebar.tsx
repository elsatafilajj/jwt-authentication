import { NavLink } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/store/auth-context";

const Sidebar = () => {
  const { logout } = useAuth();
  return (
    <aside className="h-full w-64 bg-white shadow-md px-4 py-6 flex flex-col justify-between">
      <div>
        <nav className="space-y-4">
          <NavLink
            to="/brainstorm"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-emerald-100 text-emerald-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            <BookOpen size={20} /> Brainstorm
          </NavLink>
        </nav>
      </div>
      <div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={logout}
        >
          Log out
        </Button>
      </div>
    </aside>
  );
};
export default Sidebar;
