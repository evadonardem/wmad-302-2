"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
} from "@mui/material";

export default function GCashPaymentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");

  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.push(`/payment/success?orderId=${orderId}`);
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 4, textAlign: "center" }}>
      {/* HEADER */}
      <Box
        sx={{
          backgroundColor: "#0279FF",
          color: "white",
          p: 3,
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
          GCash
        </Typography>
      </Box>

      {/* BODY CARD */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Avatar
            src="/gcash-logo.png"
            sx={{
              width: 70,
              height: 70,
              margin: "0 auto",
              mb: 1,
            }}
          />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Pay with GCash
          </Typography>
        </Box>

        <Typography sx={{ mb: 1, opacity: 0.7 }}>
          Order ID
        </Typography>

        <Typography sx={{ fontWeight: 700, mb: 3, fontSize: "1.2rem" }}>
          #{orderId}
        </Typography>

        <Typography sx={{ opacity: 0.6, fontSize: "0.9rem", mb: 1 }}>
          Amount Due
        </Typography>

        <Typography sx={{ fontSize: "2rem", fontWeight: 800, mb: 4 }}>
          ₱ — Fake Payment —
        </Typography>

        {/* GCASH PAY BUTTON */}
        <Button
          variant="contained"
          onClick={handlePayment}
          disabled={loading}
          fullWidth
          sx={{
            backgroundColor: "#0279FF",
            py: 1.5,
            fontWeight: 700,
            borderRadius: "8px",
            fontSize: "1.1rem",
            "&:hover": { backgroundColor: "#0069E0" },
          }}
        >
          {loading ? "Processing..." : "Pay Now with GCash"}
        </Button>
      </Paper>

      {/* FOOTER */}
      <Typography sx={{ mt: 3, opacity: 0.6, fontSize: "0.8rem" }}>
        This is a simulated GCash payment screen.
      </Typography>
    </Container>
  );
}
