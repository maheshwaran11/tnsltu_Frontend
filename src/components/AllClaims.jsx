import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, CircularProgress, Box,
  TableContainer, Select, MenuItem, FormControl,
  InputLabel, Grid
} from '@mui/material';
import { useAuth } from '../store';
import { t } from '../utils/i18n';
import { getAllClaims, updateClaimStatus } from '../api'; 

// 🔹 Predefined options
const STATUSES = ["applied", "not applied", "approved", "rejected", "returned"];
const CLAIM_TYPES = ["education", "marriage", "old_age_pension", "others"];

function AllClaims() {
  const { token } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang] = useState('en');

  // Filters
  const [claimTypeFilter, setClaimTypeFilter] = useState('');
  const [claimStatusFilter, setClaimStatusFilter] = useState('');

  // 🔹 Fetch all claims
  const fetchAllClaims = async () => {
    setLoading(true);
    try {
      const res = await getAllClaims(token);
      if (res.status === 200) {
        setClaims(res.data || []);
      } else {
        setClaims([]);
      }
    } catch (err) {
      console.error(err);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllClaims();
  }, [token]);

// 🔹 Change status handler
const handleStatusChange = async (claimId, newStatus) => {
    console.log("Changing status for claim", claimId, "to", newStatus);
  try {
    // Optimistic UI update
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId ? { ...c, current_status: newStatus } : c
      )
    );

    const payload = {
      claim_id: claimId,
      claim_status: newStatus,
    };
    console.log("Updating claim status", payload);
    const res = await updateClaimStatus(payload, token);
    fetchAllClaims();
    if (!(res.status === 200 || res.status === 201)) {
      console.error("Failed to update status");
      // revert if failed
      fetchAllClaims();
    }
  } catch (err) {
    console.error("Error updating status", err);
    fetchAllClaims();
  }
};


  // ✅ Apply filters
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesType = claimTypeFilter ? claim.claim_type === claimTypeFilter : true;
      const matchesStatus = claimStatusFilter ? claim.current_status === claimStatusFilter : true;
      return matchesType && matchesStatus;
    });
  }, [claims, claimTypeFilter, claimStatusFilter]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {t('all_claims', lang)}
      </Typography>

      {/* 🔹 Filter Controls */}
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" className='filter-control'>
            <InputLabel>{t('claim_type', lang)}</InputLabel>
            <Select
              value={claimTypeFilter}
              onChange={(e) => setClaimTypeFilter(e.target.value)}
              label={t('claim_type', lang)}
            >
              <MenuItem value="">{t('all', lang)}</MenuItem>
              {CLAIM_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {t(type, lang)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" className='filter-control'>
            <InputLabel>{t('status', lang)}</InputLabel>
            <Select
              value={claimStatusFilter}
              onChange={(e) => setClaimStatusFilter(e.target.value)}
              label={t('status', lang)}
            >
              <MenuItem value="">{t('all', lang)}</MenuItem>
              {STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {t(status, lang)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredClaims.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          {t('no_claims_found', lang)}
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{t('username', lang)}</TableCell>
                    <TableCell>{t('district', lang)}</TableCell>
                    <TableCell>{t('taluk', lang)}</TableCell>
                    <TableCell>{t('claim_for', lang)}</TableCell>
                    <TableCell>{t('member_name', lang)}</TableCell>
                    <TableCell>{t('member_gender', lang)}</TableCell>
                    <TableCell>{t('member_dob', lang)}</TableCell>
                    <TableCell>{t('claim_type', lang)}</TableCell>
                    <TableCell>{t('status_label', lang)}</TableCell>
                    <TableCell>{t('change_status', lang)}</TableCell>
                    <TableCell>{t('submitted_on', lang)}</TableCell>
                </TableRow>
                </TableHead>

                <TableBody>
                {filteredClaims.map((claim) => (
                    <TableRow key={claim.claim_id}>
                    <TableCell>{claim.username}</TableCell>
                    <TableCell>{claim.district}</TableCell>
                    <TableCell>{claim.taluk}</TableCell>
                    <TableCell>{claim.relation}</TableCell>
                    <TableCell>{claim.member_name || '-'}</TableCell>
                    <TableCell>{claim.member_gender || '-'}</TableCell>
                    <TableCell>{formatDate(claim.member_dob)}</TableCell>
                    <TableCell>{t(claim.claim_type || '-', lang)}</TableCell>

                    {/* 🔹 Status Label */}
                    <TableCell>
                        <Typography variant="body2" color="primary">
                        {t(claim.current_status || '-', lang)}
                        </Typography>
                    </TableCell>

                    {/* 🔹 Status Dropdown */}
                    <TableCell>
                        <FormControl size="small" fullWidth>
                        <Select
                            value={claim.current_status || ''}
                            onChange={(e) => handleStatusChange(claim.claim_id, e.target.value)}
                        >
                            {STATUSES.map((status) => (
                            <MenuItem key={status} value={status}>
                                {t(status, lang)}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                    </TableCell>

                    <TableCell>{formatDateTime(claim.claim_created_at)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>

          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default AllClaims;
