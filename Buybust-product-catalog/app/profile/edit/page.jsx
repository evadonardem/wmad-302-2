"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import {
  Container,
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
  Alert,
} from "@mui/material";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!data.user) return router.push("/login");

      setName(data.user.name);
      setEmail(data.user.email);
      setAvatarPreview(data.user.avatar || null);

      setLoading(false);
    }
    load();
  }, [router]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarBase64(reader.result);
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, avatarBase64 }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
      router.push("/settings");
    } else {
      setError(data.error || "Something went wrong.");
    }

    setSaving(false);
  }

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {/* Coffee-Themed Animated Background */}
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
          overflow: hidden;
          z-index: -1;
        }

        .blob {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          animation: float 14s infinite ease-in-out alternate;
          filter: blur(60px);
        }

        /* Coffee Palette Blobs */
        .blob:nth-child(1) {
          background: rgba(240, 220, 190, 0.65); /* latte cream */
          top: -10%;
          left: -10%;
        }

        .blob:nth-child(2) {
          background: rgba(215, 175, 130, 0.55); /* caramel coffee */
          bottom: -15%;
          right: -5%;
          animation-duration: 17s;
        }

        .blob:nth-child(3) {
          background: rgba(150, 105, 70, 0.50); /* mocha rich */
          top: 25%;
          right: -20%;
          animation-duration: 20s;
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
            background: "rgba(255, 248, 240, 0.8)", // soft latte
            border: "1px solid rgba(210, 180, 140, 0.4)",
            boxShadow: "0 0 30px rgba(120, 90, 50, 0.25)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#4B2E19",
              textAlign: "center",
            }}
          >
            Edit Profile
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              mb: 3,
              justifyContent: "center",
            }}
          >
            <Avatar
              src={avatarPreview || undefined}
              sx={{
                width: 95,
                height: 95,
                border: "3px solid #D9C1A5",
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              }}
            />

            <Button
              variant="outlined"
              component="label"
              sx={{
                height: 42,
                borderColor: "#6F4E37",
                color: "#6F4E37",
                "&:hover": {
                  borderColor: "#4B2E19",
                  color: "#4B2E19",
                  background: "rgba(111,78,55,0.1)",
                },
              }}
            >
              Change Avatar
              <input hidden accept="image/*" type="file" onChange={handleFileChange} />
            </Button>
          </Box>

          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                background: "#F5E6D3",
              },
              "& .MuiInputLabel-root": { color: "#6F4E37" },
              "& input": { color: "#4B2E19" },
            }}
          />

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiInputBase-root": {
                background: "#F5E6D3",
              },
              "& .MuiInputLabel-root": { color: "#6F4E37" },
              "& input": { color: "#4B2E19" },
            }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={saving}
            onClick={handleSave}
            sx={{
              background: "#6F4E37",
              "&:hover": { background: "#4B2E19" },
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Paper>
      </Container>
    </>
  );
}
