import Image from "next/image";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
} from "@mui/material";

import AddToCartWrapper from "./AddToCartWrapper";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";

export default async function ProductDetails({ params }) {
  const resolved = await params;
  const id = resolved.id;

  let product = null;

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Fetch failed");

    product = await res.json();
  } catch (e) {
    return <ProductDetailsSkeleton />;
  }

  if (!product || product.message === "Product not found") {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Product not found.</Typography>
      </Box>
    );
  }

  const mainImage =
    product.thumbnail?.trim() !== "" ? product.thumbnail : "/fallback.png";

  const images = Array.isArray(product.images)
    ? product.images.filter((img) => img?.trim() !== "")
    : [];

  const productForCart = {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    thumbnail: product.thumbnail,
    description: product.description,
  };

  return (
    <Box sx={{ background: "#EEE5DA", minHeight: "100vh", p: 3 }}>
      <Grid container spacing={4}>
        {/* LEFT IMAGE SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            sx={{
              p: 2,
              background: "#F7ECE2",
              borderRadius: 3,
              border: "1px solid #D4B8A6",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: 400,
                minHeight: 400,
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                border: "1px solid #D9C1A5",
              }}
            >
              <Image
                src={mainImage}
                alt={product.title || "Product image"}
                fill
                priority
                loading="eager"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: "contain",
                  backgroundColor: "white",
                }}
              />
            </Box>

            {images.length > 1 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2, overflowX: "auto", pb: 1 }}
              >
                {images.slice(0, 6).map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 80,
                      height: 64,
                      position: "relative",
                      flexShrink: 0,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid #D9C1A5",
                      background: "#FFF",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.title}-image-${idx}`}
                      fill
                      sizes="100px"
                      style={{
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* RIGHT DETAILS SECTION */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 1,
              color: "#4B2E19",
            }}
          >
            {product.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={`₱${product.price}`}
              sx={{
                background: "#6F4E37",
                color: "white",
                fontWeight: "bold",
              }}
            />

            <Chip
              label={product.category}
              variant="outlined"
              sx={{
                borderColor: "#6F4E37",
                color: "#4B2E19",
                fontWeight: 600,
              }}
            />

            <Chip
              label={`⭐ ${product.rating}`}
              sx={{
                background: "#D9C1A5",
                color: "#4B2E19",
              }}
            />
          </Stack>

          <Typography
            variant="body1"
            sx={{
              mb: 3,
              color: "#4B2E19",
              lineHeight: 1.6,
            }}
          >
            {product.description}
          </Typography>

          <AddToCartWrapper product={productForCart} />
        </Grid>
      </Grid>
    </Box>
  );
}
