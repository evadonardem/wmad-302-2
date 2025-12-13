import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  IconButton,
  Stack,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SelectAddressDialog from "./SelectAddressDialog";
import { useOrders } from "../context/OrderContext";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCart } from "../context/CartContext";
import { useNotification } from "../context/NotificationContext";
import { useUser } from "../context/UserContext";

type Props = {
  open: boolean;
  onClose: () => void;
  goToOrders: () => void;
};

export default function CartDrawer({
  open,
  onClose,
  goToOrders,
}: Props) {
  const { cart, clearCart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const { addNotification } = useNotification();
  const { user } = useUser();

  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  const { placeOrder } = useOrders();
  const [addressOpen, setAddressOpen] = useState(false);

  const checkout = () => {
    if (!cart.length) return;
    // Open address/payment dialog before placing order
    setAddressOpen(true);
  };

  const handlePlaceOrder = (address: any, payment: { method: string; reference?: string | null }) => {
    // Place an order for each cart item
    cart.forEach((item: any, idx: number) => {
      placeOrder({
        id: Date.now() + idx,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        quantity: item.quantity,
        date: new Date().toLocaleString(),
        status: "Placed",
        address,
        paymentMethod: payment?.method,
        paymentReference: payment?.reference ?? null,
      });
    });

    addNotification("🛒 Order placed successfully!");
    clearCart();
    setAddressOpen(false);
    onClose();
    goToOrders();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 320, boxSizing: 'border-box', overflowX: 'hidden' } }}>
      <Box sx={{ width: '100%', p: 2, overflowX: 'hidden', overflowY: 'auto', boxSizing: 'border-box' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={900} sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            Cart
          </Typography>
          <Avatar src={user?.profilePic} sx={{ width: 40, height: 40, border: '2px solid rgba(0,0,0,0.08)' }}>
            {user?.name?.slice(0,1)}
          </Avatar>
        </Box>

        <Divider sx={{ my: 1 }} />

        {cart.length === 0 && (
          <Typography color="text.secondary" sx={{ wordBreak: 'break-word' }}>
            No items in cart
          </Typography>
        )}

        {cart.map((item: any) => (
          <Box key={item.id} sx={{ mb: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar variant="square" src={item.thumbnail} sx={{ width: 64, height: 64, borderRadius: 1, flexShrink: 0 }} />

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography fontWeight={600} noWrap sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ${item.price.toFixed(2)} • <strong>{item.quantity}</strong>
                </Typography>
              </Box>

              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
                <IconButton size="small" onClick={() => decreaseQty(item.id)}>
                  <RemoveIcon fontSize="small" />
                </IconButton>

                <Typography>{item.quantity}</Typography>

                <IconButton size="small" onClick={() => increaseQty(item.id)}>
                  <AddIcon fontSize="small" />
                </IconButton>

                <IconButton size="small" onClick={() => removeFromCart(item.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        ))}

        <Divider sx={{ my: 1 }} />

        <Typography fontWeight={900}>
          Total: ${total.toFixed(2)}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          disabled={cart.length === 0}
          onClick={checkout}
        >
          Checkout
        </Button>
      </Box>

      {/* ADDRESS & PAYMENT DIALOG */}
      <SelectAddressDialog
        open={addressOpen}
        onClose={() => setAddressOpen(false)}
        onSelect={(addr: any, payment: any) => handlePlaceOrder(addr, payment)}
      />
    </Drawer>
  );
}
