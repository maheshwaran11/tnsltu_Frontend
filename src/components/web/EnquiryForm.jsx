import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Person, Phone, LocationOn, Message, Work, Email } from "@mui/icons-material";
import { addEnquiry } from "../../api"; 
import { districts, taluks } from "./../../data/locations";

export default function EnquiryForm() {
  const services = ["education", "marriage", "old_age_pension", "others"];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    taluk: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setErrors({ ...errors, [field]: "" }); // clear error when typing
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.district) newErrors.district = "District is required";
    if (!form.taluk) newErrors.taluk = "Taluk is required";
    if (!form.service) newErrors.service = "Service is required";
    if (!form.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await addEnquiry(form);

      if ([200, 201].includes(response.status)) {
          setSnackbar({
            open: true,
            message: "✅ Enquiry submitted successfully!",
            type: "success",
          });
          } else {
            setSnackbar({
              open: true,
              message: response.message || 'Something went wrong.',
              type: "error",
            });
          }
          
      // reset form
      setForm({
        name: "",
        phone: "",
        email: "",
        district: "",
        taluk: "",
        service: "",
        message: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `❌ ${err.message}`,
        type: "error",
      });
    }
  };


  
  return (
    <Box
      sx={{
        py: 0,
        minHeight: "100vh",
        // bgcolor: "#f5f5f5", // solid background (no gradient)
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 5,
            backgroundColor: "#fff",
            boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 700, mb: 4, color: "primary.main" }}
          >
            ✨ Join Us
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {/* Row 1: Name + Phone */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                required
                label="Your Name"
                value={form.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                required
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                error={!!errors.phone}
                helperText={errors.phone}
                inputProps={{ maxLength: 10 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                required
                label="Email"
                value={form.email}
                onChange={handleChange("email")}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>


            {/* Row 2: District + Taluk */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}
            >
              <TextField
                select
                fullWidth
                required
                label="District"
                value={form.district}
                onChange={(e) =>
                  setForm({ ...form, district: e.target.value, taluk: "" })
                }
                error={!!errors.district}
                helperText={errors.district}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              >
                {districts.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                required
                label="Taluk"
                value={form.taluk}
                onChange={handleChange("taluk")}
                disabled={!form.district}
                error={!!errors.taluk}
                helperText={errors.taluk}
              >
                {(taluks[form.district] || []).map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Row 3: Service */}
            <TextField
              select
              fullWidth
              required
              label="Service Required"
              value={form.service}
              onChange={handleChange("service")}
              error={!!errors.service}
              helperText={errors.service}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                ),
              }}
            >
              {services.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </MenuItem>
              ))}
            </TextField>

            {/* Row 4: Message */}
            <TextField
              fullWidth
              required
              label="Additional Message"
              multiline
              rows={3}
              value={form.message}
              onChange={handleChange("message")}
              error={!!errors.message}
              helperText={errors.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Message />
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              🚀 Submit Enquiry
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Snackbar for success/fail */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
