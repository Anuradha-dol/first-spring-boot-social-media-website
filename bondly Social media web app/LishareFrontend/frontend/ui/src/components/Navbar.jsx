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
  Avatar,
} from "@mui/material";
import {
  Home as HomeIcon,
  Person,
  RateReview,
  Support,
  Notifications,
  People,
  DynamicFeed,
  KeyboardArrowDown,
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
      elevation={0}
      sx={{
        py: 1,
        px: 2,
        bgcolor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid #dde5f0",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 1, sm: 2 } }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          {/* Brand */}
          <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: "200px" }}>
            <IconButton
              onClick={() => navigate("/home")}
              sx={{
                color: "#2563eb",
                bgcolor: alpha("#2563eb", 0.1),
                "&:hover": { bgcolor: alpha("#2563eb", 0.2) },
              }}
            >
              <DynamicFeed />
            </IconButton>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                color: "#2563eb",
                cursor: "pointer",
                letterSpacing: "0.5px",
              }}
              onClick={() => navigate("/home")}
            >
              Bondly
            </Typography>
          </Box>

          {/* Nav Links */}
          <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="center" sx={{ flexGrow: 1 }}>
            {navLinks.map(({ label, icon, path }) => {
              const active = pathname === path;
              return (
                <Button
                  key={path}
                  startIcon={icon}
                  onClick={() => navigate(path)}
                  sx={{
                    color: active ? "#e91e63" : "#555",
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.85rem",
                    px: { xs: 1.5, md: 2 },
                    py: 0.75,
                    borderRadius: "8px",
                    bgcolor: active ? alpha("#e91e63", 0.1) : "transparent",
                    border: active ? `1px solid ${alpha("#e91e63", 0.2)}` : "1px solid transparent",
                    "&:hover": {
                      color: "#e91e63",
                      bgcolor: alpha("#e91e63", 0.05),
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Stack>

          {/* Profile Section */}
          <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: "200px", justifyContent: "flex-end" }}>
            {/* Vertical Divider */}
            <Box sx={{ width: "1px", height: "30px", bgcolor: "#dde5f0" }} />
            
            <Button
              endIcon={<KeyboardArrowDown sx={{ color: "#888" }} />}
              sx={{
                textTransform: "none",
                color: "#333",
                fontWeight: 600,
                p: 0.5,
                pr: 1,
                borderRadius: "24px",
                "&:hover": { bgcolor: alpha("#000", 0.04) },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#3b82f6",
                  fontSize: "14px",
                  fontWeight: 600,
                  mr: 1,
                }}
              >
                A
              </Avatar>
              <Typography variant="body2" fontWeight={600} sx={{ mr: 0.5 }}>
                Anuradha
              </Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
}
