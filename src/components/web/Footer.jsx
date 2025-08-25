import React from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
} from "@mui/material";

import { GridLegacy as Grid } from '@mui/material';
import { addresses, contactDetails } from "../../data/locations";


export default function FooterServices() {
  return (
    <Box sx={{ backgroundColor: "#1a1a1a", color: "#fff"}}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Address & Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{maxWidth: 250}}>
              {addresses.Headoffice}<br /><br />
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <a href={`tel:${contactDetails.phone[0]}`}>
                📞 {contactDetails.phone[0]}
                <br />
              </a>
              <a href={`tel:${contactDetails.phone[1]}`}>
                📞 {contactDetails.phone[1]}
                <br />
                <br />
              </a>
            </Typography>
            <Typography variant="body2">
              <a href={`mailto:${contactDetails.email[0]}`}>
                ✉️ {contactDetails.email[0]}
              </a>
              <br />
              <a href={`mailto:${contactDetails.email[1]}`}>
                ✉️ {contactDetails.email[1]}
              </a>
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="/about" color="inherit" underline="hover">
                About Us
              </Link>
              <Link href="/services" color="inherit" underline="hover">
                Services
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
              <Link href="/login" color="inherit" underline="hover">
                Login
              </Link>
            </Box>
          </Grid>

          {/* Map */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Find Us
            </Typography>
            <Box sx={{ borderRadius: 2, overflow: "hidden" }}>
              <iframe
                title="Google Map"
                src={contactDetails.mapLocation}
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Box>
          </Grid>
        </Grid>

        {/* Divider & Copyright */}
        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 4 }} />
        <Typography variant="body2" align="center" sx={{ pb: 3 }}>
          © {new Date().getFullYear()} <Link href="/">TNSLTU</Link>. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
