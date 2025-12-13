import { createContext, useContext, useEffect, useState } from "react";
import type { Address } from "./UserContext";

export type OrderStatus = "Placed" | "Shipped" | "Delivered";

export type Order = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  date: string;
  status: OrderStatus;
  address: Address;
  paymentMethod?: "GCASH" | "MAYA" | "PAYPAL" | "COD";
  paymentReference?: string | null;
};

const OrderContext = createContext<any>(null);

export const OrderProvider = ({ children }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const placeOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  useEffect(() => {
    if (!orders.length) return;

    const ship = setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.status === "Placed" ? { ...o, status: "Shipped" } : o
        )
      );
    }, 5000);

    const deliver = setTimeout(() => {
      setOrders((prev) =>
        prev.map((o) =>
          o.status === "Shipped" ? { ...o, status: "Delivered" } : o
        )
      );
    }, 10000);

    return () => {
      clearTimeout(ship);
      clearTimeout(deliver);
    };
  }, [orders.length]);

  return (
    <OrderContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
