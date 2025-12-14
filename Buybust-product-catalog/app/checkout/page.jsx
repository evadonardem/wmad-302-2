"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper
} from "@mui/material";

import { useCart } from "../components/CartProvider";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  // ⭐ IMPORTANT — RESTORE CART FUNCTIONS
  const {
    items,
    totalPrice,
    clearCart,
    updateQuantity,
    removeFromCart
  } = useCart();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("online");

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const safePrice = (p) => Number(p || 0);

  // ⭐ Background color
  useEffect(() => {
    document.body.style.background = "#EEE5DA";
    document.body.style.margin = "0";
    document.body.style.minHeight = "100vh";
  }, []);

  // ⭐ CHECK USER
  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (!data.user) router.push("/login?redirect=/checkout");
      else setUser(data.user);
    };
    checkUser();
  }, [router]);

  const placeOrder = async () => {
    if (!user) {
      alert("You must be logged in to place an order.");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (!items || items.length === 0) return;

    if (!fullName || !mobile || !address) {
      alert("Please fill out all required delivery details.");
      return;
    }

    if (!/^[0-9]+$/.test(mobile)) {
      alert("Mobile number must contain digits only.");
      return;
    }

    setLoading(true);

    try {
      const cleanItems = items.map((it) => ({
        id: it.id,
        title: it.title,
        price: safePrice(it.price),
        quantity: it.quantity,
        thumbnail: it.thumbnail,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: cleanItems,
          totalPrice,
          paymentMethod,
          shipping: { fullName, mobile, address, notes },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Order failed");
      }

      const data = await res.json();
      clearCart();

      if (paymentMethod === "cod") {
        router.push(`/checkout/success?order=${data.orderId}`);
      } else {
        router.push(`/payment?orderId=${data.orderId}`);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user === null) return null;

  return (
    <>
      {/* ⭐ COFFEE BLOB BACKGROUND (NO BLUR) */}
      <style jsx global>{`
        .coffee-blob-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(111,78,55,0.25), rgba(0,0,0,0));
          animation: float 14s infinite ease-in-out alternate;
        }

        .blob:nth-child(2) {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(210,180,140,0.25), rgba(0,0,0,0));
          animation-duration: 18s;
        }

        .blob:nth-child(3) {
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(150,110,70,0.28), rgba(0,0,0,0));
          animation-duration: 20s;
        }

        @keyframes float {
          0% { transform: translate(-10%, -10%) scale(1); }
          100% { transform: translate(15%, 20%) scale(1.25); }
        }
      `}</style>

      <div className="coffee-blob-bg">
        <div className="blob" style={{ top: "-15%", left: "-10%" }}></div>
        <div className="blob" style={{ bottom: "-10%", right: "-5%" }}></div>
        <div className="blob" style={{ top: "30%", right: "-20%" }}></div>
      </div>

      {/* ⭐ MAIN CONTENT */}
      <Box sx={{ p: 4, minHeight: "100vh" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#4B2E19", mb: 3 }}>
          Checkout
        </Typography>

        {/* 🧺 ORDER SUMMARY */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background: "#F7ECE2",
            border: "1px solid #D4B8A6",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#4B2E19" }}>
            Order Summary
          </Typography>

          <List>
            {items.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  mb: 1,
                  background: "#F5E6D3",
                  borderRadius: 2,
                  border: "1px solid #D9C1A5",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ListItemAvatar>
                  <Avatar src={item.thumbnail} variant="rounded" sx={{ width: 60, height: 60 }} />
                </ListItemAvatar>

                <ListItemText
                  primary={item.title}
                  secondary={`₱${safePrice(item.price).toFixed(2)}`}
                  sx={{ ml: 1 }}
                />

                {/* ⭐ QUANTITY CONTROLS */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 2 }}>
                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: 32,
                      height: 32,
                      p: 0,
                      borderColor: "#6F4E37",
                      color: "#6F4E37",
                    }}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>

                  <Typography sx={{ width: 30, textAlign: "center" }}>
                    {item.quantity}
                  </Typography>

                  <Button
                    variant="outlined"
                    sx={{
                      minWidth: 32,
                      height: 32,
                      p: 0,
                      borderColor: "#6F4E37",
                      color: "#6F4E37",
                    }}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </Stack>

                {/* ⭐ DELETE BUTTON */}
                <Button
                  variant="outlined"
                  color="error"
                  sx={{
                    minWidth: 34,
                    height: 34,
                    p: 0,
                    borderColor: "#b22222",
                    color: "#b22222",
                  }}
                  onClick={() => removeFromCart(item.id)}
                >
                  X
                </Button>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ color: "#4B2E19", textAlign: "right" }}>
            Total: ₱{safePrice(totalPrice).toFixed(2)}
          </Typography>
        </Paper>

        {/* DELIVERY INFO */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            background: "#F7ECE2",
            borderRadius: 3,
            border: "1px solid #D4B8A6",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Delivery Information
          </Typography>

          <Stack spacing={2}>
            <TextField label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />

            <TextField
              label="Mobile Number"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              inputProps={{ maxLength: 11 }}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) &&
                  !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                  e.preventDefault();
                  alert("Numbers only.");
                }
              }}
            />

            <TextField
              label="Complete Address"
              required
              multiline
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <TextField
              label="Notes (Optional)"
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Stack>
        </Paper>

        {/* PAYMENT METHOD */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: "#F7ECE2",
            borderRadius: 3,
            border: "1px solid #D4B8A6",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Payment Method
          </Typography>
          <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <FormControlLabel value="online" control={<Radio />} label="Online Payment (GCash)" />
            <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
          </RadioGroup>
        </Paper>

        {/* TOTAL + BUTTONS */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Total</Typography>
          <Typography variant="h5">₱{safePrice(totalPrice).toFixed(2)}</Typography>
        </Box>

        <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
          <Button
            variant="contained"
            disabled={loading || items.length === 0}
            onClick={placeOrder}
            sx={{
              background: "#6F4E37",
              "&:hover": { background: "#4B2E19" },
            }}
          >
            {loading ? "Processing..." : "Place Order"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => router.push("/products")}
            sx={{ borderColor: "#6F4E37", color: "#6F4E37" }}
          >
            Continue Shopping
          </Button>
        </Stack>
      </Box>
    </>
  );
}
