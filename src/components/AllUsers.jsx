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

const roles = ['all', 'admin', 'subadmin', 'district_admin', 'taluk_admin', 'district_subadmin', 'taluk_subadmin', 'user'];

function AllUsers() {
  const { token, profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
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
    { label: 'Username', key: 'username' },
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'User Type', key: 'user_type' },
    { label: 'District', key: 'district' },
    { label: 'Taluk', key: 'taluk' },
    { label: 'Status', key: 'status' },
    { label: 'Category', key: 'category' }
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

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label={t('search_by_username', lang)}
          fullWidth
          value={search}
          onChange={handleSearch}
        />
        {
        profile?.user_type === 'admin' && (
            <>
          <TextField
            select
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Sl No', lang)}</TableCell>
                <TableCell>{t('profile', lang)}</TableCell>
                <TableCell>{t('username', lang)}</TableCell>
                <TableCell>{t('name', lang)}</TableCell>
                <TableCell>{t('email', lang)}</TableCell>
                <TableCell>{t('user_type', lang)}</TableCell>
                <TableCell>{t('district', lang)}</TableCell>
                <TableCell>{t('taluk', lang)}</TableCell>
                <TableCell>{t('created_by', lang)}</TableCell>
                {/* <TableCell>{t('category', lang)}</TableCell> */}
                <TableCell align="right">{t('actions', lang)}</TableCell>
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
                    {/* <TableCell><span className={`tag-label ${user.category}`}>{t(user.category, lang) || '-'}</span></TableCell> */}
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
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filtered.filter((user) => user.id !== profile?.id).length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
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




    </Paper>
  );
}

export default AllUsers;
