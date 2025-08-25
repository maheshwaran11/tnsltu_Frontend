import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
} from "@mui/material";
import html2canvas from "html2canvas";
import { t } from "../utils/i18n";
import IdBac from "./../assets/images/id_bac.jpg";
import { districtAddress } from "../data/locations";

function ViewIdCardDetails({ user, open, onClose, lang = "en" }) {
  const printRef = useRef();

 const [profileSrc, setProfileSrc] = useState();
 const [userDistrict, setUserDistrict] = useState("");

  useEffect(() => {
    if (user?.profile_photo) {
      const fullUrl = `//tnsltu.in/api/${user.profile_photo}`;
      toBase64(fullUrl).then((base64) => setProfileSrc(base64));
    }
  }, [user]);

  useEffect(() => {
  if (user?.district) {
    const filtered = districtAddress.filter(
      (item) => item.district === user.district
    );
    setUserDistrict(filtered);
    console.log(filtered);
  }
}, [user]);


const toBase64 = async (url) => {
  const res = await fetch(url, { mode: "cors" });
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};


  // 🔹 Capture card and download as PNG
  const handleDownload = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 1,
      useCORS: true,
    });
    const link = document.createElement("a");
    link.download = `ID_${user?.id || "card"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (!user || !open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>{t("view_id_card_details", lang)}</DialogTitle>

      <DialogContent dividers>
        {/* 🔹 ID Card Preview */}
        <Box
          ref={printRef}
          sx={{
            width: "1600px",
            height: "1200px",
            border: "1px solid #ccc",
            p: 2,
            borderRadius: 2,
            textAlign: "center",
            background: "#fff",
            backgroundImage: `url(${IdBac})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Text Fields */}
          <div
            style={{
              marginTop: "545px",
              marginLeft: "680px",
              textAlign: "left",
            }}
          >
            <Typography
              sx={{ fontWeight: "bold", fontSize: "36px", ml: 4, lineHeight: 1 }}
            >
              {user?.member_id}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "36px", ml: 4, mt: 2, lineHeight: 1 }}
            >
              {user?.id_card_name}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "36px", ml: 4, mt: 3, lineHeight: 1 }}
            >
              {user?.occupation}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "36px", ml: 4, mt: 3, lineHeight: 1 }}
            >
              {user?.position}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "36px", ml: 4, mt: 3, lineHeight: 1 }}
            >
              {user?.next_renewal_date}
            </Typography>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "36px", ml: 4, mt: 3, lineHeight: 1 }}
            >
              {user?.phone}
            </Typography>
            
          </div>

          <div style={{  }}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: "33px", mx: 4, mt: 18, lineHeight: 1.3, color: "#fff" }}
            >
              {userDistrict?.[0]?.address}
            </Typography>
          </div>

          {/* Profile Image */}
          {profileSrc && (
            <img
              src={profileSrc}
              alt="Profile"
              style={{
                width: "250px",
                height: "300px",
                marginLeft: "80px",
                marginTop: "-550px",
                display: "block",
                objectFit: "cover",
                borderRadius: "8px",
                border: "2px solid #333",
              }}
            />
          )}
        </Box>

        {/* 🔹 Download Button */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleDownload}>
            {t("download_card", lang)}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ViewIdCardDetails;
