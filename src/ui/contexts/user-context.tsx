"use client";

import { createContext, useContext, ReactNode } from "react";

type User = {
  id: string;
  role: string;
  name: string;
} | null;

const UserContext = createContext<User>(null);

interface UserProviderProps {
  user: User;
  children: ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}