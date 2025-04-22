<<<<<<< HEAD:src/components/AdminDashboard.tsx
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
import { Button } from "../components/ui/button";
>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/components/AdminDashboard.tsx
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "../api/api";

<<<<<<< HEAD:src/components/AdminDashboard.tsx
const Dashboard = () => {
=======
const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/components/AdminDashboard.tsx
  const { data, isLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: fetchUserInfo,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to Your AdminDashboard
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
    </div>
  );
};

export default AdminDashboard;
