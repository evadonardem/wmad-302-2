"use client";

import { Button } from "@mui/material";
import { useCart } from "./CartProvider.jsx";
import { useToast } from "./ToastProvider.jsx";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handle = () => {
    addToCart(product, 1);
    showToast(`${product.title} added to cart!`, "success");
  };

  return (
    <Button variant="contained" size="small" onClick={handle}>
      Add to Cart
    </Button>
  );
}
