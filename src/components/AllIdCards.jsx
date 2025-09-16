// components/AllUsers.js
import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, CircularProgress, Avatar, TextField,
  Dialog, DialogTitle, DialogContent, Button, TablePagination, MenuItem, Box
} from '@mui/material';
import { Edit, Delete, PersonAdd } from '@mui/icons-material';
import { CSVLink } from 'react-csv';

import { useAuth } from '../store';
import { getAllIdCards, downloadIdCard, saveIdCardDetails } from '../api';
import AddUserForm from './AddUserForm';
import { t } from '../utils/i18n';
import AddEditIdCardDetails from './AddEditIdCardDetails';
import { Navigate, useNavigate } from 'react-router-dom';
import ViewIdCardDetails from './ViewIdCardDetails';
import TableComponent from './utils/TableComponent';

const roles = ['all', 'admin', 'subadmin', 'district_admin', 'taluk_admin', 'district_subadmin', 'taluk_subadmin', 'user'];

function AllIdCards() {
  const { token, profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [downloadUser, setDownloadUser] = useState(null);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  
  
  const [lang, setLang] = useState('en');
  const [filterRole, setFilterRole] = useState('all');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllIdCards(token);
      if (res.status === 200) {
        setUsers(res.data || []);
        setTotal(res.total || 0);
        setFiltered(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    applyFilter(query, filterRole);
  };

  const handleFilterRole = (e) => {
    const selectedRole = e.target.value;
    setFilterRole(selectedRole);
    applyFilter(search, selectedRole);
  };

  const applyFilter = (searchQuery, roleFilter) => {
    let data = [...users];

    if (roleFilter !== 'all') {
      data = data.filter((u) => u.user_type === roleFilter);
    }

    if (searchQuery) {
      data = data.filter((u) => u.username?.toLowerCase().includes(searchQuery));
    }

    setFiltered(data);
    setPage(0);
  };

  const handleCloseDialog = () => {
    setEditUser(null);
    setOpenDialog(false);
    fetchUsers();
  };


const approveCard = async (user) => {
  console.log({ user });

  if (!user.profile_photo || !user.registration_date || !user.next_renewal_date) {
    alert(t('id_card_details_missing', lang));
    return;
  }

  setLoading(true);

  // Decide new status based on current status
  let newStatus, approved;
  if (user.status === 'pending') {
    newStatus = 'approved';
    approved = true;
  } else if (user.status === 'approved') {
    newStatus = 'rejected';
    approved = false;
  } else {
    // you can extend this for 'rejected' -> 'approved' if needed
    newStatus = 'approved';
    approved = true;
  }

  const payload = { ...user, approved, status: newStatus };

  try {
    const res = await saveIdCardDetails(user.id, payload, token);

    if (res.status === 200 || res.status === 201) {
      alert(t('saved_successfully', lang));

      // update local UI state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, approved, status: newStatus } : u
        )
      );

      onClose();
    } else {
      alert(t('save_failed', lang));
    }
  } catch (error) {
    console.error(error);
    // alert(t('save_failed', lang));
  } finally {
    setLoading(false);
    fetchUsers();
  }
};



  const headers = [
    { id: 'serial_no', label: t('Sl No', lang), key: 'serial_no' },
    { id: 'username', label: t('username', lang), key: 'username' },
    { id: 'name', label: t('name', lang), key: 'id_card_name' },
    { id: 'member_id', label: t('member_id', lang), key: 'member_id' },
    { id: 'registration_date', label: t('registration_date', lang), key: 'registration_date' },
    { id: 'next_renewal_date', label: t('next_renewal_date', lang), key: 'next_renewal_date' },
    // { id: 'status', label: t('status', lang), key: 'status' },
    { id: 'actions', label: t('actions', lang), key: 'actions', render: (row) => (
      <Box display="flex" gap={1} minWidth={120}>
        <Button
          variant="outlined"
          onClick={() => setViewUser(row)}
        >
          {t('save_details', lang)}
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => setDownloadUser(row)}>
          {t('download', lang)}
        </Button>
      </Box>
  ) },
  ]

  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {t('ID Cards', lang)} ({total})
        {/* <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={openCreateDialog}
          color="primary"
          sx={{ float: 'right' }}
        >
          {t('add_user', lang)}
        </Button> */}
      </Typography>

      <Box display="flex" gap={2} mb={2} flexWrap={'wrap'}>
        <TextField
          label={t('search_by_username', lang)}
          className='input-control'
          value={search}
          onChange={handleSearch}
        />
        {
        profile?.user_type === 'admin' && (
            <>
          <TextField
            select
            className='input-control'
            label={t('filter_by_role', lang)}
            value={filterRole}
            onChange={handleFilterRole}
            sx={{ minWidth: 180 }}
            >
            {roles.map((role) => (
                <MenuItem key={role} value={role}>
                {t(role, lang)}
                </MenuItem>
            ))}
            </TextField>
            
                
            </>
            )
        }
        
        
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <TableComponent header={headers} data={filtered} profile={profile} />
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editUser ? t('edit_user', lang) : t('add_user', lang)}</DialogTitle>
        <DialogContent>
          <AddUserForm initialData={editUser} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>





        <AddEditIdCardDetails
            user={viewUser}
            open={!!viewUser}
            onClose={() => setViewUser(null)}
            lang={lang}
        />


        <ViewIdCardDetails
            user={downloadUser}
            open={!!downloadUser}
            onClose={() => setDownloadUser(null)}
            lang={lang}
        />




    </Paper>
  );
}

export default AllIdCards;
