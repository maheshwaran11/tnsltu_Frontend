import React, { useEffect, useState, useMemo } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, CircularProgress, Box,
  TableContainer, Button, TextField, Grid,
  IconButton
} from '@mui/material';
import { t } from '../utils/i18n';
import { useAuth } from '../store';

import {createNotification, getNotifications, deleteNotification} from './../api'; // Adjust the import based on your API structure

// 🔹 Notification Types (for filtering/adding)
const NOTIFICATION_TYPES = ["image_notification", "event_notification"];

function Notifications() {
      const { token } = useAuth();
    
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang] = useState("en");
  

  // 🔹 Filters
  const [typeFilter, setTypeFilter] = useState("");

  // 🔹 Form state for adding new notification
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    date: "",
    type: "",
    image: null,
  });

  // ✅ Fetch all notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications(token);
      if (res.status === 200) {
        setNotifications(res.data || []);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


const handleAddNotification = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", newNotification.title.trim());
  formData.append("message", newNotification.message.trim());
  formData.append("date", newNotification.date || new Date().toISOString().split("T")[0]);
  if (newNotification.type) {
    formData.append("type", newNotification.type);
  }
  if (newNotification.image) {
    formData.append("image", newNotification.image);
  }

  // 🔹 Debug FormData
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const res = await createNotification(formData, token);
    if (res.status === 200 || res.status === 201) {
      setNewNotification({ title: "", message: "", date: "", type: "", image: null });
      fetchNotifications();
    } else {
      console.error("Failed to create notification:", res.message);
    }
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};

const handleDeleteNotification = async (id) => {
  if (!window.confirm(t("confirm_delete_notification", lang))) return;

  try {
    const res = await deleteNotification(id, token);
    if (res.status === 200) {
      fetchNotifications();
    } else {
      console.error("Failed to delete notification:", res.message);
    }
  } catch (err) {
    console.error("Error deleting notification:", err);
  }
};

  // ✅ Apply filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      return typeFilter ? n.type === typeFilter : true;
    });
  }, [notifications, typeFilter]);

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
    <Paper sx={{ p: 2, overflow: "auto" }}>
      <Typography variant="h6" gutterBottom>
        {t("notifications", lang)}
      </Typography>

      {/* 🔹 Add New Notification Form */}
      <Box component="form" onSubmit={handleAddNotification} sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
            className='input-control'
              label={t("title", lang)}
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
            className='input-control'
              label={t("message", lang)}
              value={newNotification.message}
              onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
            className='input-control'
              type="date"
              label={t("date", lang)}
              InputLabelProps={{ shrink: true }}
              value={newNotification.date}
              onChange={(e) => setNewNotification({ ...newNotification, date: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <select
            className='input-control'
              style={{ width: "100%", padding: "10px", borderRadius: "4px" }}
              value={newNotification.type}
              onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
            >
              <option value="">{t("select_type", lang)}</option>
              {NOTIFICATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(type, lang)}
                </option>
              ))}
            </select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
            className='input-control'
              type="file"
              accept="image/*"
              onChange={(e) => setNewNotification({ ...newNotification, image: e.target.files[0] })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              {t("add_notification", lang)}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* 🔹 Notification List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredNotifications.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          {t("no_notifications_found", lang)}
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("id", lang)}</TableCell>
                <TableCell>{t("title", lang)}</TableCell>
                <TableCell>{t("message", lang)}</TableCell>
                <TableCell>{t("date", lang)}</TableCell>
                <TableCell>{t("type", lang)}</TableCell>
                <TableCell>{t("image", lang)}</TableCell>
                <TableCell>{t("created_on", lang)}</TableCell>
                <TableCell>{t("action", lang)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredNotifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>{n.id}</TableCell>
                  <TableCell>{n.title}</TableCell>
                  <TableCell>{n.message}</TableCell>
                  <TableCell>{formatDate(n.date)}</TableCell>
                  <TableCell>{n.type}</TableCell>
                  <TableCell>
                    {n.image_url ? (
                      <img src={n.image_url} alt="notification" width={60} />
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(n.created_on)}</TableCell>
                  <TableCell>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteNotification(n.id)}
                        sx={{ ml: 1 }}
                        >
                        {t('delete', lang)}
                        </Button>
                        
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default Notifications;
