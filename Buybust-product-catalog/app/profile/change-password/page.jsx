"use client";

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    if (!currentPassword || !newPassword)
      return alert("Fill all fields.");

    if (newPassword !== confirm)
      return alert("Passwords do not match.");

    setLoading(true);

    const res = await fetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password updated");
      router.push("/settings");
    } else {
      alert(data.error);
    }

    setLoading(false);
  }

  return (
    <>
      {/* COFFEE THEME BACKGROUND */}
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
          animation: float 16s infinite ease-in-out alternate;
        }

        .blob:nth-child(1) {
          background: rgba(240, 220, 190, 0.65);
          top: -10%;
          left: -10%;
        }

        .blob:nth-child(2) {
          background: rgba(215, 175, 130, 0.55);
          bottom: -15%;
          right: -5%;
          animation-duration: 19s;
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
            backdropFilter: "blur(15px)",
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
            Change Password
          </Typography>

          <TextField
            fullWidth
            label="Current Password"
            type="password"
            sx={{
              mb: 2,
              "& .MuiInputBase-root": { background: "#F5E6D3" },
              "& .MuiInputLabel-root": { color: "#6F4E37" },
              "& input": { color: "#4B2E19" },
            }}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            sx={{
              mb: 2,
              "& .MuiInputBase-root": { background: "#F5E6D3" },
              "& .MuiInputLabel-root": { color: "#6F4E37" },
              "& input": { color: "#4B2E19" },
            }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            sx={{
              mb: 3,
              "& .MuiInputBase-root": { background: "#F5E6D3" },
              "& .MuiInputLabel-root": { color: "#6F4E37" },
              "& input": { color: "#4B2E19" },
            }}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleChange}
            disabled={loading}
            sx={{
              background: "#6F4E37",
              "&:hover": { background: "#4B2E19" },
            }}
          >
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </Paper>
      </Container>
    </>
  );
}
