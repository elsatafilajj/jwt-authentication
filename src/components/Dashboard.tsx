import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
import { Button } from "../components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/api";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
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

            <div className="pt-4">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleLogout}
              >
                Log out
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Notes Section + Drop Zone */}
      <div className="w-full max-w-3xl mt-10 bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Notes</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-200 p-4 rounded-xl shadow-sm text-gray-800 min-h-[100px]">
            📝 Remember to upload profile image
          </div>
          <div className="bg-pink-200 p-4 rounded-xl shadow-sm text-gray-800 min-h-[100px]">
            ✅ Set up 2FA for extra security
          </div>
          <div className="bg-green-200 p-4 rounded-xl shadow-sm text-gray-800 min-h-[100px]">
            💡 New feature: bookmark recipes
          </div>
        </div>

        <div className="mt-6 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 hover:border-blue-400 transition-colors duration-300">
          <p className="text-lg font-medium">Drop your ideas or notes here</p>
          <p className="text-sm text-gray-400 mt-1"></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
