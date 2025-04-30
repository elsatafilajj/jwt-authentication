import React from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../store/auth-context";
import LogoutModal from "../Modals/LogoutModal";

const Header = () => {
  const { user, isLoading } = useAuth();

  return (
    <header className="w-full h-16 px-6 bg-white shadow-md flex items-center justify-between sticky top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-semibold text-gray-800">
          <img src="/logo.png" alt="Logo" className="h-8 w-[100px]" />
        </Link>
      </div>

      <nav className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="text-gray-600 hover:text-black font-medium"
        >
          Rooms
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {!isLoading && user?.username && (
          <span className="text-sm text-gray-600 hidden sm:block">
            Hello,{" "}
            {user.username
              .split("")
              .map((char, index) => (index === 0 ? char.toUpperCase() : char))}
          </span>
        )}
        <LogoutModal />
      </div>
    </header>
  );
};

export default Header;
