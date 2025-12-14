"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
  });

  const showToast = (msg) => {
    setToast({ open: true, message: msg });
  };

  const closeToast = () => {
    setToast({ open: false, message: "" });
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("buybust_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load cart:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("buybust_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [items]);

  const addToCart = (product, qty = 1) => {
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.id === product.id);
      if (idx >= 0) {
        const next = [...cur];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...cur, { ...product, quantity: qty }];
    });

    showToast(`${product.title} added to cart`);
  };

  const removeFromCart = (productId) =>
    setItems((cur) => cur.filter((i) => i.id !== productId));

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId);
    setItems((cur) => cur.map((it) => (it.id === productId ? { ...it, quantity } : it)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, it) => s + it.quantity, 0);
  const totalPrice = items.reduce((s, it) => s + it.quantity * it.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        toast,
        closeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
