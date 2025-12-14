"use client";

import AddToCartButton from "../../components/AddToCartButton";

export default function AddToCartWrapper({ product }) {
  if (!product) return null;
  return <AddToCartButton product={product} />;
}
