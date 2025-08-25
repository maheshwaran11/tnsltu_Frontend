import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  GridLegacy as Grid,
  Card,
  CardContent,
} from "@mui/material";
import Header from "../components/web/Header";
import ImageSlider from "../components/web/ImageSlider";
import Services from "../components/web/Services";
import WelcomeSection from "../components/web/WelcomeSection";
import CallToAction from "../components/web/CallToAction";
import Footer from "../components/web/Footer";
import Notifications from "../components/web/Notifications";
import ImageNotifications from "../components/web/ImageNotifications";
import NotificationTicker from "../components/web/NotificationTicker";

import { getNotifications } from "../api";

export default function HomePage() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await getNotifications('');
            if (res.status === 200) {
              setNotifications(res.data || []);
            } else {
              setNotifications([]);
            }
          } catch (err) {
            console.error("Error fetching notifications:", err);
            setNotifications([]);
          } finally {
            setLoading(false);
          }
        };
      
        useEffect (() => {
          fetchNotifications();
        }, []);

        
  return (
    <>
      <Header />
      <ImageSlider />
<Box
      component="section"
      sx={{
        py: { xs: 6, md: 12 },
        backgroundColor: "#f9f9f9",
      }}
    >
      <Container maxWidth="lg">
      <Grid container spacing={6} alignItems="center">
          {/* Text Column */}
          <Grid item alignItems="center" textAlign="center">
            <Typography
              variant="h4"
              component="h2"
              fontWeight="bold"
              gutterBottom
              color="var(--color-primary)"
            >
              About TNSLTU
            </Typography>

            <Typography
              variant="body1"
              sx={{ mb: 3, color: "var(--color-text)", lineHeight: 1.8 }}
            >
              தமிழ்நாடு ஸ்ரீலிங்கா கட்டுமானம் மற்றும் அமைப்புசாரா தொழிலாளர் நல சங்கம் என்பது
              தமிழகத்தில் உள்ள கட்டுமானத் துறையிலும், அமைப்புசாரா துறையிலும் (Unorganised Sector) 
              பணியாற்றும் தொழிலாளர்களின் நலனை முன்னிறுத்தி 2019-ஆம் ஆண்டு உருவாக்கப்பட்ட 
              சமூக நல அமைப்பாகும்.
            </Typography>
            </Grid>
            </Grid>
            </Container>
          </Box>
      {/* <NotificationTicker /> */}


      <Box
      component="section"
      sx={{
        py: { xs: 6, md: 12 },
        backgroundColor: "",
      }}
    >
      <Container maxWidth="lg">
        <Grid spacing={3} className="container notifications-section">
          <Grid size={{ xs: 12, md: 6 }}>
            <Notifications notificationsList={notifications} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <ImageNotifications notificationsList={notifications} />
          </Grid>
        </Grid>
      </Container>
      </Box>

      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 2 },
          backgroundColor: "var(--color-warning)",
          mb: 4,
        }}
      >
          <Services limit={6} />
      </Box>
      <Footer />

     
    </>
  );
}
