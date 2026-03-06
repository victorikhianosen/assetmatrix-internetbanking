"use client";

import { createContext, useContext, useState } from "react";
import { User } from "@/types/user.types";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
});

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<UserContextType["user"]>(null);

  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider
      value={{ user, setUser, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UseUser = () => useContext(UserContext);