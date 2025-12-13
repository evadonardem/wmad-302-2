import { createContext, useContext, useState } from "react";

export type Notification = {
  id: number;
  message: string;
  read: boolean;
  createdAt: number;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAllRead: () => void;
};

const NotificationContext =
  createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        message,
        read: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const markAllRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification must be used inside NotificationProvider"
    );
  }
  return ctx;
}
