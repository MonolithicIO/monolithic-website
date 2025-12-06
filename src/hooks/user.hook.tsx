"use client";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import authEventBus from "@core/events/auth-event-bus";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@core/api/api-client";
import { ErrorResponse } from "@core/api/error-handler";
import useSWR from "swr";

interface CurrentUser {
  displayName: string;
  photoUrl: string | null;
  email: string;
  roles: string[];
}

interface UserContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  error: Error | null;
  clearUser: () => void;
  refreshUser: () => Promise<void>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

const fetcher = async (url: string): Promise<CurrentUser | null> => {
  const result = await apiClient.get<CurrentUser>(url);

  if (result instanceof ErrorResponse) {
    if (result.statusCode === 401) {
      return null;
    }
    throw result;
  }

  return result;
};

export function UserProvider({ children }: UserProviderProps) {
  const router = useRouter();

  const [hasSession, setHasSession] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("hasSession") === "true";
  });

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR<CurrentUser | null, Error>(
    hasSession ? "/api/v1/user/me" : null, // null key prevents SWR from fetching
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      dedupingInterval: 5000,
    }
  );

  const clearUser = async () => {
    await apiClient.delete("/api/v1/auth/logout");
    mutate(null, false);
    localStorage.removeItem("user");
    localStorage.removeItem("hasSession");
    setHasSession(false);
  };

  const refreshUser = async () => {
    if (!hasSession) {
      setHasSession(true);
    }
    await mutate();
  };

  const value: UserContextValue = {
    user: user ?? null,
    isLoading: hasSession ? isLoading : false,
    error: error ?? null,
    clearUser,
    refreshUser,
  };

  useEffect(() => {
    const handleAuthRefreshFailed = () => {
      mutate(null, false);
      localStorage.removeItem("user");
      localStorage.removeItem("hasSession");
      setHasSession(false);
      toast.error("Your session has expired. Please sign in again.");
      router.push("/");
    };

    const unsubscribe = authEventBus.on("auth:refresh-failed", handleAuthRefreshFailed);

    return () => {
      unsubscribe();
    };
  }, [router, mutate]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
