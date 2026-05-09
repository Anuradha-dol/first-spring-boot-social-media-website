import { createTheme, alpha } from "@mui/material/styles";

const colors = {
  rose: "#e91e63",
  roseDark: "#c2185b",
  blue: "#2563eb",
  blueDark: "#1d4ed8",
  teal: "#0f9f9a",
  ink: "#172033",
  muted: "#64748b",
  page: "#f5f7fb",
  surface: "#ffffff",
  line: "#dde5f0",
};

const theme = createTheme({
  spacing: 6,
  shape: { borderRadius: 8 },
  palette: {
    mode: "light",
    primary: { main: colors.rose, dark: colors.roseDark, contrastText: "#fff" },
    secondary: { main: colors.blue, dark: colors.blueDark, contrastText: "#fff" },
    success: { main: colors.teal },
    background: { default: colors.page, paper: colors.surface },
    text: { primary: colors.ink, secondary: colors.muted },
    divider: colors.line,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 800, letterSpacing: 0 },
    h2: { fontWeight: 800, letterSpacing: 0 },
    h3: { fontWeight: 800, letterSpacing: 0 },
    h4: { fontWeight: 750, letterSpacing: 0 },
    h5: { fontWeight: 700, letterSpacing: 0 },
    h6: { fontWeight: 700, letterSpacing: 0 },
    button: { fontWeight: 700, letterSpacing: 0 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          background: colors.page,
          color: colors.ink,
          textRendering: "optimizeLegibility",
        },
      },
    },
    MuiContainer: {
      defaultProps: { maxWidth: "lg" },
      styleOverrides: {
        root: {
          paddingLeft: 18,
          paddingRight: 18,
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${colors.line}`,
          boxShadow: "0 12px 34px rgba(23, 32, 51, 0.08)",
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: `1px solid ${colors.line}`,
          boxShadow: "0 12px 34px rgba(23, 32, 51, 0.08)",
          backgroundImage: "none",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          "&:last-child": { paddingBottom: 16 },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 34,
          borderRadius: 8,
          textTransform: "none",
          padding: "7px 14px",
        },
        sizeSmall: {
          minHeight: 30,
          padding: "5px 10px",
          fontSize: "0.78rem",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: alpha(colors.surface, 0.92),
        },
        input: {
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          border: `1px solid ${colors.line}`,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: { minHeight: "56px !important" },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
        },
      },
    },
  },
});

export { colors };
export default theme;
