import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
  CircularProgress
} from '@mui/material';
import { getUserById } from '../api';
import { useAuth } from '../store';
import { t } from '../utils/i18n';
import { Person as PersonIcon } from '@mui/icons-material';

function ViewUserDetails({ user, open, onClose, lang = 'en' }) {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id && token && open) {
        setLoading(true);
        try {
          const res = await getUserById(user.id, token);
          setUserData(res.data || null);
        } catch (err) {
          console.error('Error fetching user:', err);
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
      }
    };

    fetchUser();
  }, [user?.id, token, open]);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date));
  };

  const renderField = (label, value) => (
    <Typography variant="body2" sx={{ mb: 0.5 }}>
      <Typography component="span" variant="subtitle2">
        {t(label, lang)}:
      </Typography>{' '}
      {value || '—'}
    </Typography>
  );

  if (!user || !open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('view_user', lang)}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : userData ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            {/* Top section */}
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar
                sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                src={
                  userData.profile_photo
                    ? `https://tnsltu.in/api/${userData.profile_photo}`
                    : ''
                }
              >
                {userData.name?.[0]?.toUpperCase() || (
                  <PersonIcon fontSize="large" />
                )}
              </Avatar>

              <Box>
                <Typography variant="h6">{userData.name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userData.email || 'No email'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {userData.user_type || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member ID: {userData.member_id || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Grid layout */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {renderField('username', userData.username)}
                {renderField('dob', userData.dob)}
                {renderField('gender', userData.gender)}
                {renderField('phone', userData.phone)}
                {renderField('status', t(userData.status, lang))}
                {renderField('relation_type', userData.relation_type)}
                {renderField('relation_name', userData.relation_name)}
              </Grid>

              <Grid item xs={12} sm={6}>
                {renderField('district', userData.district)}
                {renderField('taluk', userData.taluk)}
                {renderField('state', userData.state)}
                {renderField('zipcode', userData.zipcode)}
                {renderField('card_type', userData.card_type)}
                {renderField('card_status', userData.card_status)}
              </Grid>

              <Grid item xs={12}>
                {renderField('address', userData.address)}
                {renderField('address_tamil', userData.address_tamil)}
                {renderField('notes', userData.notes || 'No additional notes')}
              </Grid>

              <Grid item xs={12} sm={6}>
                {renderField('donation_number', userData.donation_number)}
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Timestamps */}
            <Typography variant="caption" color="text.secondary">
              {t('created', lang)}: {formatDate(userData.created_at)} <br />
              {t('updated', lang)}: {formatDate(userData.updated_at)}
            </Typography>
          </Paper>
        ) : (
          <Typography color="error">{t('user_not_found', lang)}</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserDetails;
