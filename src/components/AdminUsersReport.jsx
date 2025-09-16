import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { t } from '../utils/i18n';


const API_URL = "https://tnsltu.in/api/getUserReports.php"; // 🔹 Your API

const UserReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lang, setLang] = useState('en');
  
  useEffect(() => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setReports(data);
        } else {
          setError(data.message || "Failed to fetch reports");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("API Error: " + err.message);
        setLoading(false);
      });
  }, []);

  // 🔹 Export to Excel (all details)
  const exportToExcel = () => {
    if (!reports?.data) return;

    const excelData = reports.data.flatMap((user) => {
      if (!user.family_members || user.family_members.length === 0) {
        return [
          {
            UserID: user.id,
            Username: user.username,
            Email: user.email,
            CreatedAt: user.created_at,
            UserType: user.details?.user_type || "",
            Name: user.details?.name || "",
            RelationType: user.details?.relation_type || "",
            Phone: user.details?.phone || "",
            Gender: user.details?.gender || "",
            DOB: user.details?.dob || "",
            Address: user.details?.address || "",
            District: user.details?.district || "",
            Taluk: user.details?.taluk || "",
            Zipcode: user.details?.zipcode || "",
            ProfilePhoto: user.details?.profile_photo || "",

            CardID: user.id_card?.id || "Not Generated",
            CardName: user.id_card?.name || "",
            Occupation: user.id_card?.occupation || "",
            Position: user.id_card?.position || "",
            CardNumber: user.id_card?.card_number || "Not Generated",
            IssueDate: user.id_card?.issue_date || "",
            ExpiryDate: user.id_card?.expiry_date || "",
            QRCode: user.id_card?.qr_code || "",
            Barcode: user.id_card?.barcode || "",
            CardStatus: user.id_card?.status || "",
            RegistrationDate: user.id_card?.registration_date || "",
            NextRenewalDate: user.id_card?.next_renewal_date || "",
            PreviousRenewalDate: user.id_card?.previous_renewal_date || "",
            CardCreatedAt: user.id_card?.created_at || "",
            CardUpdatedAt: user.id_card?.updated_at || "",

            FamilyMemberID: "",
            FamilyMemberName: "",
            FamilyRelation: "",
            Education: "",
            ClaimType: "",
            CurrentStatus: ""
          }
        ];
      }

      return user.family_members.map((fm) => ({
        UserID: user.id,
        Username: user.username,
        Email: user.email,
        CreatedAt: user.created_at,
        UserType: user.details?.user_type || "",
        Name: user.details?.name || "",
        RelationType: user.details?.relation_type || "",
        Phone: user.details?.phone || "",
        Gender: user.details?.gender || "",
        DOB: user.details?.dob || "",
        Address: user.details?.address || "",
        District: user.details?.district || "",
        Taluk: user.details?.taluk || "",
        Zipcode: user.details?.zipcode || "",
        ProfilePhoto: user.details?.profile_photo || "",

        CardID: user.id_card?.id || "Not Generated",
        CardName: user.id_card?.name || "",
        Occupation: user.id_card?.occupation || "",
        Position: user.id_card?.position || "",
        CardNumber: user.id_card?.card_number || "Not Generated",
        IssueDate: user.id_card?.issue_date || "",
        ExpiryDate: user.id_card?.expiry_date || "",
        QRCode: user.id_card?.qr_code || "",
        Barcode: user.id_card?.barcode || "",
        CardStatus: user.id_card?.status || "",
        RegistrationDate: user.id_card?.registration_date || "",
        NextRenewalDate: user.id_card?.next_renewal_date || "",
        PreviousRenewalDate: user.id_card?.previous_renewal_date || "",
        CardCreatedAt: user.id_card?.created_at || "",
        CardUpdatedAt: user.id_card?.updated_at || "",

        FamilyMemberID: fm.id,
        FamilyMemberName: fm.name,
        FamilyRelation: fm.relation,
        Education: fm.education,
        ClaimType: fm.claim_type,
        CurrentStatus: fm.current_status
      }));
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserReports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "user_reports.xlsx"
    );
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        User Reports
      </Typography>

      {/* 🔹 Summary */}
      <Box mb={2}>
        <Typography variant="h6">Summary</Typography>
        <ul>
          {reports?.summary?.map((s, index) => (
            <li key={index}>
              {s.user_type ? (
                <>
                  <b>{t(s.user_type, lang)}</b>: {s.total}
                </>
              ) : (
                <>
                  <b>{t(s.metric, lang)}</b>: {s.total}
                </>
              )}
            </li>
          ))}
        </ul>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={exportToExcel}
        sx={{ mb: 2 }}
      >
        Download Excel
      </Button>

      {/* 🔹 Full Data Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>UserID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>User Type</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>District</TableCell>
              <TableCell>Taluk</TableCell>
              <TableCell>FamilyMember</TableCell>
              <TableCell>Card Number</TableCell>
              <TableCell>Card Status</TableCell>
              <TableCell>Expiry</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports?.data?.map((user) =>
              user.family_members?.length > 0 ? (
                user.family_members.map((fm) => (
                  <TableRow key={`${user.id}-${fm.id}`}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.details?.user_type}</TableCell>
                    <TableCell>{user.details?.name}</TableCell>
                    <TableCell>{user.details?.phone}</TableCell>
                    <TableCell>{user.details?.gender}</TableCell>
                    <TableCell>{user.details?.district}</TableCell>
                    <TableCell>{user.details?.taluk}</TableCell>
                    <TableCell>
                      {fm.name} ({fm.relation})
                    </TableCell>
                    <TableCell>
                      {user.id_card?.card_number || "Not Generated"}
                    </TableCell>
                    <TableCell>{user.id_card?.status || "N/A"}</TableCell>
                    <TableCell>{user.id_card?.expiry_date || "N/A"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.details?.user_type}</TableCell>
                  <TableCell>{user.details?.name}</TableCell>
                  <TableCell>{user.details?.phone}</TableCell>
                  <TableCell>{user.details?.gender}</TableCell>
                  <TableCell>{user.details?.district}</TableCell>
                  <TableCell>{user.details?.taluk}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    {user.id_card?.card_number || "Not Generated"}
                  </TableCell>
                  <TableCell>{user.id_card?.status || "N/A"}</TableCell>
                  <TableCell>{user.id_card?.expiry_date || "N/A"}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserReports;
