import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CardHeader,
  Chip,
  Divider
} from "@mui/material";
import { motion } from "framer-motion";

import services_list from "./../../data/services_list.json";

const servicesData = services_list;
const categories = [
  { key: "ConstructionWorkersWB", label: "Construction Workers" },
  { key: "ManualWorkersWB", label: "Manual Workers" },
  { key: "DriversAutomobileWB", label: "Drivers & Automobile" },
];

const ServiceListing = () => {
const [tabIndex, setTabIndex] = useState(0);






  return (
    <div className="container">
      <Box sx={{ width: "100%", p: 3 }}>
        {/* Tabs Header */}
        <Typography
                variant="h4"
                sx={{ mb: 5, fontWeight: "bold", textAlign: "center", mt: 5 }}
              >
                சேவை வரையறைகள் | Our Categories
              </Typography>
        <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
                mb: 0,
                "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: 2,
                transition: "0.3s",
                "&:hover": {
                    backgroundColor: "var(--color-accent)",
                },
                },
                "& .Mui-selected": {
                color: "#ffffff !important",
                backgroundColor: "var(--color-primary)",
                },
                "& .MuiTabs-indicator": {
                height: 4,
                borderRadius: 2,
                backgroundColor: "var(--color-primary)",
                },
            }}
            >
            {categories.map((cat) => (
                <Tab
                key={cat.key}
                label={cat.label}
                />
            ))}
            </Tabs>


        {/* Tab Content */}
        {categories.map((cat, i) => (
          <Box
            key={cat.key}
            role="tabpanel"
            hidden={tabIndex !== i}
            sx={{ mt: 0 }}
          >
            {tabIndex === i && (
              <Grid container spacing={.2}>
                {servicesData[cat.key].map((service) => (
                  <Grid item xs={12} sm={6} md={4} key={service.code} sx={{ maxWidth: "100%", width: "100%" }}>
                    <Card
                      sx={{
                        borderRadius: 0,
                        boxShadow: 4,
                        transition: "0.3s",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                      }}
                    >
                      <CardContent sx={{ position: "relative", padding: 1, display: "flex", alignItems: "center", gap: 1  }}>
                        {/* Highlighted Code */}
                        {/* <Chip
                          label={service.sl_no}
                          color="#000"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                            backgroundColor: "var(--color-warning)",
                            position: "absolute",
                            right: 16,
                          }}
                        /> */}
                        <Chip
                          label={service.code}
                          color="primary"
                          sx={{
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                            backgroundColor: "var(--color-primary)",
                          }}
                        />

                        {/* Service Title */}
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold" }}
                        >
                          {service.tamil} / {service.english}
                        </Typography>

                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        ))}
      </Box>
    </div>
  );





};

export default ServiceListing;
