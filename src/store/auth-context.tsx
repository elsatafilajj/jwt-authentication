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
  userRole: userRoleType | null;
  loading: boolean;
};

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("accessToken");

    if (storedAuth) {
      try {
        const decoded = jwtDecode(storedAuth) as decodedToken;
        setIsAuthenticated(true);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Invalid token: ", error);
        setIsAuthenticated(false);
        setUserRole(null);
      }

      setLoading(false);
    }
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, userRole, loading }}
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
