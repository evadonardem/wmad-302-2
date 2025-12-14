"use client";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  Stack,
} from "@mui/material";

import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }) {
  return (
    <Card
      sx={{
        width: 220,
        minHeight: 360,
        borderRadius: 2.5,
        background: "#F7ECE2",
        border: "1px solid #D4B8A6",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 2px 6px rgba(75, 46, 25, 0.15)",

        /* ⭐⭐ Hover Animation Restored ⭐⭐ */
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 10px 24px rgba(75, 46, 25, 0.25)",
        },
      }}
    >
      {/* IMAGE */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={product.thumbnail}
          alt={product.title || "Product image"}
          sx={{
            width: "100%",
            height: 150,
            objectFit: "cover",
            transition: "transform 0.3s ease",

            /* ⭐ Slight zoom on hover */
            ".MuiCard-root:hover &": {
              transform: "scale(1.05)",
            },
          }}
        />

        {/* PRICE TAG */}
        <Chip
          label={`₱${product.price}`}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "#4B2E19",
            color: "#F5E6D3",
            fontWeight: 700,
            boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
          }}
        />
      </Box>

      {/* PRODUCT INFO */}
      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        {/* TITLE */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "#3A2516",
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.title}
        </Typography>

        {/* CATEGORY + RATING */}
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip
            label={product.category}
            size="small"
            variant="outlined"
            sx={{ borderColor: "#6F4E37", color: "#6F4E37" }}
          />

          <Chip
            label={`⭐ ${product.rating}`}
            size="small"
            sx={{
              background: "#E8D4C7",
              color: "#4B2E19",
              fontWeight: 600,
            }}
          />
        </Stack>

        {/* DESCRIPTION SNIPPET */}
        <Typography
          variant="caption"
          sx={{
            color: "#6D5B4B",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.description}
        </Typography>
      </CardContent>

      {/* BUTTONS */}
      <CardActions
        sx={{
          px: 1.5,
          pb: 1.5,
          pt: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* VIEW BUTTON */}
        <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <Button
            size="small"
            sx={{
              color: "#4B2E19",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { color: "#6F4E37" },
            }}
          >
            View
          </Button>
        </Link>

        {/* ADD TO CART */}
        <AddToCartButton product={product} />
      </CardActions>
    </Card>
  );
}
