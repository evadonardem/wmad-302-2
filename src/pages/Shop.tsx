import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Box, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const navigate = useNavigate();

  const fallbackProducts = [
    { id: 101, title: "Basic Tee", price: 19.99, description: "Comfortable cotton tee.", category: "men's clothing", image: "https://via.placeholder.com/300x300?text=Tee" },
    { id: 102, title: "Stylish Watch", price: 129.99, description: "Sleek analog watch.", category: "electronics", image: "https://via.placeholder.com/300x300?text=Watch" },
    { id: 103, title: "Elegant Necklace", price: 59.99, description: "Gold-plated necklace.", category: "jewelery", image: "https://via.placeholder.com/300x300?text=Necklace" },
  ];

  const [products, setProducts] = useState<any[]>(() => fallbackProducts);
  const [filteredProducts, setFilteredProducts] = useState<any[]>(() => fallbackProducts);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [visible, setVisible] = useState<boolean[]>(() => new Array(fallbackProducts.length).fill(true));
  const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    let mounted = true;
    fetch("https://fakestoreapi.com/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        if (!Array.isArray(data) || data.length === 0) return;
        setProducts(data);
        setFilteredProducts(data);
        setVisible(new Array(data.length).fill(true));
      })
      .catch(() => {
        // keep fallbackProducts
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.getAttribute("data-index"));
          setVisible((prev) => {
            const copy = [...prev];
            copy[idx] = true;
            return copy;
          });
        }
      });
    }, { threshold: 0.25 });

    cardsRef.current.forEach((c) => { if (c) obs.observe(c); });
    return () => obs.disconnect();
  }, [filteredProducts]);

  useEffect(() => {
    let result = products;
    if (search.trim() !== "") {
      result = result.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== "") {
      result = result.filter((p) => p.category === category);
    }
    setFilteredProducts(result);
  }, [search, category, products]);

  return (
    <>
      <Navbar />

      <Box
        className="pageFade"
        sx={{
          backgroundColor: "#e6ddc4",
          minHeight: "100vh",
          px: 6,
          py: 6,
        }}
      >
        <Typography sx={{ fontSize: 48, fontWeight: 900, textAlign: 'center', mb: 4 }}>Shop</Typography>

        <Box sx={{ width: '85%', maxWidth: 950, mx: 'auto', mb: 6, p: 3, background: '#f3ebd9', border: '2px solid #000', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: 12, fontSize: 16, borderRadius: 8, border: '2px solid #000' }} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: 12, fontSize: 16, borderRadius: 8, border: '2px solid #000' }}>
            <option value="">All Categories</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="jewelery">Jewelery</option>
            <option value="electronics">Electronics</option>
          </select>
        </Box>

        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={6}>
          {filteredProducts.length === 0 ? (
            <Typography>No products found.</Typography>
          ) : (
            filteredProducts.map((p, i) => (
              <Box key={p.id ?? i} sx={{ width: { xs: '100%', sm: '48%', md: '30%' } }}>
                <Box
                  ref={(el) => { cardsRef.current[i] = el as HTMLDivElement | null; }}
                  data-index={i}
                  onClick={() => navigate(`/product/${p.id}`)}
                  sx={{ cursor: 'pointer', opacity: visible[i] ? 1 : 0, transform: visible[i] ? 'translateY(0)' : 'translateY(30px)', transition: `all .6s ease ${i * 0.06}s` }}
                >
                  <Box sx={{ height: 320, background: '#faf5eb', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', mb: 2 }}>
                    <img src={p.image} alt={p.title} style={{ height: '85%', width: 'auto', objectFit: 'contain' }} />
                  </Box>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>{p.title.split(' ').slice(0,3).join(' ')}</Typography>
                  <Typography sx={{ color: '#444', mb: 1, height: 40, overflow: 'hidden' }}>{p.description}</Typography>
                  <Typography sx={{ textAlign: 'right', fontWeight: 600 }}>${p.price}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Footer />
    </>
  );
}
