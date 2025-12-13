import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Stack,
  useTheme,
  Skeleton,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import BannerCarousel from "./BannerCarousel";
import FlashSaleTimer from "./FlashSaleTimer";
import { SearchProducts } from "../api/ProductsAPI";
import { useReviews } from "../context/ReviewContext";
import { useUser } from "../context/UserContext";

export default function Dashboard({
  onStartShopping,
}: {
  onStartShopping?: () => void;
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { reviews } = useReviews();
  const { user } = useUser();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PRODUCTS ================= */
  useEffect(() => {
    setLoading(true);
    SearchProducts({
      searchKey: "",
      page: 1,
      perPage: 20,
    }).then((res) => {
      setProducts(res.products || []);
      setLoading(false);
    });
  }, []);

  /* ================= RATINGS ================= */
  const withRatings = useMemo(() => {
    return products.map((p) => {
      const rs = reviews[p.id] || [];
      const avg =
        rs.reduce((s, r) => s + r.rating, 0) / (rs.length || 1) || 0;
      return { ...p, _avg: avg };
    });
  }, [products, reviews]);

  const recommended = useMemo(
    () => [...withRatings].sort(() => 0.5 - Math.random()).slice(0, 4),
    [withRatings]
  );

  const topRated = useMemo(
    () => [...withRatings].sort((a, b) => b._avg - a._avg).slice(0, 4),
    [withRatings]
  );

  const randomPicks = useMemo(
    () => [...products].sort(() => 0.5 - Math.random()).slice(0, 4),
    [products]
  );

  /* ================= PRODUCT CARD ================= */
  const ProductCard = ({ p }: any) => (
    <Box>
      <Card
        sx={{
          height: "100%",
          width: "100%",
          maxWidth: 260,
          borderRadius: 3,
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
        onClick={() => navigate("/shop")}
      >
        <CardMedia component="img" height={150} image={p.thumbnail} />
        <CardContent>
          <Typography fontWeight={900} noWrap>
            {p.title}
          </Typography>
          <Typography color="error" fontWeight={900}>
            ${p.price}
          </Typography>
          <Rating value={p._avg || 0} readOnly size="small" />
        </CardContent>
      </Card>
    </Box>
  );

  /* ================= SKELETON CARD ================= */
  const SkeletonCard = () => (
    <Box>
      <Card sx={{ height: "100%", borderRadius: 3, width: "100%", maxWidth: 260 }}>
        <Skeleton variant="rectangular" height={150} />
        <CardContent>
          <Skeleton width="80%" />
          <Skeleton width="40%" />
          <Skeleton width="60%" />
        </CardContent>
      </Card>
    </Box>
  );

  /* ================= BLUE SECTION ================= */
  const BlueSection = ({
    title,
    items,
  }: {
    title: string;
    items: any[];
  }) => (
    <Card
      sx={{
        mb: 4,
        borderRadius: 4,
        border: "1px solid rgba(25,118,210,0.35)",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0d47a1, #102027)"
            : "linear-gradient(135deg, #e3f2fd, #ffffff)",
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight={900} mb={2} color="primary">
          {title}
        </Typography>

        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" } }}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : items.map((p) => <ProductCard key={p.id} p={p} />)}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* ================= GREETING ================= */}
      <Typography variant="h5" fontWeight={900} mb={1}>
        {user ? `Welcome back, ${user.name} 👋` : "Welcome to ShopEZ 👋"}
      </Typography>

      {/* ================= INTRO ================= */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          border: "1px solid rgba(25,118,210,0.35)",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0d47a1, #102027)"
              : "linear-gradient(135deg, #e3f2fd, #ffffff)",
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <InfoOutlinedIcon color="primary" sx={{ mt: 0.5 }} />
            <Box>
              <Typography variant="h6" fontWeight={900}>
                Shop smarter with ShopEZ
              </Typography>
              <Typography color="inherit" mt={0.5}>
                Discover top-rated products, personalized recommendations,
                and limited-time deals — all in one place.
                Enjoy fast checkout, trusted sellers, and secure delivery.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ================= HERO ================= */}
      <BannerCarousel />

      {/* ================= FLASH SALE ================= */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0d47a1, #1976d2)"
              : "linear-gradient(135deg, #bbdefb, #e3f2fd)",
        }}
      >
        <CardContent>
          <Typography fontWeight={900}>🔥 Flash Sale</Typography>
          <FlashSaleTimer />
        </CardContent>
      </Card>

      {/* ================= SECTIONS ================= */}
      <BlueSection title="⭐ Recommended for You" items={recommended} />
      <BlueSection title="🏆 Top Rated Products" items={topRated} />
      <BlueSection title="🎁 Discover Something New" items={randomPicks} />

      {/* ================= CTA ================= */}
      <Card
        sx={{
          mt: 5,
          p: 4,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0d47a1, #1976d2)"
              : "linear-gradient(135deg, #1565c0, #1e88e5)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={900}>
          Ready to shop?
        </Typography>
        <Typography sx={{ opacity: 0.9, mt: 1 }}>
          Secure checkout • Fast delivery • Trusted sellers
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 3,
            backgroundColor: "#fff",
            color: "#1565c0",
            "&:hover": { backgroundColor: "#fff" },
          }}
          onClick={() => {
            if (onStartShopping) return onStartShopping();
            navigate("/shop");
          }}
        >
          Start Shopping
        </Button>
      </Card>
    </Box>
  );
}
