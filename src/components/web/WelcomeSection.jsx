import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import AboutImage from "../../assets/slides/slide1.jpg"; // optional illustrative image

export default function AboutSection() {
  return (
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
          <Grid item xs={12} md={6}>
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

            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2, color: "var(--color-primary)" }}
            >
              Key Objectives:
            </Typography>

            <Box component="ul" sx={{ pl: 3, mb: 3 }}>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                கட்டுமான மற்றும் அமைப்புசாரா துறைகளில் பணியாற்றும் தொழிலாளர்களின் உரிமைகளை பாதுகாப்பது.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                தொழிலாளர்களுக்கான அடிப்படை நல வசதிகளை (மருத்துவம், ஓய்வு, கல்வி உதவி போன்றவை) பெற்றுத்தரப்படுகிறது.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                தொழிலாளர்களுக்கான அரசு மற்றும் தனியார் நலத் திட்டங்களைப் பற்றி விழிப்புணர்வு ஏற்படுத்துவது.
              </Typography>
              <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                தொழிலாளர்கள் இடையே ஒற்றுமை மற்றும் சகோதரத்துவ உணர்வை வளர்த்தல்.
              </Typography>
              <Typography component="li" variant="body1">
                தொழிலாளர் சட்டங்களைப் பற்றிய பயிற்சி, சட்ட உதவி மற்றும் வழிகாட்டல் வழங்குவது.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ color: "var(--color-text)" }}>
              இந்த சங்கம் அனைத்து இன, மத, மொழி, சமூகங்களைச் சேர்ந்த தொழிலாளர்களையும் 
              ஒருங்கிணைக்கும் ஒரு ஐக்கிய வலையமைப்பாக செயல்படுகிறது.
            </Typography>
          </Grid>

          {/* Image Column */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={AboutImage}
              alt="About TNSLTU"
              sx={{
                width: "100%",
                borderRadius: 3,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
