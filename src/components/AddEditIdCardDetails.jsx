import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, Button, TextField, MenuItem, Box, Grid
} from '@mui/material';
import {  getUserById, saveIdCardDetails } from '../api';
import { useAuth } from '../store';
import { t } from '../utils/i18n';

function AddEditIdCardDetails({ user, open, onClose, lang = 'en' }) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
      if (user) {
        setFormData({
            id_card_name: user.id_card_name || '',
            position: user.position || '',
            occupation: user.occupation || '',
            member_id: user.member_id || '',
            registration_date: user.registration_date || '',
            next_renewal_date: user.next_renewal_date || '',
            user_id: user.user_id || ''
        });
      }
      setLoading(false);

  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "registration_date" && value) {
        const regDate = new Date(value);
        const nextRenewal = new Date(regDate);

        // ✅ Add 1 year
        nextRenewal.setFullYear(nextRenewal.getFullYear() + 1);

        // ✅ Subtract 1 day
        nextRenewal.setDate(nextRenewal.getDate() - 1);

        // Format as YYYY-MM-DD (local time)
        const yyyy = nextRenewal.getFullYear();
        const mm = String(nextRenewal.getMonth() + 1).padStart(2, "0");
        const dd = String(nextRenewal.getDate()).padStart(2, "0");

        updated.next_renewal_date = `${yyyy}-${mm}-${dd}`;
      }

      return updated;
    });
  };



  const handleSave = async () => {
    console.log('Saving ID Card Details:', formData);
    const res = await saveIdCardDetails(user.id, formData, token);
    console.log('Save response:', res);
    if (res.status === 200 || res.status === 201) {
      alert(t('saved_successfully', lang));
      onClose();
    } else {
      alert(t('save_failed', lang));
    }
  };

  if (!user || !open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('add_edit_id_card', lang)}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
            <Box display="flex" gap={3} flexWrap="wrap">
            {/* Left Column */}
            <Box flex={1} minWidth={180}>
                <TextField fullWidth label={t('id_card_name', lang)} name="id_card_name" value={formData.id_card_name} onChange={handleChange} margin="normal" />
                {/* <TextField fullWidth label={t('user_id', lang)} name="user_id" value={formData.user_id} onChange={handleChange} margin="normal" /> */}
                <TextField fullWidth label={t('member_id', lang)} name="member_id" value={formData.member_id} onChange={handleChange} margin="normal" InputProps={{ readOnly: true }} />
                <TextField fullWidth label={t('occupation', lang)} name="occupation" value={formData.occupation} onChange={handleChange} margin="normal" />
                
            </Box>

            {/* Right Column */}
            <Box flex={1} minWidth={180}>
                <TextField fullWidth label={t('position', lang)} name="position" value={formData.position} onChange={handleChange} margin="normal" />
                <TextField fullWidth label={t('registration_date', lang)} name="registration_date" type="date" value={formData.registration_date} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} />
                <TextField fullWidth label={t('next_renewal_date', lang)} name="next_renewal_date" type="date" value={formData.next_renewal_date} onChange={handleChange} margin="normal" InputLabelProps={{ shrink: true }} InputProps={{ readOnly: true }} />          
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} variant="contained">{t('save', lang)}</Button>
        <Button onClick={onClose}>{t('close', lang)}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditIdCardDetails;
