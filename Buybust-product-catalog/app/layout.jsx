"use client";

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  Box
} from "@mui/material";

import Navbar from "./components/Navbar";
import { CartProvider } from "./components/CartProvider";
import { ToastProvider } from "./components/ToastProvider";
import { AuthProvider } from "./components/AuthProvider";
import { usePathname } from "next/navigation";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" }
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 }
  }
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isHomePage =
    pathname === "/" ||
    pathname === "" ||
    pathname === undefined;

  const isProductsPage = pathname?.startsWith("/products");
  const isOrdersPage = pathname?.startsWith("/orders");
  const isLoginPage = pathname?.startsWith("/login");
  const isRegisterPage = pathname?.startsWith("/register");

  // ⭐ All full-screen pages
  const isFullWidth =
    isHomePage ||
    isProductsPage ||
    isOrdersPage ||
    isLoginPage ||
    isRegisterPage;

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <ToastProvider>
            <CartProvider>
              <AuthProvider>

                <Navbar />

                {isFullWidth ? (
                  <Box
                    component="main"
                    sx={{
                      width: "100vw",
                      maxWidth: "100vw",
                      minHeight: "calc(100vh - 64px)",
                      overflow: "visible",
                      position: "relative",
                      p: 0,
                      m: 0
                    }}
                  >
                    {children}
                  </Box>
                ) : (
                  <Container component="main" sx={{ mt: 4, mb: 6 }}>
                    {children}
                  </Container>
                )}

              </AuthProvider>
            </CartProvider>
          </ToastProvider>

        </ThemeProvider>
      </body>
    </html>
  );
}
