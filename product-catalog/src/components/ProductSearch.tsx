import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  InputAdornment,
  Rating,
  TextField,
  Typography,
  Chip,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useSearchParams } from "react-router-dom";

import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from "../configs/constants";
import { SearchProducts } from "../api/ProductsAPI";
import { useReviews } from "../context/ReviewContext";

import ProductDetailDialog from "./ProductDetailDialog";
import ReviewDialog from "./ReviewDialog";

type SortKey = "relevance" | "price_low" | "price_high" | "rating_high";

export default function ProductSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");

  const [selected, setSelected] = useState<any | null>(null);
  const [reviewId, setReviewId] = useState<number | null>(null);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const searchTimeout = useRef<any>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const { reviews } = useReviews();

  /* ================= FETCH PRODUCTS ================= */
  const fetchProducts = useCallback(
    async (term: string, p: number) => {
      if (loading || !hasMore) return;
      setLoading(true);

      const res = await SearchProducts({
        searchKey: term,
        page: p,
        perPage: DEFAULT_PER_PAGE,
      });

      setProducts((prev) =>
        p === 1 ? res.products : [...prev, ...res.products]
      );
      setHasMore(p < res.lastPage);
      setLoading(false);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchProducts(search, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // When category filters change, reset the listing and refetch
  useEffect(() => {
    setSearch("");
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts("", 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  /* ================= INFINITE SCROLL ================= */
  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((p) => p + 1);
      }
    });

    if (loadMoreRef.current) observer.current.observe(loadMoreRef.current);
    return () => observer.current?.disconnect();
  }, [hasMore, loading]);

  /* ================= SEARCH ================= */
  const handleSearch = (value: string) => {
    setSearch(value);

    if (category && value.trim()) {
      setSearchParams({});
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      setProducts([]);
      setPage(1);
      setHasMore(true);
      fetchProducts(value, 1);
    }, 400);
  };

  /* ================= FILTER + SORT ================= */
  const filteredProducts = useMemo(() => {
    const list = category
      ? products.filter((p) => {
          const cats = category.split(",").map((c) => c.trim().toLowerCase());
          const pc = (p.category || "").toString().trim().toLowerCase();
          return cats.includes(pc);
        })
      : products;

    const withRatings = list.map((p) => {
      const productReviews = reviews[p.id] || [];
      const avg =
        productReviews.reduce((s, r) => s + r.rating, 0) /
          (productReviews.length || 1) || 0;

      return {
        ...p,
        _avg: avg,
        _reviewCount: productReviews.length,
      };
    });

    if (sort === "price_low")
      return [...withRatings].sort((a, b) => a.price - b.price);
    if (sort === "price_high")
      return [...withRatings].sort((a, b) => b.price - a.price);
    if (sort === "rating_high")
      return [...withRatings].sort((a, b) => b._avg - a._avg);

    return withRatings;
  }, [products, category, reviews, sort]);

  return (
    <>
      {/* ================= SEARCH HEADER ================= */}
      <Box sx={{ position: "sticky", top: 88, zIndex: 10, pb: 1 }}>
        <Card
          sx={{
            backgroundColor: "#fff",
            border: "1px solid rgba(0,0,0,0.15)",
            borderRadius: 1.5,
          }}
        >
          <CardContent sx={{ py: 1.2, px: 1.5 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems="center"
            >
              {/* SEARCH INPUT */}
              <TextField
                fullWidth
                placeholder="Search products"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                inputRef={(el) => (searchRef.current = el)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 20, color: "#000" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                    fontSize: 14,
                    borderRadius: 1,
                    "& fieldset": {
                      borderColor: "#000", // 🔴 BLACK EXTERIOR
                      borderWidth: 1.5,
                    },
                    "&:hover fieldset": {
                      borderColor: "#000",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000",
                      borderWidth: 2,
                    },
                  },
                }}
              />

              {/* SORT SELECT */}
              <FormControl sx={{ minWidth: 180 }}>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  sx={{
                    height: 40,
                    fontSize: 14,
                    borderRadius: 1,
                    "& fieldset": {
                      borderColor: "#000", // 🔴 BLACK EXTERIOR
                      borderWidth: 1.5,
                    },
                    "&:hover fieldset": {
                      borderColor: "#000",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#000",
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="relevance">Relevance</MenuItem>
                  <MenuItem value="price_low">Low → High</MenuItem>
                  <MenuItem value="price_high">High → Low</MenuItem>
                  <MenuItem value="rating_high">Top Rated</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            {category && (
              <Box mt={0.8}>
                <Chip
                  size="small"
                  label={`Category: ${category}`}
                  color="primary"
                  onDelete={() => setSearchParams({})}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* ================= PRODUCT GRID ================= */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Box
          sx={{
            display: "grid",
            gap: 14,
            maxWidth: 1200,
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
            },
          }}
        >
          {filteredProducts.map((p) => (
            <Card
              key={p.id}
              sx={{ cursor: "pointer" }}
              onClick={() => setSelected(p)}
            >
              <CardMedia component="img" height="170" image={p.thumbnail} />
              <CardContent>
                <Typography fontWeight={900} noWrap>
                  {p.title}
                </Typography>
                <Typography color="error">${p.price}</Typography>
                <Rating value={p._avg} readOnly size="small" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {hasMore && (
        <Box ref={loadMoreRef} display="flex" justifyContent="center" my={3}>
          <CircularProgress size={28} />
        </Box>
      )}

      {selected && (
        <ProductDetailDialog
          product={selected}
          open
          onClose={() => setSelected(null)}
          onWriteReview={(id: number) => setReviewId(id)}
          goToOrders={() => navigate("/orders")}
        />
      )}

      <ReviewDialog
        productId={reviewId}
        open={Boolean(reviewId)}
        onClose={() => setReviewId(null)}
      />
    </>
  );
}
