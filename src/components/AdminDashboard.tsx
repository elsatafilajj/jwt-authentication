import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/api";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    data: admin,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      </main>
      <div>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <Button onClick={handleLogout}>Log out</Button>
        </div>
      </div>
      {!isPending && (
        <div>
          <div className="rounded-full bg-amber-500 text-sm leading-loose font-extralight text-center">
            {admin && admin.role.toUpperCase()}
          </div>
          <h2>Username: {admin.username}</h2>
        </div>
      )}
    </div>
  );
};
export default AdminDashboard;
