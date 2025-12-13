import { Chip } from "@mui/material";
import { useEffect, useState } from "react";

export default function FlashSaleTimer() {
  const [time, setTime] = useState(7200); // 2 hours

  useEffect(() => {
    const t = setInterval(() => {
      setTime((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = time % 60;

  return (
    <Chip
      color="primary"
      label={`⚡ Flash Sale Ends In ${h}:${m
        .toString()
        .padStart(2, "0")}:${s.toString().padStart(2, "0")}`}
      sx={{ mb: 3, fontWeight: 900 }}
    />
  );
}
