import { Box, Typography, Button } from "@mui/material";
import "../index.css";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "#e6ddc4",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "72px",
          fontWeight: 800,
          letterSpacing: "2px",
          lineHeight: 1.1,
          animation: "fadeInSlideUp 1s ease-out forwards",
        }}
      >
        SHOPPING GALLERY
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mt: 1,
          maxWidth: "700px",
          fontSize: "20px",
          lineHeight: 1.6,
          color: "#444",
          animation: "fadeInSlideUp 1.3s ease-out forwards",
        }}
      >
        A curated collection of pieces that express creativity, care, and modern living.
        Crafted for those who appreciate simplicity.
      </Typography>

      <Button
        variant="outlined"
        onClick={() => navigate("/about")}  
        sx={{
          mt: 4,
          padding: "12px 32px",
          borderRadius: "4px", 
          borderWidth: "2px",
          textTransform: "none",
          fontSize: "18px",
          fontWeight: 600,
          letterSpacing: "1px",
          color: "#1a1a1a",
          borderColor: "#1a1a1a",
          transition: "0.3s ease",
          animation: "fadeInSlideUp 1.6s ease-out forwards",
          "&:hover": {
            backgroundColor: "#1a1a1a",
            color: "#e6ddc4",
            borderColor: "#1a1a1a",
          },
        }}
      >
        About Us
      </Button>
    </Box>
  );
}
