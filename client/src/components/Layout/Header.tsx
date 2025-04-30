import React from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../store/auth-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../api/apiNotes";

import { ArrowRight, Info, User } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

import LogoutModal from "../Modals/LogoutModal";

const Header = () => {
  const { user, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const location = useLocation();

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
      position: { x: 700, y: 250 },
    };
    mutateAsync(newNote);
  };

  return (
    <header className="sticky w-full h-16 px-6 bg-white shadow-md flex items-center justify-between  top-0 left-0 z-50">
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
          to="/sticky-notes"
          className="text-gray-600 hover:text-black font-medium"
        >
          Notes
        </Link>
        {location.pathname === "/sticky-notes" && (
          <button
            onClick={handleClickCreateNote}
            className="bg-green-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-green-700 transition"
          >
            + New
          </button>
        )}
      </nav>

      <div className="flex items-center mr-2.5 gap-4">
        {!isLoading && user?.username ? (
          <div className="flex gap-5 items-center">
            <span className="text-sm text-gray-600 hidden sm:block">
              Hi, {user.username}
            </span>
            <Popover>
              <PopoverTrigger className="bg-slate-200 mr-1.5 rounded-full p-2.5">
                <User className="text-green-600" />
              </PopoverTrigger>
              <PopoverContent>
                <Card className="w-xs">
                  <CardHeader>
                    <CardTitle className="flex gap-3 items-center text-slate-800">
                      Profile info <Info className="text-green-600" />
                    </CardTitle>
                    <CardDescription>
                      <p>Username: {user.username}</p>
                      <p>Email: {user.email}</p>
                      <p>Role: {user.role}</p>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link className="text-sm underline" to="/profile">
                      <p className="flex gap-3 items-center text-slate-800">
                        <ArrowRight className="text-green-600" />
                        Make changes to your profile
                      </p>
                    </Link>
                  </CardFooter>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Skeleton className="w-[100px] h-[20px] rounded-full" />
        )}
        <LogoutModal />
      </div>
    </header>
  );
};

export default Header;
