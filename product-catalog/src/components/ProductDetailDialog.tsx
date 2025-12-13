import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  TextField,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RateReviewIcon from "@mui/icons-material/RateReview";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useCart } from "../context/CartContext";
import { useReviews } from "../context/ReviewContext";
import { useOrders } from "../context/OrderContext";
import { useUser } from "../context/UserContext";
import SelectAddressDialog from "./SelectAddressDialog";
import { useState } from "react";

export default function ProductDetailDialog({
  product,
  open,
  onClose,
  onWriteReview,
  goToOrders,
}: any) {
  const { addToCart } = useCart();
  const { reviews, addReply } = useReviews();
  const { placeOrder } = useOrders();
  const { user } = useUser();
  const addresses = user?.addresses || [];

  const productReviews = reviews[product.id] || [];

  const [replyText, setReplyText] = useState("");
  const [activeReply, setActiveReply] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [addressOpen, setAddressOpen] = useState(false);

  const toggleReplies = (i: number) => {
    setExpanded((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const submitReply = (reviewIndex: number) => {
    if (!replyText.trim()) return;
    addReply(product.id, reviewIndex, replyText);
    setReplyText("");
    setActiveReply(null);
  };

  // ✅ ✅ FIXED ORDER FLOW
  const orderNow = (address: any, payment: { method?: string; reference?: string | null } = {}) => {
    placeOrder({
      id: Date.now(),
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1,
      date: new Date().toLocaleString(),
      status: "Placed",
      address,
      paymentMethod: payment?.method,
      paymentReference: payment?.reference ?? null,
    });

    setAddressOpen(false);
    onClose();

    // ✅ ENSURE NAVIGATION HAPPENS AFTER STATE UPDATE
    setTimeout(() => {
      goToOrders();
    }, 0);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{product.title}</DialogTitle>

        <DialogContent>
          {/* ✅ PRODUCT IMAGE */}
          <Box
            component="img"
            src={product.thumbnail}
            alt={product.title}
            sx={{
              width: "100%",
              height: 250,
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
            }}
          />

          {/* PRICE */}
          <Typography variant="h6" fontWeight="bold" color="error">
            ${product.price}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* REVIEWS */}
          <Typography fontWeight="bold">Customer Reviews</Typography>

          {productReviews.length === 0 && (
            <Typography color="text.secondary">No reviews yet.</Typography>
          )}

          {productReviews.map((r, i) => (
            <Box key={i} mt={2}>
              <Rating value={r.rating} readOnly size="small" />
              <Typography>{r.comment || "No comment"}</Typography>
              <Typography variant="caption" color="text.secondary">
                {r.date}
              </Typography>

              {/* SHOW MORE / LESS */}
              {r.replies.length > 0 && (
                <Button size="small" onClick={() => toggleReplies(i)}>
                  {expanded.includes(i)
                    ? "Show less replies"
                    : `Show ${r.replies.length} replies`}
                </Button>
              )}

              {expanded.includes(i) &&
                r.replies.map((rep, idx) => (
                  <Box key={idx} ml={3} mt={1}>
                    <Typography variant="body2">↳ {rep.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {rep.date}
                    </Typography>
                  </Box>
                ))}

              {/* REPLY */}
              {activeReply === i ? (
                <Box mt={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button size="small" onClick={() => submitReply(i)}>
                    Submit
                  </Button>
                </Box>
              ) : (
                <Button size="small" onClick={() => setActiveReply(i)}>
                  Reply
                </Button>
              )}

              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </DialogContent>

        {/* ✅ ACTION BUTTONS */}
        <DialogActions>
          <Button
            startIcon={<RateReviewIcon />}
            onClick={() => {
              onClose();
              onWriteReview(product.id);
            }}
          >
            Write Review
          </Button>

          <Button
            startIcon={<ShoppingCartIcon />}
            onClick={() =>
              addToCart({
                id: product.id,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail,
                quantity: 1,
              })
            }
          >
            Add to Cart
          </Button>

          <Button
            variant="contained"
            startIcon={<LocalShippingIcon />}
            disabled={!addresses.length}
            onClick={() => setAddressOpen(true)}
          >
            Order Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ ADDRESS SELECTION */}
      <SelectAddressDialog
        open={addressOpen}
        onClose={() => setAddressOpen(false)}
        onSelect={orderNow}
      />
    </>
  );
}
