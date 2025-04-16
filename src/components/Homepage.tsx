import { useAuth } from "../store/auth-context";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchUserInfo } from "@/api/api";
import { Link } from "react-router-dom";

const Homepage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
          <>
            <p className="text-center text-gray-500">Loading user info...</p>
            <div className="pt-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center">
            <div className="space-y-2 ">
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
              <Link to={"/brainstorm"} className="underline">
                Go do some to brainstorming
              </Link>
            </div>

            <div className="pt-4 ">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
            <Link
              to="/stickyNotes"
              className="px-5 mt-5 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition duration-300 self-center"
            >
              Go to your projects
            </Link>
          </div>
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

export default Homepage;
