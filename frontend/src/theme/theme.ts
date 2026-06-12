import { createTheme } from "@mui/material/styles";

/* ---------------------------
    Shared palette
---------------------------- */
const basePalette = {
  primary: {
    main: "#1E88E5",
    light: "#6AB7FF",
    dark: "#005CB2",
    contrastText: "#FFFFFF",
  },
  secondary: {
    main: "#FFC107",
    light: "#FFD54F",
    dark: "#FFA000",
    contrastText: "#000000",
  },
};

/* ---------------------------
    Shared typography
---------------------------- */
const typography = {
  fontFamily: "Roboto, Arial, sans-serif",
  h1: { fontWeight: 700, letterSpacing: "-0.5px" },
  h2: { fontWeight: 700, letterSpacing: "-0.25px" },
  h3: { fontWeight: 500 },
  h4: { fontWeight: 500 },
  h5: { fontWeight: 500 },
  h6: { fontWeight: 500 },
  body1: { fontWeight: 400 },
  body2: { fontWeight: 400 },
  button: { fontWeight: 500 },
};

/* ---------------------------
    Shared components
---------------------------- */
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        textTransform: "none" as const,
        fontWeight: 600,
        boxShadow: "none",
      },
      containedPrimary: {
        "&:hover": {
          backgroundColor: "#005CB2",
          boxShadow: "none",
        },
      },
      containedSecondary: {
        color: "#000",
        "&:hover": {
          backgroundColor: "#FFA000",
          boxShadow: "none",
        },
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        border: "1px solid rgba(0,0,0,0.06)",
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1E88E5",
        },
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: "#0F172A !important",
        borderRight: "none",
        "& .MuiListItemIcon-root": {
          color: "#94A3B8",
        },
        "& .MuiTypography-root": {
          color: "#E2E8F0",
        },
        "& .MuiButtonBase-root:hover": {
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        "& .MuiButtonBase-root.RaMenuItemLink-active": {
          backgroundColor: "#1E88E5",
          "& .MuiListItemIcon-root": {
            color: "#FFFFFF",
          },
        },
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: {
      ".RaList-actions, .RaList-actions .MuiToolbar-root": {
        backgroundColor: "transparent !important",
      },
    },
  },
};

/* ---------------------------
    Table color tokens
---------------------------- */
const getTableColors = (mode: "light" | "dark") => ({
  border:
    mode === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid #e5e7eb",
  headerBg: mode === "dark" ? "#1E1E1E" : "#f8fafc",
  headerText: mode === "dark" ? "#E0E0E0" : "#111827",
});

/* ---------------------------
    Light Theme
---------------------------- */
export const lightTheme = createTheme({
  shape: {
    borderRadius: 10,
  },
  palette: {
    ...basePalette,
    mode: "light",
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#212121",
      secondary: "#616161",
    },
  },
  typography,
  components: {
    ...components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#1E1E1E",
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => {
          const colors = getTableColors(theme.palette.mode);
          return {
            padding: "12px 16px",
            borderBottom: colors.border,
          };
        },
        head: ({ theme }) => {
          const colors = getTableColors(theme.palette.mode);
          return {
            backgroundColor: colors.headerBg,
            color: colors.headerText,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            fontSize: "0.75rem",
          };
        },
      },
    },
  },
});

/* ---------------------------
    Dark Theme
---------------------------- */
export const darkTheme = createTheme({
  shape: {
    borderRadius: 10,
  },
  palette: {
    ...basePalette,
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#242424",
    },
    text: {
      primary: "#E0E0E0",
      secondary: "#B0B0B0",
    },
  },
  typography,
  components: {
    ...components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1E1E1E",
          color: "#E0E0E0",
          boxShadow: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => {
          const colors = getTableColors(theme.palette.mode);
          return {
            padding: "12px 16px",
            borderBottom: colors.border,
          };
        },
        head: ({ theme }) => {
          const colors = getTableColors(theme.palette.mode);
          return {
            backgroundColor: colors.headerBg,
            color: colors.headerText,
            fontWeight: 700,
            textTransform: "uppercase" as const,
            fontSize: "0.75rem",
          };
        },
      },
    },
  },
});

export type AppTheme = typeof lightTheme;
