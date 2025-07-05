import  { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "staff";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem("auth_user");
        const token = localStorage.getItem("auth_token");

        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email === "admin@foodorder.com" && password === "admin123") {
        const userData: User = {
          id: "1",
          email: email,
          name: "Admin User",
          role: "admin",
          avatar: "https://via.placeholder.com/40",
        };

        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", "mock_token_123");

        return true;
      } else if (
        email === "manager@foodorder.com" &&
        password === "manager123"
      ) {
        const userData: User = {
          id: "2",
          email: email,
          name: "Manager User",
          role: "manager",
          avatar: "https://via.placeholder.com/40",
        };

        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_token", "mock_token_456");

        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
