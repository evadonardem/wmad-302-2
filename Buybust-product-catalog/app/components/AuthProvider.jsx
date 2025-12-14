"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // sends JWT cookie
        });

        const data = await res.json();
        setUser(data.user || null);
      } catch (err) {
        console.error("AUTH LOAD ERROR:", err);
        setUser(null);
      }
    }

    loadUser();
  }, []);

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
