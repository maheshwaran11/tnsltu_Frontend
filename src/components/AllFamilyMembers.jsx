import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, CircularProgress, Box, Button
} from '@mui/material';
import { useAuth } from '../store';
import { t } from '../utils/i18n';
import { getAllFamilyMembers } from '../api'; 
import AddEditFamilyMember from './AddEditFamilyMember';
import ViewFamilyMembers from './ViewFamilyMembers';

function AllFamilyMembers() {
  const { token } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang] = useState('en');

  // Dialog state
  const [selectedUser, setSelectedUser] = useState(null); // for Add/Edit
  const [viewUser, setViewUser] = useState(null); // for View

  const fetchFamilyMembers = async () => {
    setLoading(true);
    try {
      const res = await getAllFamilyMembers(token);
      if (res.status === 200) {
        setMembers(res.data || []);
      }
    } catch (err) {
      console.error(err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFamilyMembersLocally = (userId, newMember) => {
    setMembers(prev =>
        prev.map(user =>
        user.id === userId
            ? {
                ...user,
                family_members: [...(user.family_members || []), newMember]
            }
            : user
        )
    );
    };

  useEffect(() => {
    if (token) fetchFamilyMembers();
    
    }, [token]);

    useEffect(() => {
    if (selectedUser === null) fetchFamilyMembers();
    
  }, [selectedUser]);

  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {t('family_members', lang)}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      ) : members.length > 0 ? (
        <Box sx={{ maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('Sl No', lang)}</TableCell>
                <TableCell>{t('Username', lang)}</TableCell>
                <TableCell>{t('Name', lang)}</TableCell>
                <TableCell>{t('District', lang)}</TableCell>
                <TableCell>{t('Family Members', lang)}</TableCell>
                <TableCell>{t('Actions', lang)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{member.username || 'N/A'}</TableCell>
                  <TableCell>{member.name || 'N/A'}</TableCell>
                  <TableCell>{member.district || 'N/A'}</TableCell>
                  <TableCell>{member.family_members?.length || 0}</TableCell>
                  <TableCell>
                    {member.family_members?.length < 3 && (
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => setSelectedUser(member)}
                    >
                      {t('Add Family Member', lang)}
                    </Button>
                    )}

                    { member.family_members?.length > 0 && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setViewUser(member)}
                      >
                        {t('View Family Members', lang)}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      ) : (
        <Typography align="center" color="textSecondary">
          {t('no_family_members_found', lang)}
        </Typography>
      )}

      {/* Add/Edit Dialog */}
      <AddEditFamilyMember
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        lang={lang}
        onSaveLocal={updateFamilyMembersLocally}
      />

      {/* View Family Members Dialog */}
      <ViewFamilyMembers
        user={viewUser}
        open={!!viewUser}
        onClose={() => setViewUser(null)}
        lang={lang}
      />
    </Paper>
  );
}

export default AllFamilyMembers;
