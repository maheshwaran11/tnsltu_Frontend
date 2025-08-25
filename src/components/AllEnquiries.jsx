import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, CircularProgress, Box, TableContainer,
  Drawer, IconButton, Divider, Card, CardContent, Button, Menu, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../store';
import { t } from '../utils/i18n';
import { getAllEnquiries, changeStatus, updateEnquiry } from '../api'; // ⬅️ new api

function AllEnquiries() {
  const { token } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang] = useState('en');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchAllEnquiries = async () => {
    setLoading(true);
    try {
      const res = await getAllEnquiries(token); // pass token
      if (res.status === 200) {
        setEnquiries(res.data || []);
      } else {
        setEnquiries([]);
      }
    } catch (err) {
      console.error(err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAllEnquiries();
  }, [token]);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleString();
  };

  const handleRowClick = async (enquiry) => {
    try {
      const response = await updateEnquiry(enquiry.id, { isRead: 1, status: enquiry.status }, token);
      if (response.status === 200) {
        setEnquiries((prev) =>
          prev.map((e) =>
            e.id === enquiry.id ? { ...e, isRead: 1 } : e
          )
        );
        setSelectedEnquiry({ ...enquiry, isRead: 1 });
        setDrawerOpen(true);
      }
    } catch (err) {
      console.error("Failed to update enquiry:", err);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedEnquiry(null);
  };

  // 🔹 Handle status change
  const handleStatusChange = async (newStatus) => {
    if (!selectedEnquiry) return;

    try {
      const response = await changeStatus(selectedEnquiry.id, { status: newStatus }, token);
      if (response.status === 200) {
        // update table + drawer
        fetchAllEnquiries();
        setAnchorEl(null);
        setSelectedEnquiry((prev) => ({ ...prev, status: newStatus }));
        // handleCloseDrawer();
      }
    } catch (err) {
      console.error("Failed to change status:", err);
    }
  };

  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {t('all_enquiries', lang)}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : enquiries.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          {t('no_enquiries_found', lang)}
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('sl_no', lang)}</TableCell>
                <TableCell>{t('name', lang)}</TableCell>
                <TableCell>{t('phone', lang)}</TableCell>
                <TableCell>{t('email', lang)}</TableCell>
                <TableCell>{t('district', lang)}</TableCell>
                <TableCell>{t('taluk', lang)}</TableCell>
                <TableCell>{t('service', lang)}</TableCell>
                <TableCell>{t('status', lang)}</TableCell>
                <TableCell>{t('is_read', lang)}</TableCell>
                <TableCell>{t('created_on', lang)}</TableCell>
                <TableCell>{t('action', lang)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquiries.map((enquiry, index) => (
                <TableRow
                  key={enquiry.id}
                  hover
                  onClick={() => handleRowClick(enquiry)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: enquiry.isRead ? 'inherit' : '#f5f9ff',
                    '& .MuiTableCell-root': {
                      fontWeight: enquiry.isRead ? 400 : 700,
                    },
                    '&:hover': {
                      backgroundColor: enquiry.isRead ? 'action.hover' : '#e3efff',
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{enquiry.name}</TableCell>
                  <TableCell>{enquiry.phone}</TableCell>
                  <TableCell>{enquiry.email}</TableCell>
                  <TableCell>{enquiry.district}</TableCell>
                  <TableCell>{enquiry.taluk}</TableCell>
                  <TableCell>{enquiry.service}</TableCell>
                  <TableCell><span className={`status ${enquiry.status}`}>{enquiry.status}</span></TableCell>
                  <TableCell>{enquiry.isRead ? t('read', lang) : t('unread', lang)}</TableCell>
                  <TableCell>{formatDateTime(enquiry.created_on)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleRowClick(enquiry)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: 380, p: 2, borderRadius: "12px 0 0 12px" }
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{t('enquiry_details', lang)}</Typography>
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />

        {selectedEnquiry && (
          <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedEnquiry.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedEnquiry.email} • {selectedEnquiry.phone}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2">
                <strong>{t('district', lang)}:</strong> {selectedEnquiry.district}
              </Typography>
              <Typography variant="body2">
                <strong>{t('taluk', lang)}:</strong> {selectedEnquiry.taluk}
              </Typography>
              <Typography variant="body2">
                <strong>{t('service', lang)}:</strong> {selectedEnquiry.service}
              </Typography>
              <Typography variant="body2">
                <strong>{t('status', lang)}:</strong> <span className={`status ${selectedEnquiry.status}`}>{selectedEnquiry.status}</span>
              </Typography>
              <Button
                size="small"
                variant="contained"
                sx={{ mt: 1 }}
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                Change Status
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => handleStatusChange('pending')}>Pending</MenuItem>
                <MenuItem onClick={() => handleStatusChange('in_progress')}>In Progress</MenuItem>
                <MenuItem onClick={() => handleStatusChange('completed')}>Completed</MenuItem>
                <MenuItem onClick={() => handleStatusChange('submitted')}>Submitted</MenuItem>
                <MenuItem onClick={() => handleStatusChange('contacted')}>Contacted</MenuItem>
              </Menu>

              <Typography variant="body2" color={selectedEnquiry.isRead ? "green" : "red"} sx={{ mt: 1 }}>
                <strong>{t('is_read', lang)}:</strong>{" "}
                {selectedEnquiry.isRead ? t('read', lang) : t('unread', lang)}
              </Typography>
              <Typography variant="body2">
                <strong>{t('created_on', lang)}:</strong>{" "}
                {formatDateTime(selectedEnquiry.created_on)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" fontWeight="bold">
                {t('message', lang)}
              </Typography>
              <Typography variant="body2">{selectedEnquiry.message}</Typography>
            </CardContent>
          </Card>
        )}
      </Drawer>
    </Paper>
  );
}

export default AllEnquiries;
