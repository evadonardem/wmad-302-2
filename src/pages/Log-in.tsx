import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Chip,
} from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";

type MockUser = {
  email: string;
  password: string;
  name: string;
  role: "customer" | "admin" | "staff";
};

// Replace with your real authentication source (API / identity provider)
const mockUsers: MockUser[] = [
  { email: "dexter@example.com", password: "password123", name: "Dexter", role: "customer" },
  { email: "admin@example.com", password: "adminpass", name: "Admin", role: "admin" },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Simulate API/auth check with mock users
      const user = mockUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user || user.password !== password) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      // Simulate API latency
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Persist session
      const session = { email: user.email, name: user.name, role: user.role };
      // Always store in sessionStorage for current session
      sessionStorage.setItem("currentUser", JSON.stringify(session));
      // If user asked to be remembered, persist in localStorage as well
      if (rememberMe) {
        localStorage.setItem("currentUser", JSON.stringify(session));
      }

      console.log("Login Successful:", session);
      // Redirect based on role
      if (session.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3, justifyContent: "center" }}>
            <LockIcon sx={{ mr: 1, fontSize: 32, color: "primary.main" }} />
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Login
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Remember me"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>

          {/* Demo users helper */}
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {mockUsers.map((user) => (
              <Chip
                key={user.email}
                label={`${user.name} (${user.role})`}
                size="small"
                onClick={() => {
                  setEmail(user.email);
                  setPassword(user.password);
                  setError("");
                }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Don't have an account?{" "}
              <Link href="/register" underline="hover" sx={{ fontWeight: 600 }}>
                Register here
              </Link>
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <Link href="/" underline="hover" sx={{ fontWeight: 600 }}>
                Back to Home
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
