import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  // Fetch product by ID
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  // ⭐ Loading Animation Page
  if (loading)
    return (
      <>
        <Navbar />
        <Box
          sx={{
            height: "75vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            animation: "pulseFade 1.5s infinite ease-in-out",
            fontSize: "48px",
            fontWeight: 800,
            letterSpacing: "4px",
            color: "#1a1a1a",
          }}
        >
          SHOPPA
        </Box>
        <Footer />
      </>
    );

  // Product not found
  if (!product)
    return (
      <>
        <Navbar />
        <Box sx={{ p: 10, textAlign: "center" }}>Product not found</Box>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />

      <Box
        sx={{
          backgroundColor: "#e6ddc4",
          minHeight: "100vh",
          py: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: "1400px",
            display: "flex",
            gap: 6,
            p: 4,
            background: "#f9f4e7",
            borderRadius: "14px",
            boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
          }}
        >
          {/* LEFT — PRODUCT IMAGE */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#efe7d7",
              borderRadius: "12px",
              p: 4,
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              style={{
                maxWidth: "100%",
                maxHeight: "600px",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* RIGHT — PRODUCT DETAILS */}
          <Box sx={{ flex: 1.2 }}>
            <Typography sx={{ fontSize: "36px", fontWeight: 800, mb: 1 }}>
              {product.title}
            </Typography>

            <Typography sx={{ color: "#555", mb: 1 }}>
              {product.category}
            </Typography>

            <Typography sx={{ mb: 3, color: "#333" }}>
              ⭐ {product.rating?.rate} ({product.rating?.count} reviews)
            </Typography>

            <Typography sx={{ fontSize: "34px", fontWeight: 700, mb: 3 }}>
              ${product.price}
            </Typography>

            {/* -------------------------------
                 QUANTITY + ADD TO CART
            -------------------------------- */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              
              {/* Quantity Selector */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #aaa",
                  borderRadius: "8px 0 0 8px",
                  height: "50px",
                  width: "150px",
                  overflow: "hidden",
                }}
              >
                <Button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  sx={{
                    minWidth: "40px",
                    borderRadius: 0,
                    color: "#333",
                  }}
                >
                  -
                </Button>

                <Box sx={{ flex: 1, textAlign: "center", fontSize: "18px" }}>
                  {qty}
                </Box>

                <Button
                  onClick={() => setQty((q) => q + 1)}
                  sx={{
                    minWidth: "40px",
                    borderRadius: 0,
                    color: "#333",
                  }}
                >
                  +
                </Button>
              </Box>

              {/* ADD TO CART BUTTON */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#1a1a1a",
                  color: "#f3ebd9",
                  px: 4,
                  py: 1.4,
                  textTransform: "none",
                  fontSize: "16px",
                  borderRadius: "0 8px 8px 0",
                  "&:hover": { bgcolor: "#000" },
                }}
                onClick={() => {
                  addToCart(
                  {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                  },
                  qty
                );
                }}
              >
                Add to Cart
              </Button>
            </Box>

            {/* DETAILS SECTION */}
            <Typography sx={{ fontWeight: 700, fontSize: "20px", mb: 1 }}>
              Details
            </Typography>

            <Typography sx={{ lineHeight: 1.6, mb: 4 }}>
              {product.description}
            </Typography>

            <Button
              variant="outlined"
              sx={{ textTransform: "none" }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
