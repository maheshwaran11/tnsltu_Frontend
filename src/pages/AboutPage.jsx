import React from "react";
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
} from "@mui/material";
import Header from "../components/web/Header";
import WelcomeSection from "../components/web/WelcomeSection";
import CallToAction from "../components/web/CallToAction";
import Footer from "../components/web/Footer";

const features = [
  {
    title: "Fast Performance",
    description: "Experience blazing fast load times and smooth navigation.",
  },
  {
    title: "Responsive Design",
    description: "Looks great on desktop, tablet, and mobile devices.",
  },
  {
    title: "Easy Customization",
    description: "Built with flexibility in mind for easy updates.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <WelcomeSection />
      {/* <CallToAction /> */}



      <Footer />

     
    </>
  );
}
