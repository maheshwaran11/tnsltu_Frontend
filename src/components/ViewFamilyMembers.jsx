import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  Typography
} from '@mui/material';
import { getUsersWithFamily } from '../api'; // your API function
import { useAuth } from '../store';
import { t } from '../utils/i18n';
import AddEditFamilyMember from './AddEditFamilyMember';
import TableComponent from './utils/TableComponent';

function ViewFamilyMembers({ user, open, onClose, lang = 'en' }) {
  const { token } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMember, setEditMember] = useState(null);

  const headers = [
    { id: 'id', label: 'ID', key: 'id' },
    { id: 'name', label: t('name', lang), key: 'name' },
    { id: 'relation', label: t('relationship', lang), key: 'relation' },
    { id: 'dob', label: t('dob', lang), key: 'dob' },
    { id: 'gender', label: t('gender', lang), key: 'gender' },
    { id: 'claim_type', label: t('claim_type', lang), key: 'claim_type' },
    { id: 'current_status', label: t('current_status', lang), key: 'current_status' },
    { id: 'actions', label: t('actions', lang), key: 'actions', render: (row) => (
      <Box display="flex" gap={1} minWidth={120}>
        <Button
          variant="outlined"
          onClick={() => setEditMember(row)}
        >
          {t('edit', lang)}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(row.id)}
        >
          {t('delete', lang)}
        </Button>
      </Box>
  ) },
  ];

  useEffect(() => {
    const fetchFamily = async () => {
      if (!open || !user?.id) return;
      setLoading(true);
      try {
        const res = await getUsersWithFamily(user.id, token); // API call
        if (res.status === 200) {
          setFamilyMembers(res.data.family_members || []);
          setUsers(res.data || []);
        } else {
          setFamilyMembers([]);
        }
      } catch (err) {
        console.error('Error fetching family members', err);
        setFamilyMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [user?.id, open, token, editMember]);

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this family member?')) return;

    try {
        // Call API to delete member
        const res = await deleteFamilyMember(memberId, token); // Implement this API
        if (res.status === 200) {
        // Remove from local state
        setFamilyMembers(prev => prev.filter(m => m.id !== memberId));
        } else {
        alert(res.message || 'Failed to delete family member');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting family member');
    }
    };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t('family_members', lang)}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : familyMembers.length > 0 ? (
          <TableComponent header={headers} data={familyMembers} profile={null} />

          
        ) : (
          <Typography align="center" color="textSecondary" mt={2}>
            {t('no_family_members_found', lang)}
          </Typography>
        )}

        <AddEditFamilyMember
            user={users}
            editMember={editMember}
            open={!!editMember}
            onClose={() => setEditMember(null)}
            lang={lang}
            onSaveLocal={() => {
              // Optionally refresh family members after adding/editing}
              }}
            />


      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          {t('close', lang)}
        </Button>
      </DialogActions>
      
    </Dialog>
  );
}

export default ViewFamilyMembers;
