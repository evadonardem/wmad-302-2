import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Link,
} from "@mui/material";

export default function HelpDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Help & Support</DialogTitle>
      <DialogContent>
        <Typography mb={1}>
          Need help? Here are some ways we can assist you.
        </Typography>

        <Typography variant="subtitle2" fontWeight={700} mt={1}>
          Frequently Asked Questions
        </Typography>
        <Typography mb={1} variant="body2">
          Check our FAQs on the docs portal for common questions.
        </Typography>

        <Typography variant="subtitle2" fontWeight={700} mt={1}>
          Contact Support
        </Typography>
        <Typography mb={1} variant="body2">
          Email us: <Link href="mailto:support@shopez.example">support@shopez.example</Link>
        </Typography>

        <Typography variant="subtitle2" fontWeight={700} mt={1}>
          Live Chat
        </Typography>
        <Typography mb={1} variant="body2">
          Use the built-in chat for urgent questions.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
