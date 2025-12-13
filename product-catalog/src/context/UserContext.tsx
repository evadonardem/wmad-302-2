import { createContext, useContext, useEffect, useState } from "react";

export type Address = {
  id: number;
  label: string;
  details: string;
};

type User = {
  name: string;
  email: string;
  profilePic?: string;
  password?: string;
  addresses?: Address[];
};

type UserContextType = {
  user: User | null;
  users: User[];
  login: (user: User) => void;
  register: (user: User) => void;
  switchUser: (email: string) => void;
  logout: () => void;
  addAddress: (addr: Address) => void;
  setProfilePic: (url: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch (e) {
      return null;
    }
  });
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const raw = localStorage.getItem("users");
      return raw ? (JSON.parse(raw) as User[]) : [];
    } catch (e) {
      return [];
    }
  });

  const login = (u: User) => {
    // Ensure user is in users list
    setUsers((prev) => {
      const exists = prev.find((x) => x.email === u.email);
      if (exists) return prev;
      return [...prev, { ...u, addresses: u.addresses || [] }];
    });
    setUser(u);
  };

  const register = (u: User) => {
    setUsers((prev) => [...prev, { ...u, addresses: [] }]);
    setUser({ ...u, addresses: [] });
  };

  const switchUser = (email: string) => {
    const found = users.find((u) => u.email === email) || null;
    setUser(found);
  };
  const logout = () => {
    setUser(null);
  };

  const addAddress = (addr: Address) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.email === user?.email
          ? { ...u, addresses: [...(u.addresses || []), addr] }
          : u
      )
    );
    setUser((prev) => (prev ? { ...prev, addresses: [...(prev.addresses || []), addr] } : prev));
  };

  const setProfilePic = (url: string) => {
    setUsers((prev) => prev.map((u) => (u.email === user?.email ? { ...u, profilePic: url } : u)));
    setUser((prev) => (prev ? { ...prev, profilePic: url } : prev));
  };

  const changePassword = (oldPassword: string, newPassword: string) => {
    let success = false;
    setUser((prev) => {
      if (!prev) return prev;
      // if there's no password set, allow set
      if (!prev.password || prev.password === oldPassword) {
        success = true;
        return { ...prev, password: newPassword };
      }
      // else do not change
      return prev;
    });
    if (success && user) {
      setUsers((prev) => prev.map((u) => (u.email === user.email ? { ...u, password: newPassword } : u)));
    }
    return success;
  };

  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
      localStorage.setItem("users", JSON.stringify(users));
    } catch (e) {
      // ignore
    }
  }, [user, users]);

  return (
    <UserContext.Provider value={{ user, users, login, register, switchUser, logout, addAddress, setProfilePic, changePassword }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};
