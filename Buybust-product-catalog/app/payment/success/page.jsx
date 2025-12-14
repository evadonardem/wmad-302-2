"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Container, Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <Container maxWidth="xs" sx={{ mt: 6, textAlign: "center" }}>
      <CheckCircleIcon sx={{ fontSize: 90, color: "#00C853", mb: 2 }} />

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Payment Successful
      </Typography>

      <Typography sx={{ mb: 4, opacity: 0.8 }}>
        Your payment for <b>Order #{orderId}</b> has been confirmed.
      </Typography>

      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#0279FF",
          py: 1.3,
          fontWeight: 700,
          borderRadius: "8px",
          fontSize: "1rem",
          "&:hover": { backgroundColor: "#0069E0" },
        }}
        onClick={() => router.push("/orders")}
      >
        Go to Orders
      </Button>
    </Container>
  );
}
