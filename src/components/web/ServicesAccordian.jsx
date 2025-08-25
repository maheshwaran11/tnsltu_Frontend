import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FooterServices() {
  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
        color: "#fff",
        py: 6,
        mt: 0,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.4)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            mb: 4,
            letterSpacing: "1px",
          }}
        >
          Our Services
        </Typography>

        {/* Construction */}
        <Accordion
          sx={{
            background: "#161616",
            color: "#fff",
            mb: 1,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
            <Typography fontWeight="bold">
              Construction Workers / கட்டுமானத் தொழிலாளர்கள்
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: 300, overflowY: "auto" }}>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              மரம் அல்லது கல் வெட்டுபவர், மிக்ஸர் டிரைவர், கிணற்றில் தூர் எடுப்பவர், கருமான்,
              கூரை வேய்பவர், தீயணைப்பு கருவிகள் பொருத்துதல், மேஸ்திரி, குளிரூட்டுதல் மற்றும்
              சூடுபடுத்துதல், கருமான் கொள்ளன், மின் தூக்கி, மரம் அறுப்பவர், சோலார் பேனல்,
              காவலாளி, சமையல் கூடம் அறைகலன், மொசைக் பாலிஞ், கான்கிரீட் பொருத்துதல்,
              சுரங்க வழி தோண்டுபவர், சாலை செப்பனிடுதல், ரோட்டரி, கல் உடைப்பவர், மண் வேலை,
              பொது பூங்கா, பிட்டர், எலக்ட்ரிஷியன், மெக்கானிக், கிணறு தோண்டுபவர், கூலியாள்,
              தார் ஜல்லி, வெல்டர், பாதுகாப்பு கதவுகள், சந்துகள் அடைத்தல், இரும்பு வேலை,
              கான்கிரீட் கலப்பவர், நீர் எடுக்கும் கட்டமைப்பு, பம்ப் ஆபரேட்டர், கார்பெட்,
              ரோலர் டிரைவர், கண்ணாடி வெட்டுதல், கலாசிஸ், சுண்ணாம்பு, கடல் அரிப்பு தடுப்பு,
              கல் பொடிப்பவர், அணை, பாலம், சாலை பராமரிப்பு, செங்கல் அடுக்குபவர், தச்சர்,
              செங்கல் சூளை தொழிலாளர்கள், பெயின்டர், பந்தல் கட்டுமானம்.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Manual Workers */}
        <Accordion
          sx={{
            background: "#161616",
            color: "#fff",
            mb: 1,
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
            <Typography fontWeight="bold">
              Manual Workers / உடல் உழைப்பு தொழிலாளர்கள்
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ maxHeight: 300, overflowY: "auto" }}>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              சாக்கு தைத்தல், அகர்பத்தி, சமையல் வாயு விநியோகம், பேனா எழுதுமுனை, மாவுமில்,
              அரிசி மில், அச்சு மற்றும் பிரிண்டிங், தனியார் பாதுகாவல், பிளாஸ்டிக் தொழில்,
              குப்பைகள் சேகரித்தல், கடைகள் சுமை ஏற்றுதல், மாட்டு வண்டி, தேங்காய் உரித்தல்,
              சலவை, முடி திருத்துதல், தையல், பாத்திரங்கள் தயாரித்தல், சிற்ப வேலை, கைவினைத்
              தொழில், பதனீர், மரம் ஏறும் தொழில், கைத்தறி பட்டு, தோல் பதனிடுதல், காலணி
              தயாரித்தல், ஓவியம், தங்க ஆபரணம், மண்பாண்டம், வீட்டு வேலைகள், மர வேலைகள்,
              வனப்பொருள் சேகரித்தல், சைக்கிள் ரிப்போ, சுருட்டு தயாரித்தல், முந்திரி தொழில்,
              புகைப்பட øளிப்பதிவு, ரிக்ஷா ஓட்டுதல், ஒலி øளி, பொறியியல், எலக்ட்ரானிக்
              பழுதுபார்த்தல், துணி மடித்தல், தானியங்களை கையாளுதல், உப்பளங்கள், படகு
              தயாரித்தல், கள் இறக்கும் தொழில், கயிறு, ஜவ்வரிசி, அப்பளம், சிந்தெடிக் ஜெம்,
              சாயப்பட்டறை, பட்டுப்புழு வளர்த்தல், விசைத்தறி, தெரு வியாபாரம், கடைகள்
              பணிபுரிதல், உணவு நிறுவனம், சமையல் வேலை.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Drivers */}
        <Accordion
          sx={{
            background: "#161616",
            color: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}>
            <Typography fontWeight="bold">
              Drivers & Automobile Workers / ஓட்டுநர்கள்
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              ஆட்டோ மொபைல் ஷாப், ஆட்டோ ஓட்டுனர், டாக்சி ஓட்டுனர்.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Footer bottom */}
        <Divider sx={{ borderColor: "#333", my: 3 }} />
        <Box textAlign="center">
          <Typography variant="body2" color="grey.500">
            © {new Date().getFullYear()} TNSLTU. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
