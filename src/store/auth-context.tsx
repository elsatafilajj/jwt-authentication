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

  useEffect(() => {
    const storedAuth = localStorage.getItem("accessToken");
    if (storedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const token = localStorage.getItem("accessToken");

  let userRole = null;

  if (token) {
    const decoded = jwtDecode(token) as decodedToken;

    // const decodedHeader = jwtDecode(token, { header: true });
    userRole = decoded.role as userRoleType;
  }

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, userRole }}>
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
