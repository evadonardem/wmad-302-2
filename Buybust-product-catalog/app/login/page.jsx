"use client";

import { useState } from "react";
import { Box, Paper, Typography, Button, TextField } from "@mui/material";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    window.location.href = "/";
  }

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `
          linear-gradient(135deg, #f5e6d3 0%, #d2b48c 100%)
        `,
        padding: 2,
      }}
    >
      {/* Clean Minimalist Login Card */}
      <Paper
        elevation={8}
        sx={{
          backdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.45)",
          borderRadius: 4,
          padding: "50px 60px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.4)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "#4b2e19",
            mb: 1,
          }}
        >
          Welcome Back
        </Typography>

        <Typography sx={{ color: "#5d4632", mb: 4 }}>
          Sign in to continue
        </Typography>

        {error && (
          <Box
            sx={{
              bgcolor: "rgba(255, 0, 0, 0.12)",
              border: "1px solid rgba(200,0,0,0.2)",
              color: "#7a1f1f",
              p: 1.5,
              borderRadius: 2,
              mb: 2,
              fontSize: "0.9rem",
            }}
          >
            {error}
          </Box>
        )}

        <TextField
          label="Email"
          fullWidth
          variant="outlined"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          sx={{ mb: 2 }}
        />

        <TextField
          label="Password"
          fullWidth
          type="password"
          variant="outlined"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          onClick={submit}
          sx={{
            background: "linear-gradient(90deg, #6f4e37, #8d6a50)",
            color: "white",
            borderRadius: 3,
            py: 1.2,
            fontSize: "1rem",
            fontWeight: 700,
            textTransform: "none",
            ":hover": {
              background: "linear-gradient(90deg, #593d2b, #7b5c45)",
            },
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </Button>
      </Paper>
    </Box>
  );
}
