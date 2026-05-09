import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  TextField,
  IconButton,
  Drawer,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme,
  Avatar,
  Rating,
  Zoom,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { motion, useAnimation, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import PeopleIcon from "@mui/icons-material/People";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoginIcon from "@mui/icons-material/Login";
import Chatbot from "./Chatbot";
import "./LandingPage.css";

// ========== STYLED COMPONENTS ==========
const GlassCard = styled(Card)(() => ({
  background: "rgba(255,255,255,0.88)",
  backdropFilter: "blur(14px)",
  borderRadius: 8,
  boxShadow: "0 14px 34px rgba(23,32,51,0.1)",
  border: "1px solid rgba(221,229,240,0.95)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  height: "100%",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 18px 42px rgba(233,30,99,0.14)",
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: "76vh",
  display: "flex",
  alignItems: "center",
  background: `linear-gradient(90deg, ${alpha("#f8fafc", 0.94)} 0%, ${alpha("#f8fafc", 0.82)} 48%, ${alpha("#eaf3ff", 0.72)} 100%), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: theme.spacing(4, 0),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(180deg, transparent 76%, rgba(245,247,251,0.98) 100%)",
  },
}));

const StyledButton = styled(Button)(() => ({
  borderRadius: 8,
  padding: "10px 22px",
  textTransform: "none",
  fontWeight: 700,
  boxShadow: "none",
  fontSize: "0.98rem",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 24px rgba(233,30,99,0.22)",
  },
}));

const FeatureIconWrapper = styled(Box)(({ theme }) => ({
  width: "56px",
  height: "56px",
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #e91e63 0%, #2563eb 100%)",
  color: "#fff",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  fontSize: "1.75rem",
  boxShadow: "0 12px 24px rgba(37,99,235,0.18)",
}));

const StatBox = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(3),
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 12px 34px rgba(23,32,51,0.08)",
  border: "1px solid #dde5f0",
}));

const ReviewCard = styled(Card)(() => ({
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 12px 34px rgba(23,32,51,0.08)",
  transition: "all 0.2s ease",
  height: "100%",
  border: "1px solid #dde5f0",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 18px 42px rgba(37,99,235,0.14)",
  },
}));

// ========== ANIMATION VARIANTS ==========
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  // ========== REVIEWS ==========
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:9091/reviews");
        const data = await res.json();
        setReviews(data);
      } catch {
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const fallbackTestimonials = [
    { username: "Alex Johnson", rating: 5, comment: "Bondly has completely changed how I connect with friends. The feed is so engaging!", createdAt: new Date().toISOString() },
    { username: "Maria Garcia", rating: 5, comment: "I love sharing photos and seeing what my friends are up to. It's like Instagram but better!", createdAt: new Date().toISOString() },
    { username: "James Smith", rating: 4, comment: "Great community features. The chat and reactions are spot on.", createdAt: new Date().toISOString() },
    { username: "Emily Davis", rating: 5, comment: "Finally a platform that values real connections. Highly recommended!", createdAt: new Date().toISOString() },
    { username: "Michael Brown", rating: 5, comment: "The privacy controls are excellent. I feel safe sharing here.", createdAt: new Date().toISOString() },
    { username: "Sophia Wilson", rating: 4, comment: "Love the design and the ability to follow friends and influencers.", createdAt: new Date().toISOString() },
  ];

  const displayReviews = reviews.length > 0 ? reviews : fallbackTestimonials;

  // ========== SCROLL ANIMATIONS ==========
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });

  const featuresControls = useAnimation();
  const statsControls = useAnimation();
  const testimonialsControls = useAnimation();

  useEffect(() => {
    if (isFeaturesInView) featuresControls.start("visible");
    if (isStatsInView) statsControls.start("visible");
    if (isTestimonialsInView) testimonialsControls.start("visible");
  }, [isFeaturesInView, isStatsInView, isTestimonialsInView]);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We'll get back to you soon.");
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleLogin = () => navigate("/login");

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", overflowX: "hidden" }}>
      {/* ========== NAVBAR ========== */}
      <AppBar
        position="sticky"
        component={motion.div}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 10px 28px rgba(23,32,51,0.08)",
          color: "#333",
          borderBottom: "1px solid #dde5f0",
        }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <FavoriteIcon sx={{ mr: 1, color: "#e91e63" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#2563eb", letterSpacing: 0 }}>
              Bondly
            </Typography>
          </Box>
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
              <Button color="inherit" href="#features" sx={{ color: "#333", fontWeight: 500 }}>Features</Button>
              <Button color="inherit" href="#testimonials" sx={{ color: "#333", fontWeight: 500 }}>Testimonials</Button>
              <Button color="inherit" href="#contact" sx={{ color: "#333", fontWeight: 500 }}>Contact</Button>
              <Button color="inherit" onClick={() => setPrivacyOpen(true)} sx={{ color: "#333", fontWeight: 500 }}>Privacy</Button>
              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={handleLogin}
                sx={{
                  ml: 2,
                  borderRadius: 2,
                  borderColor: "#e91e63",
                  color: "#e91e63",
                  fontWeight: 600,
                  px: 2,
                  "&:hover": { borderColor: "#c2185b", background: alpha("#e91e63", 0.04) },
                }}
              >
                Login
              </Button>
            </Box>
          )}
          {isMobile && (
            <IconButton edge="end" color="inherit">
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* ========== HERO ========== */}
      <HeroSection>
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.55rem", md: "3.55rem" },
                    lineHeight: 1.1,
                    color: "#172033",
                    mb: 2,
                  }}
                >
                  Connect, Share,
                  <br />
                  <Box component="span" sx={{ color: "#e91e63" }}>
                    Grow Together
                  </Box>
                </Typography>
                <Typography variant="h6" paragraph sx={{ color: "#64748b", fontWeight: 400, maxWidth: 520 }}>
                  Bondly is your new social space – share moments, discover friends, and be part of a vibrant community.
                </Typography>
                <StyledButton
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate("/signup")}
                  sx={{
                    mt: 2,
                    bgcolor: "#e91e63",
                    "&:hover": { bgcolor: "#c2185b" },
                  }}
                >
                  Join Now
                </StyledButton>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" // Friends laughing outdoors
                  alt="Friends enjoying life outdoors"
                  sx={{
                    width: "100%",
                    maxWidth: 520,
                    borderRadius: 2,
                    boxShadow: "0 18px 42px rgba(23,32,51,0.18)",
                    display: "block",
                    margin: "0 auto",
                    border: "1px solid rgba(255,255,255,0.72)",
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      {/* ========== STATS ========== */}
      <Container ref={statsRef} sx={{ py: 6 }}>
        <motion.div variants={staggerContainer} initial="hidden" animate={statsControls}>
          <Grid container spacing={2} justifyContent="center">
            {[
              { value: "1M+", label: "Active Users" },
              { value: "50M+", label: "Posts Shared" },
              { value: "98%", label: "User Satisfaction" },
            ].map((stat, idx) => (
              <Grid item xs={12} sm={4} key={idx}>
                <motion.div variants={fadeInUp}>
                  <StatBox>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: "#e91e63", mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </StatBox>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* ========== FEATURES ========== */}
      <Container id="features" ref={featuresRef} sx={{ py: 5 }}>
        <motion.div variants={staggerContainer} initial="hidden" animate={featuresControls}>
          <Typography
            variant="h2"
            align="center"
            sx={{ fontWeight: 700, color: "#172033", mb: 1, letterSpacing: 0 }}
          >
            Why Bondly?
          </Typography>
          <Typography variant="h6" align="center" sx={{ color: "#64748b", mb: 4, fontWeight: 400 }}>
            Discover the tools that make socializing fun and meaningful
          </Typography>
          <Grid container spacing={2}>
            {[
              { icon: <ShareIcon />, title: "Share Moments", desc: "Post photos, updates, and stories to share with friends and family." },
              { icon: <PeopleIcon />, title: "Connect with Friends", desc: "Follow friends, see what they're up to, and build your network." },
              { icon: <FavoriteIcon />, title: "Express Yourself", desc: "React with emojis, comment, and engage in conversations." },
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div variants={fadeInUp}>
                  <GlassCard>
                    <CardContent sx={{ textAlign: "center", p: 2.5 }}>
                      <FeatureIconWrapper>{feature.icon}</FeatureIconWrapper>
                      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: "#333" }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </GlassCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* ========== TESTIMONIALS ========== */}
      <Box id="testimonials" ref={testimonialsRef} sx={{ py: 6, bgcolor: "#eef6ff" }}>
        <Container>
          <motion.div variants={staggerContainer} initial="hidden" animate={testimonialsControls}>
            <Typography
              variant="h2"
              align="center"
              sx={{ fontWeight: 700, color: "#172033", mb: 1, letterSpacing: 0 }}
            >
              User Reviews
            </Typography>
            <Typography variant="h6" align="center" sx={{ color: "#64748b", mb: 4, fontWeight: 400 }}>
              Real feedback from our community
            </Typography>

            {loading ? (
              <Typography align="center" sx={{ color: "#666" }}>Loading reviews...</Typography>
            ) : error ? (
              <Typography align="center" color="error">{error}</Typography>
            ) : (
              <Grid container spacing={2}>
                {displayReviews.slice(0, 6).map((review, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Zoom in timeout={500 + index * 100}>
                      <ReviewCard>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Avatar sx={{ bgcolor: "#2196f3", mr: 2 }}>
                              {review.username?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#333" }}>
                                {review.username}
                              </Typography>
                              <Rating value={review.rating} readOnly size="small" sx={{ color: "#e91e63" }} />
                            </Box>
                          </Box>
                          <Typography variant="body2" sx={{ mb: 2, color: "#64748b" }}>
                            "{review.comment}"
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            {new Date(review.createdAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </ReviewCard>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </Container>
      </Box>

      {/* ========== FOOTER ========== */}
      <Box component="footer" sx={{ bgcolor: "#172033", color: "#fff", py: 4 }}>
        <Container>
          <Grid container spacing={4} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FavoriteIcon sx={{ mr: 1, color: "#e91e63" }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#2196f3" }}>
                  Bondly
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                © {new Date().getFullYear()} All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <IconButton color="inherit" href="#" sx={{ color: "#e91e63" }}><FacebookIcon /></IconButton>
                <IconButton color="inherit" href="#" sx={{ color: "#e91e63" }}><TwitterIcon /></IconButton>
                <IconButton color="inherit" href="#" sx={{ color: "#e91e63" }}><LinkedInIcon /></IconButton>
                <IconButton color="inherit" href="#" sx={{ color: "#e91e63" }}><InstagramIcon /></IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "right" } }}>
              <Button color="inherit" onClick={() => setPrivacyOpen(true)} sx={{ mr: 2, color: "#e91e63" }}>Privacy Policy</Button>
              <Button color="inherit" href="#contact" sx={{ color: "#e91e63" }}>Contact</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Floating Chat Button */}
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}>
        <Fab color="primary" aria-label="chat" onClick={toggleDrawer(true)} sx={{ position: "fixed", bottom: 24, right: 24, bgcolor: "#e91e63", "&:hover": { bgcolor: "#c2185b" } }}>
          <ChatIcon />
        </Fab>
      </motion.div>

      {/* Chatbot Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: isMobile ? "100vw" : 400, height: "100%" }}>
          <Chatbot />
        </Box>
      </Drawer>

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} PaperProps={{ sx: { bgcolor: "#fff", color: "#333", borderRadius: 4 } }}>
        <DialogTitle sx={{ color: "#e91e63" }}>Privacy Policy</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#666" }}>
            At Bondly, we value your privacy. This policy outlines how we collect, use, and protect your information. We do not share your personal data with third parties without your consent. For more details, please contact us.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyOpen(false)} sx={{ color: "#2196f3" }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
