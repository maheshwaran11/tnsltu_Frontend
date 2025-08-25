import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Link,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../assets/images/Logo1.jpg";
import { contactDetails } from "../../data/locations";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const menuItems = [
    { label: "Home", href: "./home" },
    { label: "About Us", href: "./about" },
    { label: "Services", href: "./services" },
    { label: "Contact", href: "./contact" },
  ];

  // Mobile Drawer Content
  const drawer = (
    <Box sx={{ width: 260, p: 2 }}>
      {/* Logo + Close */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <a href="./home"><img src={logo} alt="Logo" style={{ height: 40 }} /></a>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Navigation Links */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component="a" href={item.href} onClick={handleDrawerToggle}>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "1rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          href="./login"
          variant="contained"
          sx={{
            borderRadius: 6,
            fontWeight: 600,
            bgcolor: "var(--color-primary)",
            "&:hover": { bgcolor: "var(--color-secondary)" },
          }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          href="./enquiry"
          sx={{
            borderRadius: 6,
            fontWeight: 600,
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
            "&:hover": { bgcolor: "var(--color-primary)", color: "white" },
          }}
        >
          Enquiry
        </Button>
      </Box>
    </Box>
  );

  return (
    <header>
      {/* Top Header */}
      <Box sx={{ bgcolor: "var(--color-primary)", color: "white", py: 1 }}>
        <Container
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography variant="body2">Welcome to TNSLTU</Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-end" },
            }}
          >
            <Link
              href={`mailto:${contactDetails.email[0]}`}
              color="inherit"
              underline="none"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <EmailIcon fontSize="small" /> {contactDetails.email[0]}
            </Link>

            <Link
              href={`tel:${contactDetails.phone[0]}`}
              color="inherit"
              underline="none"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <PhoneIcon fontSize="small" /> {contactDetails.phone[0]}
            </Link>

            <Link
              href={`tel:${contactDetails.phone[1]}`}
              color="inherit"
              underline="none"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <PhoneIcon fontSize="small" /> {contactDetails.phone[1]}
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Logo & Titles */}
      <Box sx={{ py: 0, borderBottom: "1px solid #eee" }}>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <a href="./home"><img src={logo} alt="Logo" style={{ height: 150 }} /></a>
          </Box>

          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              flex: 1,
            }}
            className="header-title"
          >
            {contactDetails.name}
            <span className="reg_no_text">Reg No: {contactDetails.reg_no}</span>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: { xs: "center", md: "right" },
            }}
            className="header-right-title"
          >
            TNSLTU
          </Typography>
        </Container>
      </Box>

      {/* Navigation Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "var(--color-warning)",
          color: "text.primary",
          borderBottom: "1px solid #eee",
        }}
      >
        <Container>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Desktop Menu */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  sx={{
                    fontSize: "1rem",
                    color: "text.primary",
                    textTransform: "none",
                    fontWeight: 500,
                    "&:hover": { color: "var(--color-primary)" },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Right-side Desktop Buttons */}
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
              <Button
                href="./login"
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: 6,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  bgcolor: "var(--color-primary)",
                  boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                  "&:hover": {
                    bgcolor: "var(--color-secondary)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                href="./enquiry"
                sx={{
                  textTransform: "none",
                  borderRadius: 6,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                  "&:hover": {
                    bgcolor: "var(--color-primary)",
                    color: "white",
                  },
                }}
              >
                Enquiry
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              sx={{ display: { md: "none" } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>
    </header>
  );
}
