"use client";

import { Box, Grid, Skeleton, Paper, Stack } from "@mui/material";

export default function ProductDetailsSkeleton() {
  return (
    <Box
      sx={{
        background: "#EEE5DA",       // full-page coffee background
        minHeight: "100vh",
        p: 3,
      }}
    >
      <Grid container spacing={4}>
        {/* LEFT SIDE */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              background: "#F7ECE2",
              borderRadius: 3,
              border: "1px solid #D4B8A6",
            }}
          >
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{
                borderRadius: 2,
                bgcolor: "#E0CBB3", // warm latte skeleton
              }}
            />

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {[1, 2, 3, 4].map((n) => (
                <Skeleton
                  key={n}
                  variant="rectangular"
                  width={80}
                  height={60}
                  sx={{
                    borderRadius: 1,
                    bgcolor: "#D9C1A5",
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid item xs={12} md={6}>
          <Skeleton
            variant="text"
            width="60%"
            height={45}
            sx={{ bgcolor: "#C7A78A" }}
          />

          <Skeleton
            variant="text"
            width="30%"
            height={30}
            sx={{ mt: 1, bgcolor: "#D9C1A5" }}
          />

          <Skeleton
            variant="rectangular"
            height={120}
            sx={{
              mt: 3,
              borderRadius: 2,
              bgcolor: "#E0CBB3",
            }}
          />

          <Skeleton
            variant="rectangular"
            width={180}
            height={45}
            sx={{
              mt: 3,
              borderRadius: 2,
              bgcolor: "#C7A78A",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
