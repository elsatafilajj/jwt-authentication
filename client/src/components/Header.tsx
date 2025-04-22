import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth-context";
import LogoutModal from "./Modal";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../api/apiNotes";
import { toast } from "react-toastify";

const Header = () => {
  const { user, isLoading } = useAuth();

  const queryClient = useQueryClient();

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

  const handleCreateNewNote = () => {
    mutateAsync({
      id: "",
      position: { x: 0, y: 0 },
      title: "Untitled",
      content: "",
    });
  };

  return (
    <header className="w-full h-16 px-6 bg-white shadow-md flex items-center justify-between fixed top-0 left-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl font-semibold text-gray-800">
          <img
            src="../../../public/logo.png"
            alt="Logo"
            className="h-8 w-full"
          />
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
        <Button
          onClick={handleCreateNewNote}
          className="bg-green-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-green-700 transition"
        >
          + New
        </Button>
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
