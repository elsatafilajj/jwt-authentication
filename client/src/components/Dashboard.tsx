import React from "react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../api/api";

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to Your Dashboard
      </h2>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading user info...</p>
        ) : (
          <>
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-gray-700">Email:</span>{" "}
                {data?.email}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Username:</span>{" "}
                {data?.username}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Role:</span>{" "}
                {data?.role}
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
