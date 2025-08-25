import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Marriage_Assistance_Claim from "./../../src/assets/docs/Marriage_Assistance_Claim.pdf";
import Marriage_Assistance_Claim_1 from "./../../src/assets/docs/Marriage_Assistance_Claim_1.pdf";
import Death_Claim from "./../../src/assets/docs/Death_Claim.pdf";
import Education_Claim from "./../../src/assets/docs/Education_Claim.pdf";
import Employment_Certificate from "./../../src/assets/docs/EmploymentCertificate.pdf";
import Eye_Class_Claim from "./../../src/assets/docs/Eye_Class_Claim.pdf";
import Maternity_Assistance_Claim from "./../../src/assets/docs/Maternity_Assistance_Claim.pdf";
import Auto_Claim from "./../../src/assets/docs/Auto_Claim.pdf";

const documents = [
  { title: "Marriage Assistance Claim", file: Marriage_Assistance_Claim },
  { title: "Marriage Assistance Claim 1", file: Marriage_Assistance_Claim_1 },
  { title: "Death Claim", file: Death_Claim },
  { title: "Education Claim", file: Education_Claim },
  { title: "Employment Certificate", file: Employment_Certificate },
  { title: "Eye Glass Claim", file: Eye_Class_Claim },
  { title: "Maternity Assistance Claim", file: Maternity_Assistance_Claim },
  { title: "Auto Claim", file: Auto_Claim },
];

const AllDocuments = () => {
  return (
    <Grid container spacing={3} padding={2}>
      {documents.map((doc, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ textAlign: "center", minHeight: "50px" }}
            >
              {doc.title}
            </Typography>

            {/* PDF Preview */}
            <embed
              src={doc.file}
              type="application/pdf"
              width="100%"
              height="300px"
              style={{ border: "1px solid #ddd", borderRadius: "4px" }}
            />

            <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
              <PictureAsPdfIcon sx={{ fontSize: 40, color: "red" }} />
            </CardContent>

            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                href={doc.file}
                download
              >
                Download
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default AllDocuments;
