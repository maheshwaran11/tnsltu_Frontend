import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useAuth } from '../store';
import { Person as PersonIcon } from '@mui/icons-material';
import { changePasswordAPI } from '../api';
import AddUserForm from '../components/AddUserForm';
import { t } from '../utils/i18n';


function AdminProfile() {
  const { profile, token, fetchProfile } = useAuth();
  if (!profile) return null;
  console.log("Profile Data:", profile);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(profile)

  const [lang, setLang] = useState('en');

  
  const [formData, setFormData] = useState({
    username: profile.username || '',
    email: profile.email || '',
    phone: profile.phone || '',
    address: profile.address || '',
    notes: profile.notes || ''
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const formatDate = (date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date));
  };

  const renderField = (label, value) => (
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      <Typography component="span" variant="subtitle2">{label}:</Typography> {value || '—'}
    </Typography>
  );

  // handle form updates
  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // submit handlers (replace with API calls later)
  const handleEditSubmit = () => {
    console.log("Updated Profile:", formData);
    setOpenEdit(false);
  };
  const handlePasswordSubmit = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert("New password & Confirm password do not match!");
      return;
    }
    try {
      // Call API to change password
      const res = await changePasswordAPI(passwordData, token);
      if (res.status === 200) {
        alert("Password changed successfully!");
      } else {
        alert("Error changing password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
    setOpenPassword(false);
  };

  const openEditDialog = (user) => {
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditUser(null);
    setOpenDialog(false);
    // fetchProfile();
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Admin Profile</Typography>
        <Box>
          <Button
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
            onClick={() => openEditDialog(profile)}
          >
            Edit Profile
          </Button>
          <Button
            size="small"
            variant="contained"
            // color="secondary"
            backgroundColor="var(--color-primary)"
            onClick={() => setOpenPassword(true)}
          >
            Change Password
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        {/* Top section */}
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            src={profile.profile_photo ? `https://tnsltu.in/api/${profile.profile_photo}` : ''}
          >
            {profile.name?.[0]?.toUpperCase() || <PersonIcon fontSize="large" />}
          </Avatar>

          <Box>
            <Typography variant="h6">{profile.name || 'N/A'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.email || 'No email'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {profile.user_type || 'N/A'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member ID: {profile.member_id || 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Grid layout */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {renderField('Date of Birth', profile.dob)}
            {renderField('Gender', profile.gender)}
            {renderField('Phone', profile.phone)}
            {renderField('Status', profile.status)}
          </Grid>

          <Grid item xs={12} sm={6}>
            {renderField('District', profile.district)}
            {renderField('Taluk', profile.taluk)}
            {renderField('State', profile.state)}
            {renderField('Zip Code', profile.zipcode)}
          </Grid>

          <Grid item xs={12}>
            {renderField('Address', profile.address)}
            {renderField('Notes', profile.notes || 'No additional notes')}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Timestamps */}
        <Typography variant="caption" color="text.secondary">
          Created: {formatDate(profile.created_at)} <br />
          Updated: {formatDate(profile.updated_at)}
        </Typography>
      </Paper>

      {/* --- Edit Profile Dialog --- */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editUser ? t('edit_user', lang) : t('add_user', lang)}</DialogTitle>
        <DialogContent>
          <AddUserForm initialData={editUser} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>

      {/* --- Change Password Dialog --- */}
      <Dialog open={openPassword} onClose={() => setOpenPassword(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            name="current"
            type="password"
            label="Current Password"
            fullWidth
            value={passwordData.current}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="new"
            type="password"
            label="New Password"
            fullWidth
            value={passwordData.new}
            onChange={handlePasswordChange}
          />
          <TextField
            margin="dense"
            name="confirm"
            type="password"
            label="Confirm New Password"
            fullWidth
            value={passwordData.confirm}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPassword(false)}>Cancel</Button>
          <Button variant="contained" backgroundColor="var(--color-primary)" onClick={handlePasswordSubmit}>Update</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminProfile;
