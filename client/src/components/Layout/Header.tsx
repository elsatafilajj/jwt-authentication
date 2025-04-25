import React from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../store/auth-context";
import LogoutModal from "../Modals/LogoutModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../api/apiNotes";
import { toast } from "react-toastify";

const Header = () => {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();

  // const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("You created a note! 🎉");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Something went wrong!");
    },
  });

  const handleClickCreateNote = () => {
    const newNote = {
      id: "",
      title: "",
      content: "",
      position: { x: 0, y: 0 },
    };
    mutateAsync(newNote);
  };

  return (
    <header className="w-full h-16 px-6 bg-white shadow-md flex items-center justify-between fixed top-0 left-0 z-50">
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
          Boards
        </Link>
        <Link
          to="/StickyNotes"
          className="text-gray-600 hover:text-black font-medium"
        >
          Notes
        </Link>
        {location.pathname === "/StickyNotes" && (
          <button
            onClick={handleClickCreateNote}
            className="bg-green-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-green-700 transition"
          >
            + New
          </button>
        )}
      </nav>

      <div className="flex items-center gap-4">
        {!isLoading && user?.username && (
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
