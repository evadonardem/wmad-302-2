import { Box, Typography, Button } from "@mui/material";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Cart() {
  const { cart, updateQty, removeFromCart } = useCart();

  return (
    <>
      <Navbar />

      <Box sx={{ px: 10, py: 6, minHeight: "70vh" }}>
        <Typography sx={{ fontSize: "40px", fontWeight: 800, mb: 4 }}>
          Your Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          cart.map((item) => (
            <Box
              key={item.id}
              sx={{
                p: 3,
                mb: 3,
                border: "1px solid #ddd",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <img
                src={item.image}
                width={80}
                height={80}
                style={{ objectFit: "contain" }}
              />

              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                <Typography>${item.price}</Typography>

                <input
                  type="number"
                  min={1}
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.id, Number(e.target.value))
                  }
                  style={{
                    width: "60px",
                    padding: "6px",
                    marginTop: "8px",
                  }}
                />
              </Box>

              <Button
                color="error"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </Box>
          ))
        )}
      </Box>

      <Footer />
    </>
  );
}
