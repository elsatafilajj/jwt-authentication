import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";
import { useAuth } from "@/store/auth-context";

import LogoutModal from "./Modal";

const Header = () => {
  const { user } = useAuth();
  // const navigate = useNavigate();

  return (
    <header className="w-full h-16 px-6 bg-white shadow-md flex items-center justify-between fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-semibold text-gray-800">
          <img src={logoImg} alt="Logo" className="h-8 w-full" />
        </Link>
      </div>

      <nav className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="text-gray-600 hover:text-black font-medium"
        >
          Boards
        </Link>
        <Link
          to="/StickyNotes"
          className="text-gray-600 hover:text-black font-medium"
        >
          Notes
        </Link>
        <Link
          to="/create"
          className="bg-green-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-green-700 transition"
        >
          + New
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {user?.username && (
          <span className="text-sm text-gray-600 hidden sm:block">
            Hello, {user.username}
          </span>
        )}
        <LogoutModal />
      </div>
    </header>
  );
};

export default Header;
