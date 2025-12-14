"use client";

import {
  Drawer,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { useCart } from "./CartProvider";

export default function CartDrawer({ open, onClose }) {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, p: 2 }}>
        <Typography variant="h6">Your Cart</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {totalItems} items
        </Typography>

        {items.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <List>
            {items.map((it) => (
              <ListItem key={it.id} alignItems="flex-start" sx={{ mb: 1 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    src={it.thumbnail}
                    alt={it.title}
                    sx={{ width: 64, height: 64 }}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="subtitle1">{it.title}</Typography>
                      <Typography variant="subtitle2">
                        ₱{it.price * it.quantity}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        ₱{it.price} × {it.quantity}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <TextField
                          size="small"
                          type="number"
                          inputProps={{ min: 1 }}
                          value={it.quantity}
                          onChange={(e) =>
                            updateQuantity(it.id, parseInt(e.target.value))
                          }
                          sx={{ width: 80 }}
                        />

                        <Button color="error" onClick={() => removeFromCart(it.id)}>
                          Remove
                        </Button>
                      </Box>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">₱{totalPrice}</Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button variant="contained" fullWidth href="/checkout">
            Checkout
          </Button>
          <Button variant="outlined" color="inherit" onClick={clearCart}>
            Clear
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
