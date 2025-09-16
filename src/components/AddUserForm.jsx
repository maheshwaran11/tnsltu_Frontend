import React, { useState, useEffect } from 'react';
import {
  TextField, Button, MenuItem, Typography, Avatar, Grid, Box
} from '@mui/material';
import { registerAPI, updateUser } from '../api';
import { t } from '../utils/i18n';
import { districts, taluks, districtAddress } from '../data/locations';
import { useAuth } from '../store';
import { form } from 'framer-motion/client';

const initialState = {
  username: '',
  name: '',
  email: '',
  password: '',
  user_type: 'user',
  address: '',
  address_tamil: '',
  district: '',
  taluk: '',
  state: 'Tamilnadu',
  zipcode: '',
  phone: '',
  gender: '',
  dob: '',
  profile_photo: null,
  category: '',
  status: 'active',
  notes: '',
  member_id: '',
  relation_type: '',
  relation_name: '',
  subscription_number: '',
  donation_number: '',
  card_status: ''
};

// const roles = ['admin', 'subadmin', 'district_admin', 'taluk_admin', 'district_subadmin', 'taluk_subadmin', 'user'];

function AddUserForm({ initialData, onClose }) {
  const { token, profile } = useAuth();   
  const [formData, setFormData] = useState(initialState);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');
  const isEdit = !!initialData;
  const [isAdmin, setIsAdmin] = useState(profile?.user_type === 'admin');
  const [isDistrictAdmin, setIsDistrictAdmin] = useState(profile?.user_type === 'district_admin');
  const [isDistrictSubAdmin, setIsDistrictSubAdmin] = useState(profile?.user_type === 'district_subadmin');
  const [isUser, setIsUser] = useState(formData.user_type === 'user');

  const [roles, setRoles] = useState(['user']);

  const currentTaluks = taluks[formData.district] || [];
  
  // District selection logic: show all districts for admin, or only user's district for non-admin
  const availableDistricts = isAdmin ? districts : (profile?.district ? [profile.district] : districts);

const generateMemberID = (district, districtVal, suffix = '') => {
  console.log('Generating member ID for district:', districtVal);

  if (!district) return '';
  const prefix = districtAddress.find(item => item.district === districtVal)?.code || '';
  console.log('Generated member ID prefix:', prefix);
  const year = new Date().getFullYear().toString().slice(-2);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${year}${randomPart}${suffix}`;
};

useEffect(() => {
  if (profile?.user_type === 'admin') {
    setRoles(['admin', 'subadmin', 'district_admin', 'taluk_admin', 'district_subadmin', 'taluk_subadmin', 'user']);
  } else if (profile?.user_type === 'district_admin') {
    setRoles(['user']);
  } else {
    setRoles(['user']);
  }
}, [profile]);

useEffect(() => {
  setIsUser(formData.user_type === 'user');
  if (isUser) {
    formData.username = 'test';
    formData.password = '123';
    formData.email = 'test@example.com';
  }
}, [formData.user_type]);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, password: '' });
      setPreview(initialData.profile_photo ? `https://tnsltu.in/api/${initialData.profile_photo}` : null);
    }
  }, [initialData]);

  // Set default district for non-admin users
  useEffect(() => {
    if (!isAdmin && profile?.district && !formData.district) {
      setFormData((prev) => ({ ...prev, district: profile.district }));
    }
  }, [isAdmin, profile?.district, formData.district]);

  const handleChange = (e) => {
    console.log('Field changed:', e.target.name);
    const { name, value } = e.target;
    setFormData((prev) => {
        let updated = { ...prev, [name]: value };
        
        if (name === "district") {
          // reset taluk if district changes
          updated.taluk = "";
          updated.member_id = "";
        }

        if (name === "taluk" && !isEdit) {
          // generate member_id only after taluk is selected

          updated.member_id = generateMemberID(`${prev.district}-${value}`, `${prev.district}`);
        }

        if (name === "phone") {
          // keep only digits and max 10 chars
          const numericValue = value.replace(/\D/g, "").slice(0, 10);
          updated.phone = numericValue;
          return updated;
        }

        return updated;
    });
    
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profile_photo: reader.result }));
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');


    const requiredFields = ['username', 'name', 'user_type', 'district', 'taluk', 'phone', 'status', 'dob'];

    if (formData?.user_type === 'user') {
      requiredFields.push('card_status', 'donation_number');
    }
    
    if (!isEdit) requiredFields.push('password');



    for (let field of requiredFields) {
      if (!formData[field]) {
        alert(`Missing field: ${field}`);
        setLoading(false);
        return;
      }
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert('Invalid phone number. Please enter a valid 10-digit number.');
      setLoading(false);
      return;
    }

    if(formData.profile_photo == null) {
      alert('Profile photo is required.');
      setLoading(false);
      return;
    }

    try {
        console.log('Submitting form data:', formData);
        // return ;
      const result = isEdit ? await updateUser(formData, token) : await registerAPI(formData, token);
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar src={preview} sx={{ width: 100, height: 100, mb: 1 }} />
          <Button variant="contained" component="label">
            {t('upload_photo', lang)}
            <input required={!isEdit} type="file" hidden onChange={handleProfilePhotoChange} />
          </Button>
        </Box>
        <Button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} variant="outlined">
          {lang === 'en' ? 'தமிழ்' : 'English'}
        </Button>
      </Box>

    <div className="form-layout">

        <div className="form-item">
            <TextField select required label={t('user_type', lang)} name="user_type" value={formData.user_type || ''} onChange={handleChange} fullWidth>
            {roles.map((r) => <MenuItem key={r} value={r}>{t(r, lang)}</MenuItem>)}
            </TextField>
        </div>

        <div className="form-item">
            <TextField required label={t('name', lang)} name="name" value={formData.name} onChange={handleChange} fullWidth />
        </div>

        {
          !isUser && (
            <div className="form-item">
              <TextField required label={t('username', lang)} name="username" value={formData.username} onChange={handleChange} fullWidth />
            </div>
          )
        }

        {
          !isUser && (
          <div className="form-item">
              <TextField required type="email" label={t('email', lang)} name="email" value={formData.email} onChange={handleChange} fullWidth />
          </div>
          )
        }
        
        {
          !isUser && (
            !isEdit && (
                <div className="form-item">
                <TextField required type="password" label={t('password', lang)} name="password" value={formData.password} onChange={handleChange} fullWidth />
                </div>
            )
        )}

        {
          isUser && (
            <div className="form-item">
              <TextField required type="text" label={t('relation_name', lang)} name="relation_name" value={formData.relation_name} onChange={handleChange} fullWidth />
            </div>
          )
        }

        {
          isUser && (
            <div className="form-item">
              <TextField 
              required 
              select
              label={t('relation_type', lang)} 
              name="relation_type" 
              value={formData.relation_type || ''} 
              onChange={handleChange} fullWidth>
                {
                  ['Father', 'Mother', 'Husband', 'Other'].map((relation) => (
                    <MenuItem key={relation} value={relation}>
                      {t(relation, lang)}
                    </MenuItem>
                  ))
                }
              </TextField>
            </div>
          )
        }
        
        
        
        <div className="form-item">
            <TextField
            select
            required
            label={t('district', lang)}
            name="district"
            value={formData.district || ''}
            onChange={handleChange}
            fullWidth
            >
            {availableDistricts.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
        </div>
        <div className="form-item">
            <TextField
            select
            required
            label={t('taluk', lang)}
            name="taluk"
            value={formData.taluk || ''}
            onChange={handleChange}
            fullWidth
            disabled={!formData.district}
            >
            {currentTaluks.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
        </div>
        <div className="form-item">
            <TextField required label={t('phone', lang)} name="phone" value={formData.phone} onChange={handleChange} fullWidth />
        </div>
        <div className="form-item">
            <TextField required type="date" label={t('dob', lang)} name="dob" value={formData.dob} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
        </div>
        <div className="form-item">
            <TextField label={t('address', lang)} required name="address" value={formData.address} onChange={handleChange} fullWidth />
        </div>
        <div className="form-item">
            <TextField label={t('address_tamil', lang)} name="address_tamil" value={formData.address_tamil} onChange={handleChange} fullWidth />
        </div>
        <div className="form-item">
            <TextField label={t('state', lang)} name="state" value={formData.state} onChange={handleChange} fullWidth />
        </div>
        <div className="form-item">
            <TextField label={t('zipcode', lang)} required name="zipcode" value={formData.zipcode} onChange={handleChange} fullWidth />
        </div>
        <div className="form-item">
            <TextField select label={t('gender', lang)} name="gender" value={formData.gender || ''} onChange={handleChange} fullWidth>
            <MenuItem value="">{t('gender', lang)}</MenuItem>
            <MenuItem value="male">{t('male', lang)}</MenuItem>
            <MenuItem value="female">{t('female', lang)}</MenuItem>
            <MenuItem value="other">{t('other', lang)}</MenuItem>
            </TextField>
        </div>
        {/* <div className="form-item">
            <TextField select label={t('category', lang)} name="category" value={formData.category} onChange={handleChange} fullWidth>
            <MenuItem value="disabled">{t('disabled', lang)}</MenuItem>
            <MenuItem value="widow">{t('widow', lang)}</MenuItem>
            <MenuItem value="orphan">{t('orphan', lang)}</MenuItem>
            </TextField>
        </div> */}
        <div className="form-item">
            <TextField required select label={t('user_status', lang)} name="status" value={formData.status || ''} onChange={handleChange} fullWidth>
            <MenuItem value="active">{t('active', lang)}</MenuItem>
            <MenuItem value="inactive">{t('inactive', lang)}</MenuItem>
            </TextField>
        </div>

        {
          isUser && (
            <div className="form-item">
              <TextField 
              required 
              select
              label={t('card_type', lang)} 
              name="card_type" 
              value={formData.card_type || ''} 
              onChange={handleChange} fullWidth>
                {
                  ['New', 'Renevel', 'Claim'].map((card) => (
                    <MenuItem key={card} value={card}>
                      {t(card, lang)}
                    </MenuItem>
                  ))
                }
              </TextField>
            </div>
          )
        }

        {
          isUser && (
            <div className="form-item">
              <TextField
              select
              required
              label={t('card_status', lang)}
              name="card_status"
              value={formData.card_status || ''}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="select_card_status">{t('select_card_status', lang)}</MenuItem>
              <MenuItem value="applied">{t('applied', lang)}</MenuItem>
              <MenuItem value="pending">{t('pending', lang)}</MenuItem>
              <MenuItem value="approved">{t('approved', lang)}</MenuItem>
              <MenuItem value="rejected">{t('rejected', lang)}</MenuItem>
              <MenuItem value="returned">{t('returned', lang)}</MenuItem>
            </TextField>
          </div>
          )
        }

        {
          isUser && (
            <>
            <div className="form-item">
              <TextField label={t('donation/subscription number', lang)} required name="donation_number" value={formData.donation_number} onChange={handleChange} fullWidth />
            </div>
            {/* <div className="form-item">
              <TextField label={t('subscription_number', lang)} name="subscription_number" value={formData.subscription_number} onChange={handleChange} fullWidth />
            </div> */}
            
            </>
          )
        }

        {!isEdit && (
            <div className="form-item">
                <TextField
                label={t('member_id', lang)}
                name="member_id"
                value={formData.member_id}
                fullWidth
                InputProps={{ readOnly: true }}
                />
            </div>
            )}
        
        <div className="form-item">
            <TextField label={t('notes', lang)} name="notes" value={formData.notes} onChange={handleChange} fullWidth />
        </div>

        
        
    </div>

      <Box mt={3} display="flex" alignItems="center">
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? t('update_user', lang) : t('register_user', lang)}
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

export default AddUserForm;
