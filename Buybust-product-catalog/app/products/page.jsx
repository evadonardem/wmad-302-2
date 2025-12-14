"use client";

import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Typography,
  Skeleton,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
} from "@mui/material";

import ProductCard from "../components/ProductCard";

function SkeletonCard() {
  return (
    <Box
      sx={{
        width: "100%",
        background: "#F5E6D3",
        borderRadius: 2,
        p: 1,
      }}
    >
      <Skeleton
        variant="rectangular"
        height={140}
        sx={{ borderRadius: 2, bgcolor: "#E0CBB3" }}
      />
      <Skeleton width="60%" sx={{ mt: 1, bgcolor: "#D9C1A5" }} />
      <Skeleton width="80%" sx={{ bgcolor: "#D9C1A5" }} />
    </Box>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("");

  // LOAD ALL PRODUCTS
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("https://dummyjson.com/products?limit=200");
        const data = await res.json();
        setProducts(data.products || []);

        // create unique category list
        const cats = [...new Set(data.products.map((p) => p.category))];
        setCategories(cats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // FILTERING
  let filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  // SORTING
  if (sort === "price_low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price_high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "rating_high") filtered.sort((a, b) => b.rating - a.rating);
  if (sort === "name_az")
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "name_za")
    filtered.sort((a, b) => b.title.localeCompare(a.title));

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#EEE5DA",
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          textAlign: "center",
          color: "#4B2E19",
        }}
      >
        Products
      </Typography>

      {/* SEARCH + FILTERS ROW */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ maxWidth: 1000, mx: "auto", mb: 4 }}
        justifyContent="center"
      >
        {/* SEARCH BAR */}
        <TextField
          fullWidth
          variant="outlined"
          label="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            background: "#F5E6D3",
            borderRadius: 2,
          }}
        />

        {/* CATEGORY FILTER */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            sx={{ background: "#F5E6D3", borderRadius: 2 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SORTING */}
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sort}
            label="Sort"
            onChange={(e) => setSort(e.target.value)}
            sx={{ background: "#F5E6D3", borderRadius: 2 }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="price_low">Price: Low → High</MenuItem>
            <MenuItem value="price_high">Price: High → Low</MenuItem>
            <MenuItem value="rating_high">Rating: High → Low</MenuItem>
            <MenuItem value="name_az">Name: A → Z</MenuItem>
            <MenuItem value="name_za">Name: Z → A</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* PRODUCT GRID */}
      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{ maxWidth: "1500px", mx: "auto" }}
      >
        {(loading ? Array.from({ length: 12 }) : filtered).map(
          (product, i) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              lg={2}
              key={loading ? i : product.id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {loading ? <SkeletonCard /> : <ProductCard product={product} />}
            </Grid>
          )
        )}
      </Grid>

      {!loading && filtered.length === 0 && (
        <Typography sx={{ mt: 4, color: "#6F4E37", textAlign: "center" }}>
          No matching products found.
        </Typography>
      )}
    </Box>
  );
}
