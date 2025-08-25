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
import ImageSlider from "../components/web/ImageSlider";
import Services from "../components/web/Services";
import WelcomeSection from "../components/web/WelcomeSection";
import CallToAction from "../components/web/CallToAction";
import Footer from "../components/web/Footer";
import ServiceListing from "../components/web/ServiceListing";

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

export default function ServicesPage() {
  return (
    <>
      <Header />



      <Services />
      
      <div  style={{ backgroundColor: "var(--color-warning)", padding: "4rem 0" }}>
      <ServiceListing />
      </div>


      


<CallToAction />
      


      <Footer />

     
    </>
  );
}
