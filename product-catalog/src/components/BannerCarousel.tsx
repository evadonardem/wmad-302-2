import { Box, Typography, Button, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const banners = [
  {
    title: "Blue Mega Sale",
    subtitle: "Up to 70% OFF • Limited Time",
    bg: "linear-gradient(135deg, #1565c0, #1e88e5)",
  },
  {
    title: "Free Shipping Week",
    subtitle: "On selected products",
    bg: "linear-gradient(135deg, #0d47a1, #1976d2)",
  },
  {
    title: "Top Rated Sellers",
    subtitle: "Trusted by thousands",
    bg: "linear-gradient(135deg, #283593, #3f51b5)",
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  // AUTO SLIDE
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const banner = banners[index];

  return (
    <Box
      sx={{
        position: "relative",
        height: 240,
        borderRadius: 4,
        mb: 4,
        overflow: "hidden",
        color: "#fff",
        background: banner.bg,
        display: "flex",
        alignItems: "center",
        px: 4,
      }}
    >
      {/* CONTENT */}
      <Box>
        <Typography variant="h4" fontWeight={900}>
          {banner.title}
        </Typography>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          {banner.subtitle}
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: "#fff",
            color: "#1565c0",
            "&:hover": { backgroundColor: "#fff" },
          }}
        >
          Shop Now
        </Button>
      </Box>

      {/* CONTROLS */}
      <IconButton
        onClick={() =>
          setIndex((index - 1 + banners.length) % banners.length)
        }
        sx={{
          position: "absolute",
          left: 10,
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      >
        <ArrowBackIosNewIcon />
      </IconButton>

      <IconButton
        onClick={() => setIndex((index + 1) % banners.length)}
        sx={{
          position: "absolute",
          right: 10,
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.25)",
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>

      {/* DOTS */}
      <Box
        sx={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
        }}
      >
        {banners.map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                i === index ? "#fff" : "rgba(255,255,255,0.5)",
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
