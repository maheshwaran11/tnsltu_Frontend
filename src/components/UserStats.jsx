// components/UserStats.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress
} from '@mui/material';
import { getUserStats } from '../api';
import { useAuth } from '../store';

function UserStats() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getUserStats(token);
        if (res.status === 200) {
          setStats(res.data);
        } else {
          setError(res.message || 'Failed to fetch stats.');
        }
      } catch (err) {
        setError('An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStats();
  }, [token]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!stats) return null;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>User Statistics</Typography>
      <Grid container spacing={2}>
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} style={{ flex: '1 1 15%' }}>
            <Paper elevation={1} sx={{ p: 2, textAlign: 'center', minWidth: 200 }}>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                {key.replace(/_/g, ' ')}
              </Typography>
              <Typography variant="h4" color="primary">
                {value}
              </Typography>
            </Paper>
          </div>
        ))}
      </Grid>
    </Box>
  );
}

export default UserStats;
