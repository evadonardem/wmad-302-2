import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import Login from "./pages/Log-in"; 
import AdminDash from "./pages/Admin-dash";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDash />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </CartProvider>
  );
}
