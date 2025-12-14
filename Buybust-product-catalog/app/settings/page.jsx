// app/settings/page.jsx
"use client";

import React from "react";
import { Container, Box, Button, Typography, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <>
      {/* Coffee Background Animation */}
      <style jsx global>{`
        body {
          background: #eee5da;
          overflow-x: hidden;
        }

        .bg-blob {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }

        .blob {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          filter: blur(60px);
          animation: float 15s infinite ease-in-out alternate;
        }

        /* Latte blobs */
        .blob:nth-child(1) {
          background: rgba(240, 220, 190, 0.65);
          top: -10%;
          left: -10%;
        }

        .blob:nth-child(2) {
          background: rgba(215, 175, 130, 0.55);
          bottom: -15%;
          right: -5%;
          animation-duration: 18s;
        }

        .blob:nth-child(3) {
          background: rgba(150, 105, 70, 0.5);
          top: 30%;
          right: -20%;
          animation-duration: 22s;
        }

        @keyframes float {
          0% {
            transform: translate(-5%, -5%) scale(1);
          }
          100% {
            transform: translate(8%, 8%) scale(1.25);
          }
        }
      `}</style>

      <div className="bg-blob">
        <div className="blob"></div>
        <div className="blob"></div>
        <div className="blob"></div>
      </div>

      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255,248,240,0.85)",
            border: "1px solid rgba(210,180,140,0.4)",
            boxShadow: "0 0 25px rgba(80,60,40,0.25)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: "bold",
              color: "#4B2E19",
              textAlign: "center",
            }}
          >
            Settings
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => router.push("/profile/edit")}
              sx={{
                borderColor: "#6F4E37",
                color: "#6F4E37",
                "&:hover": {
                  borderColor: "#4B2E19",
                  background: "rgba(111,78,55,0.1)",
                },
              }}
            >
              Edit Profile
            </Button>

            <Button
              variant="outlined"
              onClick={() => router.push("/profile/change-password")}
              sx={{
                borderColor: "#6F4E37",
                color: "#6F4E37",
                "&:hover": {
                  borderColor: "#4B2E19",
                  background: "rgba(111,78,55,0.1)",
                },
              }}
            >
              Change Password
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                if (confirm("Are you sure you want to logout?")) {
                  fetch("/api/auth/logout", { method: "POST" }).then(() =>
                    router.push("/")
                  );
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
