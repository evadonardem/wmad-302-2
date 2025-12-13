import { Box, Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <Box
      className="footerFade"
      sx={{
        backgroundColor: "#2b2b2b",  // dark charcoal
        color: "#e6ddc4",           // light beige text
        mt: 0,
        pt: 8,
        pb: 6,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* BRAND NAME */}
      <Typography
        className="footerBrand"
        sx={{
          fontSize: "28px",
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "2px",
          mb: 3,
        }}
      >
        SHOPPA
      </Typography>

      {/* Navigation */}
      <Stack
        direction="row"
        spacing={4}
        justifyContent="center"
        sx={{ mb: 4 }}
      >
        <Typography className="footerLink" onClick={() => navigate("/home")}>
          Home
        </Typography>

        <Typography className="footerLink" onClick={() => navigate("/shop")}>
          Shop
        </Typography>

        <Typography className="footerLink" onClick={() => navigate("/about")}>
          About
        </Typography>
      </Stack>

      {/* Copyright */}
      <Typography
        sx={{
          textAlign: "center",
          fontSize: "14px",
          opacity: 0.7,
          mt: 2,
        }}
      >
        © 2025 SHOPPA · All rights reserved.
      </Typography>
    </Box>
  );
}
