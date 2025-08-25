import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Avatar,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Badge,
  Person,
  Work,
} from "@mui/icons-material";
import Header from "../components/web/Header";
import EnquiryForm from "../components/web/EnquiryForm";
import CallToAction from "../components/web/CallToAction";
import Footer from "../components/web/Footer";
import { getDistrictMembers } from "../api";
import { districts, contactDetails, addresses } from "../data/locations";

const baseURL = "https://tnsltu.in/api/";

export default function ContactPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState("");

  const fetchDistricts = async (districtName = "Virudhunagar") => {
    setLoading(true);
    try {
      const res = await getDistrictMembers(
        districtName === "All Districts" ? "" : districtName
      );
      if (res.status === 200) {
        setMembers(res.data || []);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Error fetching district members:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (district) {
      fetchDistricts(district);
    }
  }, [district]);

  // 🔹 Separate admins and subadmins
  const districtAdmins = members.filter((m) => m.user_type === "district_admin");
  const districtSubAdmins = members.filter(
    (m) => m.user_type === "district_subadmin"
  );

  // 🔹 Card Renderer
  const renderMemberCards = (list) => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      {list.length > 0 ? (
        list.map((member) => (
          <Grid item xs={12} md={6} lg={4} key={member.id} width={450}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                height: "100%",
                backgroundColor: "#ffffff",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                {/* Avatar and Name */}
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={
                      member.profile_photo ? baseURL + member.profile_photo : ""
                    }
                    alt={member.username}
                    sx={{
                      bgcolor: "var(--color-primary)",
                      width: 100,
                      height: 100,
                      mr: 2,
                    }}
                  >
                    {!member.profile_photo && <Person />}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {member.username}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      {member.user_type || "Member"}
                    </Typography>
                  </Box>
                </Box>

                {/* Details */}
                <Box display="flex" alignItems="center" mb={1}>
                  <Badge fontSize="small" sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body2">
                    ID: {member.member_id || member.id}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOn
                    fontSize="small"
                    sx={{ mr: 1, color: "error.main" }}
                  />
                  <Typography variant="body2">
                    {member.address || "No address"}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Work fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                  <Typography variant="body2">
                    District: {member.district}, {member.taluk}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Phone
                    fontSize="small"
                    sx={{ mr: 1, color: "secondary.main" }}
                  />
                  <Typography variant="body2">{member.phone}</Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <Email fontSize="small" sx={{ mr: 1, color: "info.main" }} />
                  <Typography variant="body2">{member.email}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 4, width: "100%" }}
        >
          No members found.
        </Typography>
      )}
    </Grid>
  );

  return (
    <>
      <Header />


<Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={1} sx={{ alignItems: "center" }}>
        {/* Left Column: Contact Details + Map */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="var(--color-primary)" gutterBottom sx={{ mb: 6 }}>
            Contact Us
          </Typography>

          {/* Address */}
          <Box display="flex" alignItems="start" mb={2} flexDirection="column">
            <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Head Office Address
              </Typography>
              <Typography variant="body1" sx={{maxWidth: 220, fontWeight: "bold"}}>
                {addresses.Headoffice}<br /><br />
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
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
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                <a href={`mailto:${contactDetails.email[0]}`}>
                  ✉️ {contactDetails.email[0]}
                </a><br />
                <a href={`mailto:${contactDetails.email[1]}`}>
                  ✉️ {contactDetails.email[1]}
                </a><br /><br />
              </Typography>
          </Box>

          

          {/* Embedded Map */}
          {/* <Box
            component="iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.123456!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267!2sTNSLTU!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="300px"
            style={{ border: 0, borderRadius: 8 }}
            allowFullScreen=""
            loading="lazy"
          /> */}
        </Grid>

        {/* Right Column: Enquiry Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <EnquiryForm />
        </Grid>
      </Grid>
    </Container>


      {/* District Members Section */}
      <Container sx={{ py: 6 }} className="contact-page district-members">
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "var(--color-primary)", mb: 4 }}
        >
          District Members
        </Typography>

        {/* 🔹 District Filter */}
        <Box display="flex" justifyContent="center" mb={4}>
          <TextField
            select
            label="Select District"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            sx={{ minWidth: 250 }}
          >
            <MenuItem key={"All Districts"} value={"All Districts"}>
              All Districts
            </MenuItem>
            {districts.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* District Admins */}
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "var(--color-secondary)", mt: 4 }}
            >
              District Admins
            </Typography>
            {renderMemberCards(districtAdmins)}

            {/* District Subadmins */}
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "var(--color-secondary)", mt: 6 }}
            >
              District Subadmins
            </Typography>
            {renderMemberCards(districtSubAdmins)}
          </>
        )}
      </Container>

      
      {/* <CallToAction /> */}
      <Footer />
    </>
  );
}
