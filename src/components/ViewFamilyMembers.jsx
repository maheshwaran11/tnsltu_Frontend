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

function ViewFamilyMembers({ user, open, onClose, lang = 'en' }) {
  const { token } = useAuth();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMember, setEditMember] = useState(null);

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
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>{t('name', lang)}</TableCell>
                  <TableCell>{t('relationship', lang)}</TableCell>
                  <TableCell>{t('dob', lang)}</TableCell>
                  <TableCell>{t('gender', lang)}</TableCell>
                  {/* <TableCell>{t('education', lang)}</TableCell> */}
                  {/* <TableCell>{t('current_year', lang)}</TableCell> */}
                  <TableCell>{t('claim_type', lang)}</TableCell>
                  <TableCell>{t('current_status', lang)}</TableCell>
                  <TableCell>{t('actions', lang)}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyMembers.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{member.name || 'N/A'}</TableCell>
                    <TableCell>{member.relation || 'N/A'}</TableCell>
                    <TableCell>{member.dob || 'N/A'}</TableCell>
                    <TableCell>{member.gender || 'N/A'}</TableCell>
                    {/* <TableCell>{member.education || 'N/A'}</TableCell> */}
                    {/* <TableCell>{member.current_year || 'N/A'}</TableCell> */}
                    <TableCell>{member.claim_type || 'N/A'}</TableCell>
                    <TableCell>{member.current_status || 'N/A'}</TableCell>
                    <TableCell>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleDelete(member.id)}
                            >
                            {t('delete', lang)}
                        </Button>


                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => setEditMember(member.id)}
                            >
                            {t('edit', lang)}
                        </Button>


                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
