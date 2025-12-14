"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const pathname = usePathname();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState(null);

  const navItem = (label, path) => (
    <Typography
      component={Link}
      href={path}
      sx={{
        textDecoration: "none",
        color: pathname === path ? "#F0D4A3" : "#F5E6D3",
        fontWeight: pathname === path ? 700 : 500,
        transition: "0.2s ease",
        fontSize: "1rem",
        "&:hover": {
          color: "#FAEEDB",
          transform: "scale(1.05)",
        },
      }}
    >
      {label}
    </Typography>
  );

  const openMenu = (e) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    closeMenu();
    router.push("/");
  };

  return (
    <AppBar
      position="static"
      elevation={4}
      sx={{
        width: "100%",
        backgroundColor: "#4B2E19",
        color: "#F5E6D3",
        mb: 3,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography
          component={Link}
          href="/"
          sx={{
            textDecoration: "none",
            color: "#F5E6D3",
            fontWeight: "bold",
            fontSize: "1.7rem",
            letterSpacing: 1,
            transition: "0.2s",
            "&:hover": { opacity: 0.8, transform: "scale(1.03)" },
          }}
        >
          BuyBust
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {navItem("Products", "/products")}
          {navItem("Orders", "/orders")}

          <IconButton
            onClick={() => router.push("/checkout")}
            sx={{
              color: "#F5E6D3",
              transition: "0.2s",
              "&:hover": { color: "#FAEEDB", transform: "scale(1.1)" },
            }}
          >
            <Badge
              badgeContent={totalItems}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#A68C6D",
                  color: "#fff",
                },
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {!user ? (
            <>
              <Button
                component={Link}
                href="/login"
                sx={{
                  color: "#F5E6D3",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": { color: "#FAEEDB" },
                }}
              >
                Login
              </Button>

              <Button
                component={Link}
                href="/register"
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  backgroundColor: "#A68C6D",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#8C7259" },
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={openMenu}
                startIcon={
                  <Avatar
                    src={user.avatar || undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      border: "2px solid #F5E6D3",
                    }}
                  >
                    {!user.avatar &&
                      (user.name?.charAt(0).toUpperCase() || "U")}
                  </Avatar>
                }
                sx={{
                  color: "#F5E6D3",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": { color: "#FAEEDB" },
                }}
              >
                {user.name}
              </Button>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>

                <MenuItem disabled sx={{ opacity: 1, cursor: "default", py: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={user.avatar || undefined}
                      sx={{ width: 45, height: 45 }}
                    >
                      {!user.avatar &&
                        (user.name?.charAt(0).toUpperCase() || "U")}
                    </Avatar>

                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                      <Typography sx={{ fontSize: "0.8rem", opacity: 0.8 }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>

                <hr style={{ width: "100%", borderColor: "#ddd", opacity: 0.3 }} />

                <MenuItem
                  onClick={() => {
                    closeMenu();
                    router.push("/settings");
                  }}
                >
                  Settings
                </MenuItem>

                {user.role === "admin" && (
                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      router.push("/admin");
                    }}
                  >
                    Admin Panel
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
