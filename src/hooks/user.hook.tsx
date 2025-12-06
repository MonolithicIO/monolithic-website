"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import authEventBus from "@core/events/auth-event-bus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@core/api/api-client";
import { ErrorResponse } from "@core/api/error-handler";

interface CurrentUser {
  displayName: string;
  photoUrl: string | null;
  email: string;
  roles: string[];
}

interface UserContextValue {
  user: CurrentUser | null;
  clearUser: () => void;
  refreshUser: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<CurrentUser | null>(() => {
    const user = localStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  });

  const router = useRouter();

  const clearUser = async () => {
    apiClient.delete("/api/v1/auth/logout");

    localStorage.removeItem("user");
    localStorage.removeItem("hasSession");
    setUser(null);
  };

  const refreshUser = async () => {
    const result = await apiClient.get<CurrentUser>("/api/v1/user/me");
    if (result instanceof ErrorResponse) {
      throw result;
    }
    setUser(result);
    localStorage.setItem("user", JSON.stringify(result));
    localStorage.setItem("hasSession", "true");
  };

  const value: UserContextValue = {
    user: user ?? null,
    clearUser,
    refreshUser,
  };

  useEffect(() => {
    const handleAuthRefreshFailed = () => {
      localStorage.removeItem("user");
      toast.error("Your session has expired. Please sign in again.");
      router.push("/");
    };

    const unsubscribe = authEventBus.on("auth:refresh-failed", handleAuthRefreshFailed);

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
