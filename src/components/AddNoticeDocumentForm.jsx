import React, { useState, useEffect } from 'react';
import {
  TextField, Button, MenuItem, Typography, Avatar, Grid, Box
} from '@mui/material';
import { createNoticeDocumentAPI, updateNoticeDocumentAPI } from '../api';
import { t } from '../utils/i18n';
import { useAuth } from '../store';

const initialState = {
  title: '',
  description: '',
  category: '',
  status: 'active',
  file: null,
};

function AddNoticeDocumentForm({ initialData, onClose }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');

  const isEdit = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, file: null });
      setPreview(initialData.file_url ? `https://tnsltu.in/api/uploads/${initialData.file_url}` : null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, file }));

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const requiredFields = ['title', 'status'];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Missing field: ${field}`);
        setLoading(false);
        return;
      }
    }

    if (!isEdit && !formData.file) {
      alert('Document file is required.');
      setLoading(false);
      return;
    }

    try {
        console.log('Submitting form data:', formData);
      const result = isEdit ? await updateNoticeDocumentAPI(formData, token) : await createNoticeDocumentAPI(formData, token);
      if ([200, 201].includes(result.status)) {
        alert(isEdit ? t('update_user', lang) : t('register_user', lang));
        onClose?.();
      } else {
        setError(result.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('Error while saving user');
    } finally {
      setLoading(false);
    }
  }
    

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" flexDirection="column" alignItems="center">
          {preview && <Avatar src={preview} sx={{ width: 100, height: 100, mb: 1 }} />}
          <Button variant="contained" component="label">
            {t('upload_file', lang)}
            <input required={!isEdit} type="file" hidden onChange={handleFileChange} />
          </Button>
        </Box>
        <Button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} variant="outlined">
          {lang === 'en' ? 'தமிழ்' : 'English'}
        </Button>
      </Box>

      <div className="form-layout">
        <div className="form-item">
          <TextField
            required
            label={t('title', lang)}
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
          />
        </div>

        <div className="form-item">
          <TextField
            label={t('description', lang)}
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
        </div>

        <div className="form-item">
          <TextField
            select
            label={t('category', lang)}
            name="category"
            value={formData.category}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="report">{t('report', lang)}</MenuItem>
            <MenuItem value="policy">{t('policy', lang)}</MenuItem>
            <MenuItem value="financial">{t('financial', lang)}</MenuItem>
            <MenuItem value="other">{t('other', lang)}</MenuItem>
          </TextField>
        </div>

        <div className="form-item">
          <TextField
            required
            select
            label={t('status', lang)}
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="active">{t('active', lang)}</MenuItem>
            <MenuItem value="inactive">{t('inactive', lang)}</MenuItem>
          </TextField>
        </div>
      </div>

      <Box mt={3} display="flex" alignItems="center">
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? t('update_document', lang) : t('create_document', lang)}
        </Button>
        {error && (
          <Typography variant="body2" color="error" ml={2}>
            {error}
          </Typography>
        )}
      </Box>
    </form>
  );
}

export default AddNoticeDocumentForm;
