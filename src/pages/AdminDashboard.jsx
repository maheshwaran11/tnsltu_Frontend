import React, { useEffect, useState, useRef, use } from 'react';
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
  Tooltip,
  Badge,
  Popper,
  Paper,
  ClickAwayListener,
  ListItemAvatar,
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
import { CardTravel, ContactMail, EditLocation, Money, Padding } from '@mui/icons-material';
// import AllNoticeDocuments from '../components/AllNoticeDocuments';
import OrderComponent from '../components/OrderComponent';
import AdminOrderList from '../components/AdminOrderList';
import AdminUserReports from '../components/AdminUsersReport';
import { getUpcomingNotifications } from '../api';
import logo from '../assets/images/Logo1.jpg';

const drawerWidth = 240;
const baseUrl = "https://tnsltu.in/api/";

function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [selectedPage, setSelectedPage] = useState('user-stats');
  const { profile, setProfile } = useAuth();
  const anchorRef = useRef(null);
  const navigate = useNavigate();

// 🔹 Role-based menu items
  const menuItems = React.useMemo(() => {
    if (!profile?.user_type) return [];

    const common = [
      { key: "user-stats", label: "Dashboard", icon: <AnalyticsIcon /> },
      { key: "profile", label: "Profile", icon: <AccountCircleIcon /> },
    ];

    const adminOnly = [
      { key: "all-users", label: "All Users", icon: <GroupIcon /> },
      { key: "family-members", label: "Family Members", icon: <GroupIcon /> },
      { key: "id-cards", label: "ID Cards", icon: <BadgeIcon /> },
      { key: "claims", label: "Claims", icon: <MoneyIcon /> },
      { key: "enquiries", label: "Enquiries", icon: <ContactMailIcon /> },
      { key: "notifications", label: "Notifications", icon: <NotificationsIcon /> },
      { key: "documents", label: "Documents", icon: <FileCopyIcon /> },
      // { key: "notice-documents", label: "Notice Documents", icon: <FileCopyIcon /> },
      { key: "admin-orders", label: "Admin Orders", icon: <CardTravel /> },
      { key: "admin-user-reports", label: "Admin User Reports", icon: <CardTravel /> },
    ];

    const districtAdminOnly = [
      { key: "all-users", label: "All Users", icon: <GroupIcon /> },
      { key: "family-members", label: "Family Members", icon: <GroupIcon /> },
      { key: "id-cards", label: "ID Cards", icon: <BadgeIcon /> },
      { key: "claims", label: "Claims", icon: <MoneyIcon /> },
      { key: "enquiries", label: "Enquiries", icon: <ContactMailIcon /> },
      { key: "documents", label: "Documents", icon: <FileCopyIcon /> },
      { key: "orders", label: "Orders", icon: <CardTravel /> },
    ];

    const talukAdminOnly = [
      { key: "all-users", label: "All Users", icon: <GroupIcon /> },
      { key: "family-members", label: "Family Members", icon: <GroupIcon /> },
      // { key: "id-cards", label: "ID Cards", icon: <BadgeIcon /> },
      // { key: "claims", label: "Claims", icon: <MoneyIcon /> },
      // { key: "enquiries", label: "Enquiries", icon: <ContactMailIcon /> },
      { key: "documents", label: "Documents", icon: <FileCopyIcon /> },
      { key: "orders", label: "Orders", icon: <CardTravel /> },
    ];

    const userOnly = [
      { key: "family-members", label: "Family Members", icon: <GroupIcon /> },
      { key: "id-cards", label: "ID Cards", icon: <BadgeIcon /> },
      { key: "claims", label: "Claims", icon: <MoneyIcon /> },
      { key: "documents", label: "Documents", icon: <FileCopyIcon /> },
    ];

    switch (profile.user_type) {
      case "admin":
        return [...common, ...adminOnly];
      case "district_admin":
        return [...common, ...districtAdminOnly];
      case "taluk_admin":
        return [...common, ...talukAdminOnly];
      case "district_subadmin":
        return [...common, ...districtAdminOnly];
      case "user":
        return [...common, ...userOnly];
      default:
        return common;
    }
  }, [profile]);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const fetchUpcomingNotifications = async () => {
    try {
      const response = await getUpcomingNotifications();
      console.log("Upcoming notifications:", response);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching upcoming notifications:", error);
    }
  };

  useEffect(() => {
    fetchUpcomingNotifications();
  }, []);

  const handleToggle = () => setNotificationOpen((prev) => !prev);
  const handleClose = () => setNotificationOpen(false);

  const drawer = (
    <>
      <Toolbar />
      <List sx={{ paddingTop: 3 }}>
        {menuItems.map((item) => (
          <React.Fragment key={item.key}>
          <ListItem
            button
            key={item.key}
            selected={selectedPage === item.key}
            className={`menu-item ${selectedPage === item.key ? 'active' : ''}`}
            onClick={() => {
              setSelectedPage(item.key);
              if (isMobile) setMobileOpen(false); // 👈 close drawer on mobile
            }}
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
              <a href='https://tnsltu.in'>
              <img src={logo} alt="TNSLTU Logo" style={{ height: 80, verticalAlign: 'middle', marginRight: 8, borderRadius: '40px' }} />
              TNSLTU
              </a>
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <>
              {/* 🔔 Notification Button */}
              <Tooltip title="Notifications">
                <IconButton ref={anchorRef} color="inherit" onClick={handleToggle}>
                  <Badge badgeContent={notifications?.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* 🔹 Notification Popper */}
              <Popper
                open={notificationOpen}
                anchorEl={anchorRef.current}
                placement="bottom-end"
                style={{ zIndex: 1300 }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <Paper elevation={3} sx={{ width: 300, mt: 1 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ p: 1 }}>
                      Renewal Notifications
                    </Typography>
                    {notifications?.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No notifications
                      </Typography>
                    ) : (
                      <List dense>
                        {notifications?.map((n) => (
                          <ListItem key={n.id} divider sx={{ p: 1 }}>
                            {/* Profile Photo */}
                            <ListItemAvatar>
                              <Avatar
                              sx={{ width: 40, height: 40, bgcolor: 'primary.main', border: '2px solid white' }}
                                src={baseUrl + n.profile_photo}
                                alt={n.username}
                              />
                              
                            </ListItemAvatar>

                            {/* Username + Renewal Info */}
                            <ListItemText
                              primary={
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                  }}
                                >
                                  {/* Left → Username */}
                                  <Typography variant="body2" fontWeight="bold">
                                    {n.username}
                                  </Typography>

                                  {/* Middle → Renewal Date */}
                                  {/* <Typography variant="caption" color="text.secondary">
                                    {n.next_renewal_date}
                                  </Typography> */}

                                  {/* Right → Days Left */}
                                  <Typography
                                    variant="body2"
                                    color={n.days_left <= 7 ? "error.main" : "warning.main"}
                                  >
                                    {n.days_left} days left
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {/* {n.name} • {n.card_number} */}
                                  {n.next_renewal_date}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </Paper>
                </ClickAwayListener>
              </Popper>
            </>



            <Avatar
              sx={{ width: 40, height: 40, bgcolor: 'primary.main', border: '2px solid white' }}
              src={baseUrl + profile?.profile_photo || undefined}
            >
              {profile?.username?.[0]?.toUpperCase() || <PersonIcon fontSize="large" />}
            </Avatar>
            {profile?.user_type && (
              
              <Typography variant="body1" sx={{ fontSize: '0.9rem', color: 'white' }} className='profile-link'>
                <a onClick={() => setSelectedPage('profile')} style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>{profile?.username} - {profile.user_type}</a> {profile.user_type !== 'admin' && profile?.district ? `- ${profile.district}` : ''} {profile.user_type  == 'taluk_admin' && profile?.taluk ? `- ${profile.taluk}` : ''}
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
        {/* {selectedPage === 'notice-documents' && <AllNoticeDocuments />} */}

        {selectedPage === 'orders' && <OrderComponent />}
        {selectedPage === 'admin-orders' && <AdminOrderList />}
        {selectedPage === 'admin-user-reports' && <AdminUserReports />}
      </Box>
    </Box>
  );
}

export default AdminDashboard;
