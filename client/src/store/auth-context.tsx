<<<<<<< HEAD:src/store/auth-context.tsx
import { fetchUserInfo } from "@/api/api";
=======
import React from "react";
import { fetchUserInfo } from "../api/api";
>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/store/auth-context.tsx
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
  login: (accessToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: userRoleType | null;
<<<<<<< HEAD:src/store/auth-context.tsx
  user: User;
  isDataLoading: boolean;
};

export type User = {
  username: string;
  email: string;
  password: string;
  role: string;
  accessToken: string;
  refreshToken: string;
=======
  user: UserType;
  isPending: boolean;
>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/store/auth-context.tsx
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

  const login = (accessToken: string) => {
    try {
      const decoded = jwtDecode(accessToken) as decodedToken;

      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);
      setUserRole(decoded.role);
    } catch (err) {
      console.error("Failed to decode token:", err);
      setIsAuthenticated(false);
      setUserRole(null);
    }
  };

  const logout = () => {
    setIsLoading(true);
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem("accessToken");
    setIsLoading(false);
  };

<<<<<<< HEAD:src/store/auth-context.tsx
  const { data: user, isPending: isDataLoading } = useQuery({
=======
  const { data: user, isPending } = useQuery({
>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/store/auth-context.tsx
    queryKey: ["user"],
    queryFn: fetchUserInfo,
    enabled: isAuthenticated,
  });
<<<<<<< HEAD:src/store/auth-context.tsx
=======

>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/store/auth-context.tsx
  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        userRole,
        isLoading,
        user,
<<<<<<< HEAD:src/store/auth-context.tsx
        isDataLoading,
=======
        isPending,
>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/store/auth-context.tsx
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
