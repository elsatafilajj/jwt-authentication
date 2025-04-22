<<<<<<< HEAD:src/components/Dashboard.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../store/auth-context";

const Dashboard = () => {
  const { user, isDataLoading } = useAuth();
=======
import React from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../api/api";

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
  });
>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/components/Dashboard.tsx

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to Your Dashboard
      </h2>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4">
        {isDataLoading ? (
          <p className="text-center text-gray-500">Loading user info...</p>
        ) : (
          <>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {user?.email}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Username:</span>{" "}
                {user?.username}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Role:</span>{" "}
                {user?.role}
              </p>
            </div>
          </>
        )}
      </div>
      <Link
        to="/stickyNotes"
        className="px-5 mt-5 py-2 rounded-full bg-green-600 hover:bg-green-700 transition duration-300 text-white"
      >
        Go to your projects
      </Link>
    </div>
  );
};

export default Dashboard;
