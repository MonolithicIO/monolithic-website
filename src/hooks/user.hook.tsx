"use client";
import { useState, createContext, ReactNode, useContext, useEffect } from "react";
import authEventBus from "@core/events/auth-event-bus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();

  const updateUser = (user: CurrentUser) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const clearUser = async () => {
    localStorage.removeItem("user");
    fetch("api/v1/auth/logout", { method: "DELETE" });
    setUser(null);
  };

  const value: UserContextValue = {
    user,
    updateUser,
    clearUser,
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(user));
    }
  }, []);

  // Listen for auth refresh failures
  useEffect(() => {
    const handleAuthRefreshFailed = () => {
      clearUser();
      toast.error("Your session has expired. Please sign in again.");
      router.push("/");
    };

    // Subscribe to auth events
    const unsubscribe = authEventBus.on("auth:refresh-failed", handleAuthRefreshFailed);

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [router]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
