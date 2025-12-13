import { useState, useEffect } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const [removingId, setRemovingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [checkoutCount, setCheckoutCount] = useState(0); // freeze item count
  const [animateTotal, setAnimateTotal] = useState(false); // ⭐ triggers animation

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === cart.length) {
      setSelected([]);
    } else {
      setSelected(cart.map((item) => item.id));
    }
  };

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
      setSelected((prev) => prev.filter((x) => x !== id));
    }, 300);
  };

  const totalSelected = cart
    .filter((item) => selected.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ⭐ TOTAL animation trigger when "selected" changes
  useEffect(() => {
    if (selected.length > 0) {
      setAnimateTotal(true);
      setTimeout(() => setAnimateTotal(false), 500);
    }
  }, [selected]);

  // ⭐ CHECKOUT (freeze the item count)
  const handleCheckout = () => {
    setCheckoutCount(selected.length);
    setOpenModal(true);

    setTimeout(() => {
      selected.forEach((id) => removeFromCart(id));
      setSelected([]);
    }, 200);
  };

  return (
    <>
      <Navbar />

      <Box className="pageFade" sx={{ px: 6, py: 6, minHeight: "80vh" }}>
        <Typography sx={{ fontSize: "38px", fontWeight: 800, mb: 2 }}>
          Your Cart
        </Typography>

        {/* ⭐ SELECT ALL BUTTON */}
        {cart.length > 0 && (
          <Button
            onClick={handleSelectAll}
            sx={{
              mb: 4,
              px: 3,
              py: 1,
              borderRadius: "10px",
              background: "#1a1a1a",
              color: "#f3ebd9",
              fontSize: "16px",
              "&:hover": { background: "#000" },
            }}
          >
            {selected.length === cart.length ? "Unselect All" : "Select All"}
          </Button>
        )}

        {cart.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          cart.map((item) => (
            <Box
              key={item.id}
              className={`cartItem ${removingId === item.id ? "removing" : ""}`}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                p: 3,
                mb: 2,
                border: "1px solid #ddd",
                borderRadius: "12px",
                backgroundColor: "#fdfbf6",
                transition: "0.3s ease",
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(item.id)}
                onChange={() => handleSelect(item.id)}
                style={{ width: 22, height: 22, cursor: "pointer" }}
              />

              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: "#555", mt: 0.5 }}>
                  ${item.price}
                </Typography>
              </Box>

              {/* QUANTITY BOX */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #aaa",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  sx={{ minWidth: 36, color: "#333" }}
                >
                  -
                </Button>

                <Box
                  sx={{
                    width: "50px",
                    textAlign: "center",
                    fontSize: "16px",
                    py: 1,
                    background: "white",
                    borderLeft: "1px solid #aaa",
                    borderRight: "1px solid #aaa",
                  }}
                >
                  {item.quantity}
                </Box>

                <Button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  sx={{ minWidth: 36, color: "#333" }}
                >
                  +
                </Button>
              </Box>

              <Button
                sx={{ color: "red", fontWeight: 700 }}
                onClick={() => handleRemove(item.id)}
              >
                REMOVE
              </Button>
            </Box>
          ))
        )}

        {/* ⭐ TOTAL + CHECKOUT ROW */}
        {selected.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 5,
              px: 2,
            }}
          >
            {/* ⭐ Animated total */}
            <Typography
              className={animateTotal ? "totalAnim" : ""}
              sx={{
                fontSize: "30px",
                fontWeight: 900,
                background: "#e6ddc4",
                padding: "8px 14px",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
              }}
            >
              Total: ${totalSelected.toFixed(2)}
            </Typography>

            {/* ⭐ Checkout button */}
            <Button
              sx={{
                background: "#1a1a1a",
                color: "#f3ebd9",
                px: 4,
                py: 1.6,
                fontSize: "18px",
                fontWeight: 700,
                borderRadius: "10px",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
                "&:hover": { background: "#000" },
              }}
              onClick={handleCheckout}
            >
              Checkout ({selected.length})
            </Button>
          </Box>
        )}
      </Box>

      <Footer />

      {/* CHECKOUT MODAL */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            background: "white",
            p: 5,
            width: "420px",
            borderRadius: "14px",
            mx: "auto",
            mt: "20vh",
            textAlign: "center",
            boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
            animation: "fadePop 0.4s ease-out",
          }}
        >
          <Typography sx={{ fontSize: "26px", fontWeight: 800, mb: 2 }}>
            Checkout Successful!
          </Typography>

          <Typography sx={{ fontSize: "18px", mb: 3 }}>
            You purchased <b>{checkoutCount}</b> item(s).  
            Thank you for shopping with SHOPPA!
          </Typography>

          <Button
            sx={{
              background: "#1a1a1a",
              color: "white",
              px: 4,
              py: 1,
              borderRadius: "10px",
              "&:hover": { background: "#000" },
            }}
            onClick={() => setOpenModal(false)}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}
