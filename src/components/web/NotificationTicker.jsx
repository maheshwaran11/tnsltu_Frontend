import React from "react";
import { Box, Link } from "@mui/material";

// 📌 Sample Notifications
const notifications = [
  { id: 1, text: "Community Health Camp scheduled on Aug 25th.", link: "#" },
  { id: 2, text: "Wellness Program registrations are now open.", link: "#" },
  { id: 3, text: "System upgrade completed successfully.", link: "#" },
  { id: 4, text: "Emergency helpline available 24/7.", link: "#" },
];

export default function NotificationTicker() {
  return (
    <Box
      sx={{
        background: "linear-gradient(90deg, #999999, #060f068f)",
        color: "#fff",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        borderRadius: 1,
        boxShadow: 2,
        py: 2,
        mt: 4,
      }}
    >
      {/* 🔔 Fixed Label */}
      <Box
        sx={{
          flexShrink: 0,
          px: 4,
          py: 1,
          fontWeight: "bold",
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        Notifications
      </Box>

      {/* 📜 Scrolling Text */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "inline-block",
            animation: "scroll 10s linear infinite",
            "&:hover": { animationPlayState: "paused" },
            "@keyframes scroll": {
              "0%": { transform: "translateX(0%)" },
              "25%": { transform: "translateX(50%)" },
              "50%": { transform: "translateX(100%)" },
              "75%": { transform: "translateX(-50%)" },
              "100%": { transform: "translateX(-100%)" },
            },
          }}
        >
          {[...notifications, ...notifications].map((note, idx) => (
            <Link
              key={idx}
              href={note.link}
              underline="none"
              sx={{
                color: "inherit",
                fontSize: { xs: "0.85rem", sm: "1rem" },
                fontWeight: 500,
                mx: 4,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {note.text}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
