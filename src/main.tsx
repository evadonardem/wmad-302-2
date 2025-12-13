import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById('root')!).render(
    <CartProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CartProvider>
)
