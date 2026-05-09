// src/components/Navbar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
  alpha,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person,
  RateReview,
  Support,
  Notifications,
  People,
  DynamicFeed,
} from "@mui/icons-material";

const navLinks = [
  { label: "Home",          icon: <HomeIcon />,      path: "/home" },
  { label: "Profile",       icon: <Person />,        path: "/profile" },
  { label: "Reviews",       icon: <RateReview />,    path: "/review" },
  { label: "Support",       icon: <Support />,       path: "/supportUser" },
  { label: "Alerts",        icon: <Notifications />, path: "/notifications" },
  { label: "Friends",       icon: <People />,        path: "/friend" },
];

export default function Navbar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <Paper
      elevation={6}
      sx={{
        py: 1,
        px: 2,
        background: "linear-gradient(90deg, #0f172a 0%, #1e1b4b 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        boxSizing: "border-box",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={2}
        >
          {/* Brand */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton
              onClick={() => navigate("/home")}
              sx={{ 
                color: "#00f6ff",
                background: "rgba(0, 246, 255, 0.1)",
                backdropFilter: "blur(4px)",
                "&:hover": { background: "rgba(0, 246, 255, 0.2)" }
              }}
            >
              <DynamicFeed />
            </IconButton>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                background: "linear-gradient(to right, #00f6ff, #5d9cec)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
                letterSpacing: "0.5px"
              }}
              onClick={() => navigate("/home")}
            >
              Bondly
            </Typography>
          </Box>

          {/* Nav Links */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {navLinks.map(({ label, icon, path }) => {
              const active = pathname === path;
              return (
                <Button
                  key={path}
                  startIcon={icon}
                  onClick={() => navigate(path)}
                  sx={{
                    color: active ? "#fff" : "rgba(255,255,255,0.6)",
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.85rem",
                    px: { xs: 1.5, md: 2 },
                    py: 0.8,
                    borderRadius: "12px",
                    background: active ? "rgba(255,255,255,0.1)" : "transparent",
                    border: active ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                    boxShadow: active ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                    "&:hover": {
                      color: "#fff",
                      background: "rgba(255,255,255,0.05)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "& .MuiButton-startIcon": {
                      color: active ? "#00f6ff" : "inherit",
                    }
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>
        </Box>
      </Container>
    </Paper>
  );
}
