import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex">
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      </main>
      <div>
        <div className="flex flex-col items-center justify-center min-h-svh">
          <Button onClick={handleLogout}>Log out</Button>
        </div>
      </div>
    </div>
  );
};
