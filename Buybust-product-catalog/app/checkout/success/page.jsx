// app/checkout/success/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { Box, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("order") || "Unknown";

  return (
    <>
      {/* Coffee-Themed Animated Background */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #EEE5DA, #E7D6C4);
          overflow-x: hidden;
        }

        .coffee-bg {
          position: fixed;
          inset: 0;
          z-index: -1;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(111, 78, 55, 0.3), rgba(0, 0, 0, 0));
          border-radius: 50%;
          animation: float 14s infinite ease-in-out alternate;
        }

        .blob:nth-child(2) {
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, rgba(210, 180, 140, 0.3), rgba(0, 0, 0, 0));
          animation-duration: 18s;
        }

        @keyframes float {
          0% {
            transform: translate(-10%, -10%) scale(1);
          }
          100% {
            transform: translate(15%, 20%) scale(1.25);
          }
        }
      `}</style>

      <div className="coffee-bg">
        <div className="blob" style={{ top: "-15%", left: "-10%" }}></div>
        <div className="blob" style={{ bottom: "-10%", right: "-15%" }}></div>
      </div>

      {/* MAIN CONTENT */}
      <Box
        sx={{
          p: 4,
          mt: 10,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            maxWidth: 500,
            width: "100%",
            borderRadius: 4,
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(75,46,25,0.15)",
          }}
        >
          {/* Success Icon */}
          <Typography
            sx={{
              fontSize: "60px",
              mb: 1,
              color: "#4B2E19",
            }}
          >
            ✔️
          </Typography>

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#4B2E19",
            }}
          >
            Thank you — your order is placed!
          </Typography>

          <Typography sx={{ mb: 3, fontSize: "18px", color: "#6F4E37" }}>
            Your order ID:
            <br />
            <b style={{ fontSize: "22px" }}>{orderId}</b>
          </Typography>

          <Link href={`/orders/${orderId}`}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mb: 2,
                background: "#6F4E37",
                "&:hover": { background: "#4B2E19" },
              }}
            >
              View Order Details
            </Button>
          </Link>

          <Link href="/products">
            <Button
              variant="outlined"
              fullWidth
              sx={{
                borderColor: "#6F4E37",
                color: "#6F4E37",
                "&:hover": { background: "rgba(111,78,55,0.1)" },
              }}
            >
              Continue Shopping
            </Button>
          </Link>
        </Paper>
      </Box>
    </>
  );
}
