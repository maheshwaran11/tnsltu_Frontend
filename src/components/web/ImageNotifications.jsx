import React, { useEffect, useState } from "react";
import { Container, Box, Card, Typography } from "@mui/material";
import Slider from "react-slick";

// ⚙️ Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  autoplay: true,
  autoplaySpeed: 4000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
};

export default function NotificationSlider({ notificationsList }) {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(notificationsList);
  }, [notificationsList]);

  return (
    <Container maxWidth={false} sx={{ my: 6, display: "flex", justifyContent: "center" }}>
      <Box sx={{ width: "100%",  px: {} }}>
        {/* 🔔 Header */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#2e7d32",
              position: "relative",
              display: "inline-block",
              px: 2,
              fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.7rem" },
            }}
          >
            Highlights
            <Box
              sx={{
                height: 4,
                width: "50%",
                background: "linear-gradient(90deg, #2196f3, #21cbf3)",
                borderRadius: 2,
                mx: "auto",
                mt: 1,
              }}
            />
          </Typography>
        </Box>

        {/* 🎞️ Slider */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 6,
            overflow: "hidden",
            p: { xs: 1, sm: 2 },
            height: { xs: 300, sm: 400, md: 500 },
          }}
        >
          
          <Slider {...sliderSettings}>
            {notifications?.map((note) => (
              <Box key={note.id} sx={{ textAlign: "center" }}>
                <img
                  src={note.image_url}
                  alt={note.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "360px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    mt: 2,
                    color: "text.primary",
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                  }}
                >
                  {note.title}
                </Typography>
              </Box>
            ))}
          </Slider>
        </Card>
      </Box>
    </Container>
  );
}
