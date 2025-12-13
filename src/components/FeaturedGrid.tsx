import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ Correct import
import { useEffect, useState } from "react";

export default function FeaturedProducts() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 100) setShow(true);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box
      sx={{
        py: 10,
        px: 6,
        backgroundColor: "#e6ddc4",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(40px)",
        transition: "all 1s ease",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 6,
        }}
      >
        Featured Products
      </Typography>

      {/* GRID START */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              height: 340,
              backgroundColor: "#000",
              display: "flex",
              alignItems: "flex-end",
              color: "white",
              p: 2,
            }}
          >
            Product 1
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              height: 340,
              backgroundColor: "#2b1f1f",
              display: "flex",
              alignItems: "flex-end",
              color: "white",
              p: 2,
            }}
          >
            Product 2
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              height: 340,
              backgroundColor: "#e57373",
              display: "flex",
              alignItems: "flex-end",
              color: "white",
              p: 2,
            }}
          >
            Product 3
          </Box>
        </Grid>
      </Grid>
      {/* GRID END */}
    </Box>
  );
}
