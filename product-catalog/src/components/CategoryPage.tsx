import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useState } from "react";

type Props = {
  onSelectCategory: (category: string) => void;
};

export default function CategoryPage({ onSelectCategory }: Props) {
  const [categories, setCategories] = useState([
    { label: "Electronics", value: "smartphones,laptops", emoji: "📱" },
    { label: "Fashion", value: "mens-shirts,womens-dresses", emoji: "👕" },
    { label: "Home", value: "home-decoration", emoji: "🏠" },
    { label: "Beauty", value: "skincare", emoji: "💄" },
    { label: "Groceries", value: "groceries", emoji: "🛒" },
    { label: "Accessories", value: "sunglasses,mens-watches,womens-watches", emoji: "🕶️" },
  ]);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newEmoji, setNewEmoji] = useState("");

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight={900} textAlign="center" mb={4}>
        Categories
      </Typography>

      <Box sx={{ display: "grid", gap: 3, justifyContent: "center", gridTemplateColumns: { xs: "repeat(1, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" } }}>
        {categories.map((cat) => (
          <Box key={cat.label}>
            <Card
              sx={{
                height: 140,
                borderRadius: 3,
                border: "1px solid rgba(25,118,210,0.35)",
                background:
                  "linear-gradient(180deg, rgba(227,242,253,0.9), #ffffff)",
              }}
            >
              <CardActionArea
                sx={{ height: "100%" }}
                onClick={() => onSelectCategory(cat.value)}
              >
                <CardContent
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Typography fontSize={28}>{cat.emoji}</Typography>
                  <Typography fontWeight={900}>
                    {cat.label}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>
      <Box mt={3} textAlign="center">
        <Button variant="outlined" onClick={() => setOpenAddDialog(true)}>
          Add Category
        </Button>
      </Box>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Label" sx={{ mt: 1 }} value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <TextField fullWidth label="Value (comma-separated)" sx={{ mt: 1 }} value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <TextField fullWidth label="Emoji" sx={{ mt: 1 }} value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button onClick={() => {
            const cat = { label: newLabel || newValue, value: newValue, emoji: newEmoji || "🔖" };
            setCategories((prev) => [...prev, cat]);
            setOpenAddDialog(false);
            onSelectCategory(cat.value);
            setNewLabel(""); setNewValue(""); setNewEmoji("");
          }} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
