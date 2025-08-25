import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAPI, getProfileAPI } from '../api';
import { useAuth } from '../store';

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, setProfile } = useAuth();

  const adminRoles = [
    'admin',
    'subadmin',
    'district_admin',
    'taluk_admin',
    'district_subadmin',
    'taluk_subadmin',
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      const data = await loginAPI(email, password);
      if (data.status === 200) {
        const token = data.data.token;
        login(token);

        const profileData = await getProfileAPI(token);
        if (profileData.status === 200) {
          setProfile(profileData.data);
          if (adminRoles.includes(profileData.data.user_type)) {
            navigate('/admin-dashboard');
          } else {
            navigate('/user-dashboard');
          }
        } else {
          setError(profileData.message || 'Failed to load profile');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className="login-container"
        height="100vh"
        bgcolor="#f5f5f5"
      >
        <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 2 }}>
          <form onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" mb={2} textAlign="center">
              Login
            </Typography>

            {error && (
              <Typography variant="body2" color="error" mb={2}>
                {error}
              </Typography>
            )}

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              disabled={loading}
              margin="normal"
              autoComplete="email"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              disabled={loading}
              margin="normal"
              autoComplete="current-password"
            />

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mt={1}
              mb={2}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Remember Me"
              />

              {/* <Link
                to="/forgot-password"
                style={{
                  fontSize: '0.875rem',
                  color: '#1976d2',
                  textDecoration: 'none',
                }}
              >
                Forgot Password?
              </Link> */}
            </Box>

            <Box mt={1} position="relative">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                Login
              </Button>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              )}
            </Box>
          </form>
        </Paper>
      </Box>
    </section>
  );
}

export default Login;
