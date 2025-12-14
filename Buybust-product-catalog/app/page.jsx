"use client";

import { useEffect, useState } from "react";
import { Button, Typography, Box, Paper } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const [imgs, setImgs] = useState([]);

  async function loadCategory(cat) {
    const res = await fetch(`https://dummyjson.com/products/category/${cat}`);
    const data = await res.json();
    return (data.products || []).map((p) => p.thumbnail).filter(Boolean);
  }

  useEffect(() => {
    let mount = true;

    async function loadAll() {
      try {
        const cats = ["groceries", "beauty", "fragrances", "kitchen-accessories"];
        const results = await Promise.all(cats.map(loadCategory));

        const allImgs = results.flat().filter(Boolean);

        if (!allImgs.length || !mount) return;

        // Generate 20 floating items
        const items = Array.from({ length: 20 }).map((_, i) => ({
          id: `float-${i}`,
          src: allImgs[i % allImgs.length],
          depth: i % 2 === 0 ? "foreground" : "background",
        }));

        if (mount) setImgs(items);
      } catch (err) {
        console.error("loading error:", err);
      }
    }

    loadAll();
    return () => (mount = false);
  }, []);

  // 20 fixed positions around the hero card
  const positions = [
    { top: "5%", left: "15%" },
    { top: "10%", right: "10%" },
    { top: "25%", left: "8%" },
    { top: "28%", right: "6%" },
    { top: "40%", left: "4%" },
    { top: "45%", right: "4%" },
    { top: "60%", left: "10%" },
    { top: "62%", right: "12%" },
    { bottom: "20%", left: "18%" },
    { bottom: "22%", right: "18%" },

    { top: "15%", left: "40%" },
    { top: "18%", right: "40%" },
    { bottom: "12%", left: "30%" },
    { bottom: "16%", right: "30%" },

    { top: "50%", left: "30%" },
    { top: "52%", right: "30%" },
    { bottom: "5%", left: "45%" },
    { bottom: "8%", right: "45%" },

    { top: "70%", left: "20%" },
    { top: "72%", right: "20%" },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `
          radial-gradient(circle at top right, rgba(255, 214, 170, 0.4), transparent 60%),
          radial-gradient(circle at bottom left, rgba(111, 78, 55, 0.45), transparent 70%),
          linear-gradient(135deg, #f5e6d3 0%, #d2b48c 100%)
        `,
      }}
    >
      {/* ⭐ Floating images */}
      {imgs.slice(0, 20).map((item, index) => {
        const pos = positions[index];
        const isForeground = item.depth === "foreground";

        const size = isForeground
          ? Math.floor(Math.random() * 80) + 160 // 160–240px
          : Math.floor(Math.random() * 60) + 120; // 120–180px

        return (
          <Box
            key={item.id}
            sx={{
              position: "absolute",
              ...pos,
              zIndex: isForeground ? 2 : 1,
              opacity: isForeground ? 0.9 : 0.55,
              filter: isForeground
                ? "drop-shadow(0px 6px 14px rgba(111, 78, 55, 0.5))"
                : "blur(1px) drop-shadow(0px 2px 6px rgba(111, 78, 55, 0.3))",
              animation: `floatUpDown ${6 + (index % 4)}s ease-in-out infinite`,
              pointerEvents: "none",
            }}
          >
            <Image
              src={item.src}
              alt="floating item"
              width={size}
              height={size}
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        );
      })}

      {/* ⭐ MAIN HERO CARD */}
      <Paper
        elevation={15}
        sx={{
          backdropFilter: "blur(14px)",
          background: "rgba(255, 255, 255, 0.25)",
          borderRadius: 4,
          padding: "50px 70px",
          textAlign: "center",
          maxWidth: 520,
          zIndex: 5,
          border: "1px solid rgba(255,255,255,0.4)",
          boxShadow: "0px 8px 32px rgba(111, 78, 55, 0.25)",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            color: "#4b2e19",
            mb: 2,
            letterSpacing: 1,
          }}
        >
          BuyBust
        </Typography>

        <Typography variant="h6" sx={{ color: "#5d4632", mb: 4 }}>
          Discover premium products brewed for your lifestyle.
        </Typography>

        <Link href="/products" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(90deg, #6f4e37, #8d6a50)",
              color: "white",
              px: 4,
              py: 1.3,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "1.15rem",
              textTransform: "none",
              ":hover": {
                background: "linear-gradient(90deg, #593d2b, #7b5c45)",
              },
            }}
          >
            Browse Products
          </Button>
        </Link>
      </Paper>

      {/* Animation */}
      <style jsx>{`
        @keyframes floatUpDown {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </Box>
  );
}
