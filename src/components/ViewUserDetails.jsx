import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  Box, Typography, Avatar, Divider, CircularProgress, Button
} from '@mui/material';
import { getUserById } from '../api';
import { useAuth } from '../store';
import { t } from '../utils/i18n';

function ViewUserDetails({ user, open, onClose, lang = 'en' }) {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

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

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '', 'width=600,height=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>ID Card</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .id-card { border: 1px solid #ccc; padding: 20px; width: 300px; text-align: center; }
            .id-card img { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 10px; }
            .id-card h2 { margin: 5px 0; font-size: 18px; }
            .id-card p { margin: 2px 0; font-size: 14px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!user || !open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {t('view_user', lang)}
        {/* {userData && (
          <Button
            onClick={handlePrint}
            variant="outlined"
            size="small"
            sx={{ float: 'right' }}
          >
            {t('print_id_card', lang) || 'Print ID Card'}
          </Button>
        )} */}
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : userData ? (
          <>
            {/* Display Details */}
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={userData.profile_photo ? `https://tnsltu.in/api/${userData.profile_photo}` : ''}
                  alt={userData.username}
                  sx={{ width: 72, height: 72 }}
                />
                <Box>
                  <Typography variant="h6">{userData.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t(userData.user_type, lang)}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              {[['email', userData.email],
                ['username', userData.username],
                ['phone', userData.phone],
                ['district', userData.district],
                ['taluk', userData.taluk],
                ['status', t(userData.status, lang)],
                ['dob', userData.dob],
                ['address', userData.address],
                // ['address_tamil', userData.address_tamil],
                ['member_id', userData.member_id],
                // ['registration_date', userData.registration_date],
                // ['previous_renewal_date', userData.previous_renewal_date],
                // ['next_renewal_date', userData.next_renewal_date],
                // ['notes', userData.notes]
              ].map(([label, value]
                  
                ) => (
                <Box key={label} display="flex" justifyContent="space-between">
                  <Typography fontWeight="bold">{t(label, lang)}:</Typography>
                  <Typography>{value || '-'}</Typography>
                </Box>
              ))}
            </Box>

            {/* Hidden ID Card for print */}
            {/* <IDCardWithActions userData={userData} lang={lang} t={t} /> */}
          </>
        ) : (
          <Typography color="error">{t('user_not_found', lang)}</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserDetails;
