"use client";
import { useState, createContext, ReactNode, useContext, useEffect } from "react";

interface CurrentUser {
  displayName: string;
  photoUrl: string | null;
}

interface UserContextValue {
  user: CurrentUser | null;
  // eslint-disable-next-line no-unused-vars
  updateUser: (_user: CurrentUser) => void;
  clearUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);

  const updateUser = (user: CurrentUser) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value: UserContextValue = {
    user,
    updateUser,
    clearUser,
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(user));
    }
  }, []);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
