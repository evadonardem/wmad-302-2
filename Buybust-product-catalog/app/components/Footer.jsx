"use client";

import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: 6,
        py: 3,
        textAlign: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © {new Date().getFullYear()} BuyBust – All Rights Reserved
      </Typography>
    </Box>
  );
}
