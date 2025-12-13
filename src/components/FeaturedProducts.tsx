import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [visible, setVisible] = useState<boolean[]>([]);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    fetch("https://fakestoreapi.com/products?limit=6")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setVisible(new Array(data.length).fill(false));
      });
  }, []);

  // Fade-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisible((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    cardsRef.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, [products]);

  return (
    <>
      {/* ==============================
          SCROLLING QUOTE MARQUEE SECTION
      =============================== */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          py: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shadows */}
        <div className="quoteShadowLeft" />
        <div className="quoteShadowRight" />

        {/* Marquee */}
        <div className="quoteMarquee">
          <div className="quoteTrack">
            <span className="quoteText">Designed for everyday elegance.</span>
            <span className="quoteText">Crafted with intention.</span>
            <span className="quoteText">Style that speaks quietly.</span>
            <span className="quoteText">Timeless pieces for modern living.</span>

            <span className="quoteText">Designed for everyday elegance.</span>
            <span className="quoteText">Crafted with intention.</span>
            <span className="quoteText">Style that speaks quietly.</span>
            <span className="quoteText">Timeless pieces for modern living.</span>
          </div>
        </div>
      </Box>

      {/* ==============================
          FEATURED PRODUCTS SECTION
      =============================== */}
      <Box
        sx={{
          backgroundColor: "#f3ebd9",
          px: 10,
          py: 10,
          pb: 4,
        }}
      >
        <Typography
          sx={{
            fontSize: "42px",
            fontWeight: 700,
            textAlign: "center",
            letterSpacing: "1px",
            mb: 6,
          }}
        >
          Featured Products
        </Typography>

        <Grid container spacing={10} justifyContent="center">
          {products.map((p, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Box
                onClick={() => navigate(`/product/${p.id}`)}
                ref={(el) => (cardsRef.current[i] = el!)}
                data-index={i}
                sx={{
                  width: "100%",
                  maxWidth: "380px",
                  mx: "auto",
                  cursor: "pointer",
                  opacity: visible[i] ? 1 : 0,
                  transform: visible[i]
                    ? "translateY(0)"
                    : "translateY(40px)",
                  transition: `all 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 0.15}s`,
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    height: 360,
                    backgroundColor: "#faf5eb",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    mb: 3,
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.08)",
                    transition: "all 0.35s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0px 10px 26px rgba(0,0,0,0.15)",
                    },
                    "& img:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      height: "85%",
                      width: "auto",
                      objectFit: "contain",
                      transition: "transform .45s ease",
                    }}
                  />
                </Box>

                <Typography sx={{ fontWeight: 700, fontSize: "20px", mb: 1 }}>
                  {p.title.split(" ").slice(0, 3).join(" ")}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#444",
                    mb: 2,
                    height: "40px",
                    overflow: "hidden",
                    lineHeight: "1.35",
                  }}
                >
                  {p.description}
                </Typography>

                <Typography
                  sx={{
                    textAlign: "right",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  ${p.price}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}
