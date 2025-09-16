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
import TableComponent from './utils/TableComponent';

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

  const headers = [
    { id: 'username', label: t('username', lang), key: 'username' },
    { id: 'district', label: t('district', lang), key: 'district' },
    { id: 'taluk', label: t('taluk', lang), key: 'taluk' },
    { id: 'claim_for', label: t('claim_for', lang), key: 'relation' },
    { id: 'member_name', label: t('member_name', lang), key: 'member_name' },
    // { id: 'member_id', label: t('member_id', lang), key: 'member_id' },
    { id: 'claim_type', label: t('claim_type', lang), key: 'claim_type' },
    { id: 'current_status', label: t('current_status', lang), key: 'current_status', render: (row) => (
      <span className={'status ' + (row.current_status || 'unknown')}>{t(row.current_status, lang)}</span>
    ) },
    { id: 'change_status', label: t('change_status', lang), key: 'change_status', render: (row) => (
      <FormControl size="small" fullWidth>
        <Select
          value={row.current_status}
          onChange={(e) => handleStatusChange(row.claim_id, e.target.value)}
        >
          {STATUSES.map((status) => (
            <MenuItem key={status} value={status}>
              {t(status, lang)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  ) },
  { id: 'submitted_on', label: t('submitted_on', lang), key: 'claim_created_at', render: (row) => formatDate(row.claim_created_at) }
  ];

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
      <Box display="flex" gap={2} mb={2} flexWrap={'wrap'}>


          <FormControl size="small" className='filter-control input-control'>
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

          <FormControl size="small" className='filter-control input-control'>
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
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredClaims.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          {t('no_claims_found', lang)}
        </Typography>
      ) : (
        <Box sx={{maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          
          <TableComponent header={headers} data={filteredClaims} profile={null} />
        </Box>
      )}
    </Paper>
  );
}

export default AllClaims;
