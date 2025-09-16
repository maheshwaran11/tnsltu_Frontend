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
import { getAllUsers, deleteUser } from '../api';
import AddUserForm from './AddUserForm';
import { t } from '../utils/i18n';
import ViewUserDetails from './ViewUserDetails';
import { Navigate, useNavigate } from 'react-router-dom';
import AddEditFamilyMember from './AddEditFamilyMember';
import TableComponent from './utils/TableComponent';

const roles = ['all', 'admin', 'subadmin', 'district_admin', 'taluk_admin', 'district_subadmin', 'taluk_subadmin', 'user'];

function AllUsers() {
  const { token, profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [total, setTotal] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDistrictAdmin, setIsDistrictAdmin] = useState(false);
  const [isDistrictSubAdmin, setIsDistrictSubAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.user_type === 'admin');
      setIsDistrictAdmin(profile.user_type === 'district_admin');
      setIsDistrictSubAdmin(profile.user_type === 'district_subadmin');
    }
  }, [profile]);

  const [lang, setLang] = useState('en');
  const [filterRole, setFilterRole] = useState('all');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers(token);
      if (res.status === 200) {
        setUsers(res.data || []);
        setTotal(res.total || 0);
        setFiltered(res.data || []);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // useEffect(() => {
  //   if (viewUser) {
  //     navigate(`view/${viewUser.id}`);
  //   }
  // }, [viewUser]);

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

  const openCreateDialog = () => {
    setEditUser(null);
    setOpenDialog(true);
  };

  const openEditDialog = (user) => {
    setEditUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditUser(null);
    setOpenDialog(false);
    fetchUsers();
  };

  const handleDelete = async (user) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${user.username}?`);
    if (!confirmDelete) return;

    try {
      const res = await deleteUser(user.id, token);
      if (res.status === 200) {
        alert('User deleted successfully.');
        fetchUsers();
      } else {
        alert(res.message || 'Failed to delete user.');
      }
    } catch (error) {
      alert('Something went wrong while deleting user.');
    }
  };

  const headers = [
    { id: 'sl_no', label: 'Sl No', key: 'serial_no' },
    { id: 'username', label: 'Username', key: 'username' },
    {
    id: 'profile',
    label: 'Profile',
    key: 'profile_photo',
    render: (row) => (
      <Avatar
        alt={row.username}
        src={row.profile_photo ? `https://tnsltu.in/api/${row.profile_photo}` : ''}
      >
        {row.username?.[0]?.toUpperCase()}
      </Avatar>
    ),
  },
    { id: 'name', label: 'Name', key: 'name' },
    { id: 'email', label: 'Email', key: 'email' },
    { id: 'phone', label: 'Phone', key: 'phone' },
    { id: 'district', label: 'District', key: 'district' },
    { id: 'taluk', label: 'Taluk', key: 'taluk' },
    // { id: 'status', label: 'Status', key: 'status' },
    // { id: 'category', label: 'Category', key: 'category' },
    {
      id: 'family_actions', 
      label: 'Family Actions', 
      key: 'family_actions',
      render: (row) => (
        <Box display="flex" gap={1} minWidth={180}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setSelectedUser(row)}
          >
            Add Family Member
          </Button>
        </Box>
      ),
    },
    {
      id: 'actions', 
      label: 'Actions', 
      key: 'actions',
      render: (row) => (
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            color="info"
            onClick={() => setViewUser(row)}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => openEditDialog(row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(row)}
          >
            Delete
          </Button>
        </Box>
      ),
    }
  ];

  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {t('all_users', lang)} ({total})
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={openCreateDialog}
          color="primary"
          sx={{ float: 'right' }}
        >
          {t('add_user', lang)}
        </Button>
      </Typography>

      <Box display="flex" gap={2} mb={2} flexWrap={'wrap'}>
        <TextField
          label={t('search_by_username', lang)}
          value={search}
          className='input-control'
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

            <CSVLink
                data={filtered}
                headers={headers}
                filename="users.csv"
                style={{ textDecoration: 'none' }}
                >
                <Button variant="outlined">{t('export_csv', lang)}</Button>
                </CSVLink>
                
            </>
            )
        }
        
        
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          {/* <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 70 }}>{t('Sl No', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('profile', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('username', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('name', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('email', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('user_type', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('district', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('taluk', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 100 }}>{t('created_by', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 200 }}>{t('actions', lang)}</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', minWidth: 280 }}>{t('actions', lang)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .filter((user) => user.id !== profile?.id)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.serial_no}</TableCell>
                    <TableCell>
                      <Avatar
                        alt={user.username}
                        src={user.profile_photo ? `https://tnsltu.in/api/${user.profile_photo}` : ''}
                      >
                        {user.username?.[0]?.toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{t(user.user_type, lang) || '-'}</TableCell>
                    <TableCell>{user.district || '-'}</TableCell>
                    <TableCell>{user.taluk || '-'}</TableCell>
                    <TableCell>{user.created_by_username || '-'}</TableCell>
                    <TableCell align="right">

                      <Button
                          variant="contained"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => setSelectedUser(user)}
                        >
                          {t('Add Family Member', lang)}
                        </Button>
                      </TableCell>
                    <TableCell align="right">
                        <Button
                            variant="contained"
                            color="info"
                            size="small"
                            onClick={() => setViewUser(user)}
                            sx={{ mr: 1 }}
                            >
                        {t('view', lang)}
                        </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        startIcon={<Edit />}
                        onClick={() => openEditDialog(user)}
                      >
                        {t('edit', lang)}
                      </Button>
                      {
                        profile?.user_type === 'admin' && (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(user)}
                            sx={{ ml: 1 }}
                          >
                            {t('delete', lang)}
                          </Button>
                        )
                      }
                      
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table> */}
          <TableComponent header={headers} data={filtered} profile={profile} />
          {/* <TablePagination
            component="div"
            count={filtered.filter((user) => user.id !== profile?.id).length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          /> */}
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editUser ? t('edit_user', lang) : t('add_user', lang)}</DialogTitle>
        <DialogContent>
          <AddUserForm initialData={editUser} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
      

        <ViewUserDetails
            user={viewUser}
            open={!!viewUser}
            onClose={() => setViewUser(null)}
            lang={lang}
        />

        <AddEditFamilyMember
          user={selectedUser}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          lang={lang}
          onSaveLocal={() => {}}
        />




    </Paper>
  );
}

export default AllUsers;
