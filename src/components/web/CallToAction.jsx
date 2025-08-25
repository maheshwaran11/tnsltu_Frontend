import React from "react";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Link,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallIcon from "@mui/icons-material/Call";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const CallToAction = () => {
  return (
    <Box
      id="cta"
      sx={{
        py: { xs: 6, md: 8 },
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            background: "white",
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
            textAlign: "center",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0px 12px 28px rgba(0,0,0,0.15)",
            },
          }}
        >
          {/* Heading */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: "var(--color-primary)",
              letterSpacing: "0.8px",
            }}
          >
            தொழிலாளர் நல வாரிய பதிவு
          </Typography>
          <Typography variant="subtitle1" color="var(--color-text)" sx={{ mb: 4 }}>
            புதிய உறுப்பினர் பதிவு மற்றும் அட்டை புதுப்பித்தல் ஆன்லைன் மூலம்
            நடைபெறுகிறது
          </Typography>

          {/* Document list */}
          <Typography variant="h6" gutterBottom>
            தேவையான ஆவணங்கள்:
          </Typography>
          <List>
            {[
              "ஆதார் கார்டு / Aadhaar Card",
              "ஸ்மார்ட் கார்டு / Smart Card",
              "வாக்காளர் அடையாள அட்டை / Voter ID",
              "பேங்க் பாஸ் புக் / Bank Account Book",
              "போட்டோ - 3 / 3 Photos",
            ].map((doc, index) => (
              <ListItem
                key={index}
                sx={{
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={doc} />
              </ListItem>
            ))}
          </List>

          {/* Action buttons */}
          <Box mt={4}>
            <Typography gutterBottom fontWeight={600}>
              மேலும் விவரங்களுக்கு தொடர்பு கொள்ளவும்:
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="primary"
                href="tel:+917845352155"
                size="large"
                startIcon={<CallIcon />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  boxShadow: 2,
                  bgcolor: "var(--color-primary)",

                  "&:hover": {
                    boxShadow: 4,
                    backgroundColor: "var(--color-secondary)",
                  },
                }}
              >
                Call Now
              </Button>
              <Button
                variant="outlined"
                color="success"
                href="https://wa.me/917845352155"
                size="large"
                startIcon={<WhatsAppIcon />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  borderWidth: 2,
                  "&:hover": {
                    backgroundColor: "#e8f5e9",
                    borderColor: "success.main",
                  },
                }}
              >
                WhatsApp
              </Button>
            </Stack>
          </Box>

          {/* Divider text */}
          <Typography
            variant="h6"
            align="center"
            mt={5}
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            (OR)
          </Typography>

          {/* Secondary action link */}
          <Typography align="center" mt={2}>
            <Link
              href="./requiredDocuments"
              underline="hover"
              color="secondary"
              fontWeight={600}
              sx={{
                transition: "0.2s",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              அனைத்து கேட்புமனுக்களுக்கான தேவையான ஆவணங்கள் பார்க்க
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CallToAction;
