"use client";

import type { PropsWithChildren } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#146356",
    },
    secondary: {
      main: "#f0a33e",
    },
    background: {
      default: "#f4f0e8",
      paper: "#fffaf1",
    },
    text: {
      primary: "#1b140f",
      secondary: "#6a5a4e",
    },
  },
  shape: {
    borderRadius: 20,
  },
  typography: {
    fontFamily: "var(--font-space-grotesk)",
    h1: {
      fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
      lineHeight: 0.95,
      fontWeight: 700,
      letterSpacing: "-0.06em",
    },
    h2: {
      fontSize: "clamp(1.25rem, 2vw, 1.6rem)",
      lineHeight: 1.1,
      fontWeight: 700,
      letterSpacing: "-0.04em",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "0.95rem",
      lineHeight: 1.65,
    },
    overline: {
      fontFamily: "var(--font-ibm-plex-mono)",
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
});

export function MuiProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
