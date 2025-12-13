import { createTheme } from "@mui/material/styles";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#1565c0", // deep blue
      },
      secondary: {
        main: "#1e88e5", // lighter blue
      },
      background: {
        default: "#1565c0",
        paper: mode === "dark" ? "#111a2e" : "#ffffff",
      },
      text: {
        primary: "#ffffff",
        secondary: "rgba(255,255,255,0.85)",
      },
    },
    typography: {
      fontFamily: "Inter, Roboto, Arial",
      h4: { fontWeight: 900 },
      h6: { fontWeight: 800 },
      button: { textTransform: "none", fontWeight: 700 },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background:
              "linear-gradient(90deg, #1565c0 0%, #1e88e5 100%)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            color: '#fff',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            color: '#0f1724',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 18,
            boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
            transition: "all .18s ease",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
            },
            color: '#0f1724',
          },
        },
      },
      MuiCardContent: {
        styleOverrides: {
          root: {
            color: '#0f1724',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: '#0f1724',
          },
          input: {
            color: '#0f1724',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            color: '#0f1724',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: '#0f1724',
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: '#0f1724',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            paddingLeft: 18,
            paddingRight: 18,
          },
        },
      },
    },
  });
