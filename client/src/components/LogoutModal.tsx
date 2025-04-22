import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { useAuth } from "../store/auth-context";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const LogoutModal = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="bg-green-600 hover:bg-green-700 p-2 rounded-2xl text-white text-sm">
        Logout
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-green-700">No</AlertDialogCancel>
          <AlertDialogAction
            className="bg-green-600 hover:bg-green-700"
            onClick={handleLogout}
          >
            Yes, I'm sure
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutModal;
