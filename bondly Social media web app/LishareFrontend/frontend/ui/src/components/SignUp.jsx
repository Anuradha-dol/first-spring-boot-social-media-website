// src/components/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import api from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [activeStep, setActiveStep] = useState(0); // UI step only

  const steps = ["Personal Info", "Contact Details", "Secure Account"];

  const [form, setForm] = useState({
    firstname: "",
    lastName: "",
    email: "",
    tempEmail: "",
    phoneNumber: "",
    password: "",
    role: "ROLE_USER",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (activeStep < 2) setActiveStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await api.post("/auth/register", form);

      if (res.data.success) {
        setMessage({ type: "success", text: res.data.message });
        setTimeout(() => {
          navigate("/verify");
        }, 1500);
      } else {
        setMessage({ type: "error", text: res.data.message });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 1.5,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: 3,
            borderRadius: 1,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #dde5f0",
            backdropFilter: "blur(12px)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 2,
              color: "#1e3a8a", // deep blue
            }}
          >
            Explore & Join 🌍
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  sx={{
                    "& .MuiStepLabel-label": {
                      color:
                        index === 0
                          ? "#2563eb"
                          : index === 1
                          ? "#ec4899"
                          : "#fcd34d",
                      fontWeight: 500,
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {message && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstname"
                  margin="normal"
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  margin="normal"
                  onChange={handleChange}
                  required
                />
              </>
            )}

            {activeStep === 1 && (
              <>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  margin="normal"
                  type="email"
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  label="Temporary Email (Optional)"
                  name="tempEmail"
                  margin="normal"
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  margin="normal"
                  onChange={handleChange}
                  required
                />
              </>
            )}

            {activeStep === 2 && (
              <>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  margin="normal"
                  type="password"
                  onChange={handleChange}
                  required
                />
              </>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2.5 }}>
              {activeStep > 0 && (
                <Button
                  variant="outlined"
                  onClick={handlePrevStep}
                  sx={{
                    borderColor: "#2563eb",
                    color: "#2563eb",
                    "&:hover": { borderColor: "#1d4ed8", color: "#1d4ed8" },
                  }}
                >
                  Back
                </Button>
              )}

              {activeStep < 2 ? (
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  sx={{
                    background: "linear-gradient(45deg, #2563eb, #ec4899)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1d4ed8, #db2777)",
                    },
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    py: 1.25,
                    borderRadius: 1,
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #2563eb, #ec4899)",
                    color: "#fff",
                    "&:hover": {
                      background: "linear-gradient(45deg, #1d4ed8, #db2777)",
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Start Your Journey"
                  )}
                </Button>
              )}
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
