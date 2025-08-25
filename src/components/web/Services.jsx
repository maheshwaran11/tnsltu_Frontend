import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  GridLegacy as Grid,
  Button,
  Box,
} from "@mui/material";
import marriageImg from "../../assets/images/marriage.jpg";
import cardImg from "../../assets/images/card.jpg";
import educationImg from "../../assets/images/education.jpg";
import maternityImg from "../../assets/images/maternity.jpg";
import pensionImg from "../../assets/images/pension.jpg";
import specsImg from "../../assets/images/specs.jpg";
import familyPensionImg from "../../assets/images/family_pension.jpg";
import deathImg from "../../assets/images/natural_death.jpg";
import { FileCopyOutlined } from "@mui/icons-material";
import DocumentsDialog from "../DocumentsDialog";


const services = [
  { id: 1, tamilTitle: "கட்டுமான அட்டை புதிய பதிவு", englishTitle: "New Labour Card Register", img: cardImg },
  { id: 1, tamilTitle: "கட்டுமான அட்டை புதுபித்தல்", englishTitle: "Renewal Labour Card Register", img: cardImg },
  { id: 5, tamilTitle: "கல்வி உதவித்தொகை", englishTitle: "Education Claims", img: educationImg },
  { id: 2, tamilTitle: "திருமண உதவித்தொகை", englishTitle: "Marriage Assistance", img: marriageImg },
  { id: 3, tamilTitle: "மகப்பேறு உதவித்தொகை", englishTitle: "Maternity Assistance", img: maternityImg },
  { id: 1, tamilTitle: "கண்கண்ணாடி உதவித்தொகை", englishTitle: "Spectacle Assistance", img: specsImg },
  { id: 1, tamilTitle: "ஓய்வூதியம் / முடக்க ஓய்வூதியம்", englishTitle: "Pension / Disability Pension Assistance", img: pensionImg },
  { id: 1, tamilTitle: "குடும்ப ஓய்வூதியம் (கட்டுமான வாரியத்திற்கு மட்டும்)", englishTitle: "Family Pension Assistance (Applicable only Construction Workers Welfare Board Pensioners)", img: familyPensionImg },
  { id: 4, tamilTitle: "இயற்கை மரணம் மற்றும் ஈமச்சடங்கு", englishTitle: "Natural Death Assistance / Funeral Assistance", img: deathImg },
  { id: 4, tamilTitle: "விபத்து மரணம் / விபத்து ஊனம் / செயற்கை உறுப்புகள் / சக்கர நாற்காலி", englishTitle: "Accidental Death Assistance / Accidental Disability Assistance", img: deathImg },
  { id: 4, tamilTitle: "பணியிடத்து விபத்து மரணம் / விபத்து ஊனம் உதவித்தொகை (பதிவு பெற்ற மற்றும் பதிவு பெறாத கட்டுமானத் தொழிலாளர்களுக்கு மட்டும்)", englishTitle: "Work Site Accidental Death Assistance / Accidental Disability Assistance (Only for Registered and unregistered construction workers)", img: deathImg },
];

export default function Services({ limit }) {
  const displayedServices = limit ? services.slice(0, limit) : services;
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceID, setSelectedServiceID] = useState(null);

  return (
    <>
      <Box sx={{ p: 3, mb: 6 }} className="services-section container pt-5">
        <Typography
          variant="h4"
          sx={{ mb: 5, fontWeight: "bold", textAlign: "center", mt: 5 }}
        >
          எங்கள் சேவைகள் | Our Services
        </Typography>

        <Grid container spacing={3} alignItems="stretch">
          {displayedServices.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
              className="service-card"
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  textAlign: "center",
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <img src={service.img} alt={service.englishTitle} style={{ width: "100%", height: "auto", borderRadius: 3 }} />

                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "var(--color-primary)" }}
                  >
                    {service.tamilTitle}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 1, fontStyle: "italic", color: "text.secondary" }}
                  >
                    {service.englishTitle}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => {
                      setSelectedService(service);
                      setSelectedServiceID(service.id);
                    }}
                    startIcon={<FileCopyOutlined />}
                    sx={{
                      bgcolor: "var(--color-primary)"
                    }}
                  >
                    தேவையான ஆவணங்கள்
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <DocumentsDialog
        open={Boolean(selectedService)}
        onClose={() => setSelectedService(null)}
        serviceId={selectedServiceID}
      />
    </>
  );
}
