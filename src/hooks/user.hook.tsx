import { useState, createContext, ReactNode } from "react";

interface CurrentUser {
  displayName: string;
  photoUrl: string;
}

interface UserContextValue {
  user: CurrentUser | null;
  // eslint-disable-next-line no-unused-vars
  updateUser: (_user: CurrentUser) => void;
  clearUser: () => void;
  restoreUser: () => void;
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

  const restoreUser = () => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  };

  const value: UserContextValue = {
    user,
    updateUser,
    clearUser,
    restoreUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
