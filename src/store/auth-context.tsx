import { fetchUserInfo } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type userRoleType = "admin" | "user";
type AuthContextType = {
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: userRoleType | null;
  user: UserType;
  isPending: boolean;
};

export interface UserType {
  username: string;
  email: string;
  password: string;
  accessToken: string;
}

interface decodedToken {
  userId: string;
  role: userRoleType;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<userRoleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("accessToken");

    if (storedAuth) {
      try {
        const decoded = jwtDecode(storedAuth) as decodedToken;
        setIsAuthenticated(true);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }

    setIsLoading(false);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsLoading(true);
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("accessToken");
    setIsLoading(false);
  };

  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
    enabled: isAuthenticated,
  });

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        userRole,
        isLoading,
        user,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
