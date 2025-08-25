import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmitted(false);

    try {
      // Call your API here (replace with your own logic)
      // await forgotPasswordAPI(email);

      // Fake delay to simulate API call
      await new Promise((res) => setTimeout(res, 1000));

      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ background: 'linear-gradient(to right, #eef2f3, #ffffff)' }}
    >
      <Paper elevation={4} sx={{ p: 5, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Forgot Password
        </Typography>
        <Typography variant="body2" textAlign="center" mb={3}>
          Enter your email to receive password reset instructions.
        </Typography>

        {submitted ? (
          <Typography variant="body1" color="success.main" textAlign="center">
            ✅ Reset instructions have been sent to your email.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              disabled={loading}
              autoComplete="email"
              margin="normal"
            />

            {error && (
              <Typography color="error" variant="body2" mt={1}>
                {error}
              </Typography>
            )}

            <Box mt={3} position="relative">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                Send Reset Link
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
        )}
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
