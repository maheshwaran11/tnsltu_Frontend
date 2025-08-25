import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box, Typography, Avatar, Paper, Grid, CircularProgress
} from '@mui/material';
import { getUserById } from '../api'; // You should create this API function
import { useAuth } from '../store';

function UserProfileView() {
    const { token, profile } = useAuth();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUserById(id, token); // call your PHP API here
        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  if (loading) return <CircularProgress sx={{ m: 5 }} />;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Viewing User Profile (ID: {id})</Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box display="flex" gap={2} mb={3}>
          <Avatar
            sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
            src={user.profile_photo || undefined}
          >
            {user.username?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.username}</Typography>
            <Typography>{user.email}</Typography>
            <Typography>User Type: {user.user_type}</Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Phone:</strong> {user.phone}</Typography>
            <Typography><strong>DOB:</strong> {user.dob}</Typography>
            <Typography><strong>Status:</strong> {user.status}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>District:</strong> {user.district}</Typography>
            <Typography><strong>Taluk:</strong> {user.taluk}</Typography>
            <Typography><strong>Zipcode:</strong> {user.zipcode}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Address:</strong> {user.address}</Typography>
            <Typography><strong>Notes:</strong> {user.notes || 'No notes'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default UserProfileView;
