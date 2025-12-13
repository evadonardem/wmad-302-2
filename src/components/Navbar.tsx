import { Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUserName(parsed?.name || null);
      } catch (err) {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  }, []);

  const handleAuthClick = (e: any) => {
    e.stopPropagation();
    if (userName) {
      // logout
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
      setUserName(null);
      navigate("/login", { replace: true });
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 2000,
        backgroundColor: "#e6ddc4",
        color: "#1a1a1a",
        borderBottom: "1px solid rgba(0,0,0,0.2)",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
      }}
    >
      {/* LEFT LINKS */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          minWidth: "260px",
        }}
      >
        {["Home", "Shop", "About"].map((label) => (
          <Typography
            key={label}
            onClick={() =>
              navigate(label === "Home" ? "/home" : `/${label.toLowerCase()}`)
            }
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "1px",
              "&:hover": { opacity: 0.7 },
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      {/* CENTERED BRAND NAME */}
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Typography
          onClick={() => navigate("/home")}
          sx={{
            fontWeight: 700,
            fontSize: "26px",
            letterSpacing: "4px",
            cursor: "pointer",
          }}
        >
          SHOPPA
        </Typography>
      </Box>

      {/* AUTH + CART ICON RIGHT */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minWidth: "260px",
          justifyContent: "flex-end",
          pr: 1,
        }}
      >
        <Button
          onClick={handleAuthClick}
          variant={userName ? "contained" : "outlined"}
          startIcon={userName ? <LogoutIcon /> : undefined}
          size="small"
          sx={{
            mr: 2,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: userName ? "linear-gradient(90deg,#ff8a00,#e52e71)" : undefined,
            color: userName ? "#fff" : undefined,
            boxShadow: userName ? "0 4px 12px rgba(229,46,113,0.24)" : undefined,
            '&:hover': {
              opacity: 0.95,
            },
          }}
        >
          {userName ? `Log out (${userName})` : "Log in"}
        </Button>

        <Box sx={{ position: "relative", cursor: "pointer" }} onClick={() => navigate("/cart") }>
          <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: "22px" }} />

          {cartCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "-6px",
                right: "-10px",
                background: "#000",
                color: "white",
                fontSize: "12px",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {cartCount}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
