import { createContext, ReactNode, useContext, useState } from "react";

interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

type AuthContextType = {
  login: (user: User) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => {
    // You can perform actual login logic here
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider value={{ login, isAuthenticated }}>
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
