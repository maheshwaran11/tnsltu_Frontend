import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Card,
  Typography,
  Divider,
  Drawer,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// 📅 helper to format date
const formatDate = (dateStr) => {
  const dateObj = new Date(dateStr);
  const day = dateObj.toLocaleDateString("en-US", { day: "2-digit" });
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const year = dateObj.getFullYear();
  return { day, month, year };
};

export default function Notifications({notificationsList}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNotifications(notificationsList);
  }, [notificationsList]);

  const handleOpenDrawer = (note) => {
    setSelectedNote(note);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedNote(null);
  };

  return (
    <Container
      sx={{
        my: 6,
        width: "100%",
        px: { xs: 2, sm: 3, md: 1 }, // ✅ Responsive padding
      }}
    >
      {/* 🔔 Header */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "var(--color-primary)",
            display: "inline-block",
            px: 2,
          }}
        >
          Latest Notifications
          <Box
            sx={{
              height: 3,
              width: "60%",
              background: "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
              borderRadius: 2,
              mx: "auto",
              mt: 1,
            }}
          />
        </Typography>
      </Box>

      {/* 📋 Notifications Card */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 6,
          p: { xs: 1.5, sm: 2 },
          maxHeight: 500,
          overflow: "hidden",
          height: { xs: 300, sm: 400, md: 500 },
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress sx={{ color: "var(--color-primary)" }} />
          </Box>
        ) : notifications?.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="body2" color="text.secondary">
              No notifications available
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: 560,
              overflowY: "auto",
              pr: 1,
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: "linear-gradient(180deg, var(--color-primary), var(--color-accent))",
                borderRadius: "6px",
              },
              "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
            }}
          >
            {notifications?.map((note, index) => {
              const { day, month, year } = formatDate(note.date);
              return (
                <Box key={note.id}>
                  <Box
                    onClick={() => handleOpenDrawer(note)}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mb: 3,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      p: { xs: 1, sm: 1.5 },
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(3, 129, 117, 0.08)", // primary with opacity
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    {/* 📅 Date */}
                    <Box
                      sx={{
                        minWidth: "70px",
                        pr: 2,
                        textAlign: "center",
                        color: "var(--color-primary)",
                      }}
                    >
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        lineHeight={1}
                        sx={{ mb: 0.5, fontSize: { xs: "1.5rem", sm: "2rem" } }}
                      >
                        {day}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          fontWeight: 600,
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                        }}
                      >
                        {month} {year}
                      </Typography>
                    </Box>

                    {/* 📌 Content */}
                    <Box
                      sx={{
                        flex: 1,
                        borderLeft: "2px solid #e0e0e0",
                        pl: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                          color: "text.primary",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        {note.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          fontSize: { xs: "0.8rem", sm: "0.9rem" },
                        }}
                      >
                        {note.message}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Divider except last */}
                  {index !== notifications.length - 1 && (
                    <Divider sx={{ mb: 2 }} />
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Card>

      {/* 🔹 Drawer for Details */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 500 },
            p: 3,
            borderRadius: "12px 0 0 12px",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ color: "var(--color-primary)" }}>
            Notification Details
          </Typography>
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />

        {selectedNote && (
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 1, color: "var(--color-primary)" }}
            >
              {selectedNote.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedNote.message}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              {new Date(selectedNote.date).toDateString()}
            </Typography>
          </Box>
        )}
      </Drawer>
    </Container>
  );
}
