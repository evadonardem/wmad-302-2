import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextProps {
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: any, qty: number) => void;
  updateQuantity: (id: number, newQty: number) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextProps | null>(null);

export function CartProvider({ children }: any) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // ⭐ Load saved cart on first load
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  // ⭐ Save ANY change to cart automatically
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ADD TO CART (correct)
  const addToCart = (product: any, qty: number) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);

      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + qty }
            : p
        );
      }

      return [...prev, { ...product, quantity: qty }];
    });
  };

  // SET quantity
  const updateQuantity = (id: number, newQty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, newQty) }
          : item
      )
    );
  };

  // REMOVE item
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, cartCount, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
