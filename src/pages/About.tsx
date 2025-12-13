import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Typography } from "@mui/material";

export default function About() {
  return (
      <>
        <Navbar />

        <Box
        className="pageFade"
          sx={{
            backgroundColor: "#e6ddc4",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            px: 4,
            pt: "30px",   // ⬅ pulled higher
            pb: "80px",
          }}
        >
          {/* Big Title */}
          <Typography
            sx={{
              fontSize: "75px",
              fontWeight: 900,
              letterSpacing: "3px",
              mb: 3, // slightly tighter
              animation: "fadeInSlideUp 1s ease-out forwards",
            }}
          >
            ABOUT US
          </Typography>

          {/* Main paragraph */}
          <Typography
            sx={{
              maxWidth: "900px",
              fontSize: "32px",
              lineHeight: 1.55,
              mb: 4, // tighter spacing
              color: "#222",
              animation: "fadeInSlideUp 1.3s ease-out forwards",
            }}
          >
            Welcome to <b>SHOPPA</b>, a thoughtfully crafted shopping experience
            built to showcase curated products, modern design, and seamless
            interactions. Every section of this web app has been created with
            intention—from the clean layout, soft color palette, and smooth
            animations, to the carefully selected products you see across our
            pages.
          </Typography>

          {/* Sub paragraph */}
          <Typography
            sx={{
              maxWidth: "850px",
              fontSize: "28px",
              lineHeight: 1.55,
              color: "#333",
              animation: "fadeInSlideUp 1.6s ease-out forwards",
            }}
          >
            We believe that a shopping experience should be more than just
            browsing — it should feel elegant, artistic, and effortless.
          </Typography>
        </Box>

        <Footer />
      </>
  );
}
