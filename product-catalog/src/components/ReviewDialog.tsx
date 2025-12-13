import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Rating,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useReviews } from "../context/ReviewContext";

type Props = {
  productId: number | null;
  open: boolean;
  onClose: () => void;
};

export default function ReviewDialog({ productId, open, onClose }: Props) {
  const { addReview } = useReviews();

  // ✅ FIX: rating starts as null
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // ✅ Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setRating(null);
      setComment("");
      setError("");
    }
  }, [open]);

  const submit = () => {
    if (!productId) return;

    // ✅ REQUIRE rating
    if (rating === null) {
      setError("Please select a star rating.");
      return;
    }

    addReview(productId, {
      rating,
      comment: comment.trim(),
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
    >
      <DialogTitle>Write a Review</DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <Rating
            value={rating}
            onChange={(_, v) => setRating(v)}
            size="large"
          />
        </Box>

        {error && (
          <Typography color="error" variant="body2" mb={1}>
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Your feedback (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
