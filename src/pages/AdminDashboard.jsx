import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  AppBar,
  ListItemIcon,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,

  Divider
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import MoneyIcon from "@mui/icons-material/AttachMoney";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ContactMailIcon from "@mui/icons-material/ContactMail";
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';

import { useAuth } from '../store';
import AllUsers from './../components/AllUsers';
import { useNavigate } from 'react-router-dom';
import UserStats from '../components/UserStats';
import AdminProfile from './AdminProfile';
import AllIdCards from '../components/AllIdCards';
import AllFamilyMembers from '../components/AllFamilyMembers';
import AllClaims from '../components/AllClaims';
import AllEnquiries from '../components/AllEnquiries';
import AllNotifications from '../components/AllNotifications';
import AllDocuments  from '../components/AllDocuments';
import { ContactMail, EditLocation, Money } from '@mui/icons-material';

const drawerWidth = 240;
const baseUrl = "https://tnsltu.in/api/";

function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('user-stats');
  const { profile, setProfile } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { key: "user-stats", label: "Dashboard", icon: <AnalyticsIcon /> },
    { key: "profile", label: "Profile", icon: <AccountCircleIcon /> },
    { key: "all-users", label: "All Users", icon: <GroupIcon /> },
    { key: "family-members", label: "Family Members", icon: <GroupIcon /> },
    { key: "id-cards", label: "ID Cards", icon: <BadgeIcon /> },
    { key: "claims", label: "Claims", icon: <MoneyIcon /> },
    { key: "enquiries", label: "Enquiries", icon: <ContactMailIcon /> },
    { key: "notifications", label: "Notifications", icon: <NotificationsIcon /> },
    { key: "documents", label: "Documents", icon: <FileCopyIcon /> },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.key}>
          <ListItem
            button
            key={item.key}
            selected={selectedPage === item.key}
            className={`menu-item ${selectedPage === item.key ? 'active' : ''}`}
            onClick={() => setSelectedPage(item.key)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
          {item.key === "claims" && <Divider sx={{ my: 3 }} />}
        </React.Fragment>
        ))}

        <Divider sx={{ my: 3 }} />

        <ListItem button onClick={() => {
          localStorage.removeItem('token');
          setProfile(null);
          navigate('/login');
        }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar position="fixed" sx={{ zIndex: 1300, bgcolor: 'var(--color-primary)' }} >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap component="div">
              <a href='https://tnsltu.in'>TNSLTU</a>
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{ width: 40, height: 40, bgcolor: 'primary.main', border: '2px solid white' }}
              src={baseUrl + profile?.profile_photo || undefined}
            >
              {profile?.username?.[0]?.toUpperCase() || <PersonIcon fontSize="large" />}
            </Avatar>
            {profile?.user_type && (
              
              <Typography variant="body1" sx={{ fontSize: '0.9rem', color: 'white' }}>
                <a onClick={() => setSelectedPage('profile')} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>{profile?.username} - {profile.user_type}</a> {profile.user_type !== 'admin' && profile?.district ? `- ${profile.district}` : ''}
              </Typography>
            )}
            <IconButton
            variant="outlined"
              edge="end"
              ListItemText="Logout"
              LineIcon={<LogoutIcon />}
              onClick={() => {
                localStorage.removeItem('token');
                setProfile(null);
                navigate('/login');
              }}
              color="inherit"
            >
              <Typography variant="body1" sx={{ fontSize: '1.1rem', color: 'white', mr: 1 }}>Logout</Typography>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for desktop */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f4f6f8',
          mt: 8,
          height: 'calc(100vh - 64px)', // 64px is AppBar height
          overflow: 'auto',             // Enable inner scroll
          px: 2, pt: 3, pb: 6
        }}
      >
        {selectedPage === 'all-users' && <AllUsers />}
        {selectedPage === 'user-stats' && <UserStats />}
        {selectedPage === 'profile' && <AdminProfile />}
        {selectedPage === 'id-cards' && <AllIdCards />}
        {selectedPage === 'family-members' && <AllFamilyMembers />}
        {selectedPage === 'claims' && <AllClaims />}
        {selectedPage === 'enquiries' && <AllEnquiries />}
        {selectedPage === 'notifications' && <AllNotifications />}
        {selectedPage === 'documents' && <AllDocuments />}
      </Box>
    </Box>
  );
}

export default AdminDashboard;
