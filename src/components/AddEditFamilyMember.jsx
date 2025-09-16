import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { t } from "../utils/i18n";
import { saveFamilyMemberDetails } from "../api";
import { useAuth } from "../store";

const relations = ['Father', 'Mother', 'Husband', 'Other'];
const genders = ["Male", "Female", "Other"];
const educationOptions = [
  "6th",
  "7th",
  "8th",
  "9th",
  "10th Studying",
  "10th Completed",
  "11th Studying",
  "11th Completed",
  "12th Studying",
  "12th Completed",
  "Diploma 1st Year",
  "Diploma 2nd Year",
  "Diploma 3rd Year",
  "UG 1st Year",
  "UG 2nd Year",
  "UG 3rd Year",
  "UG 4th Year",
  "PG 1st Year",
  "PG 2nd Year",
  "Phd 1st Year",
  "Phd 2nd Year",
  "Phd 3rd Year",
  "Phd 4th Year",
];
const statuses = ["applied", "not applied", "approved", "rejected", "returned"];
const claims = ["education", "marriage", "old_age_pension", "others"];

const initialEmptyForm = {
  name: "",
  relation: "",
  gender: "",
  dob: "",
  education: "",
  course_duration: "",
  joining_year: "",
  final_year: "",
  current_status: "",
  claim_type: "",
};

export default function AddEditFamilyMember({
  user, // parent account holder
  editMember = null, // just an ID
  open,
  onClose,
  lang = "en",
  onSaveLocal,
}) {
  const { token } = useAuth();
  const [formData, setFormData] = useState(initialEmptyForm);
  const [errors, setErrors] = useState({});

  console.log({user});

  // Resolve full member object from ID
  const selectedMember = editMember
    ? user?.family_members?.find((m) => m.id === editMember) || null
    : null;

  // Generate academic years dynamically (memoized)
  const academicYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 20 }, (_, i) => {
      const start = currentYear - i;
      return `${start}-${start + 1}`;
    }).reverse();
  }, []);

  // Reset / Prefill form when dialog opens
  const normalizeDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0].split(" ")[0]; // handles both "2021-10-29 00:00:00" and "2021-10-29T00:00:00"
  };

  useEffect(() => {
    if (selectedMember) {
      setFormData({
        ...selectedMember,
        dob: normalizeDate(selectedMember.dob),
      });
    } else {
      setFormData(initialEmptyForm);
    }
    setErrors({});
  }, [selectedMember, open]);


  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate final year based on joining year + duration
    if (name === "joining_year" || name === "course_duration") {
      const joiningYear = updatedData.joining_year; // "2024-2025"
      const duration = parseInt(
        name === "course_duration" ? value : updatedData.course_duration
      );

      if (joiningYear && duration) {
        const startYear = parseInt(joiningYear.split("-")[0]); // e.g. 2024
        const finalStart = startYear + duration - 1; // e.g. 2026
        updatedData.final_year = `${finalStart}-${finalStart + 1}`;
      } else {
        updatedData.final_year = "";
      }
    }

    setFormData(updatedData);
  };

  // Validation
  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = t("required", lang);
    if (!formData.relation) newErrors.relation = t("required", lang);
    if (!formData.dob) newErrors.dob = t("required", lang);
    if (!formData.gender) newErrors.gender = t("required", lang);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validate()) return;

    let payload = { ...formData };

    if (selectedMember) {
      payload.family_id = selectedMember.id; // ✅ fixed bug
    }

    const res = await saveFamilyMemberDetails(user.id, payload, token);

    if (res.status === 200 || res.status === 201) {
      alert(t("saved_successfully", lang));
      if (typeof onSaveLocal === "function") {
        onSaveLocal(user.id, res.data);
      }
      onClose();
    } else {
      alert(t("save_failed", lang) + (res?.message || ""));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {selectedMember ? t("edit_family_member", lang) : t("add_family_member", lang)}
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} className="form-grid">
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("name", lang)}
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t("relation", lang)}
              name="relation"
              value={formData.relation}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.relation}
              helperText={errors.relation}
            >
              {relations.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t("gender", lang)}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              margin="dense"
              required
              error={!!errors.gender}
              helperText={errors.gender}
            >
              {genders.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label={t("dob", lang)}
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              fullWidth
              margin="dense"
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.dob}
              helperText={errors.dob}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t("claim_type", lang)}
              name="claim_type"
              value={formData.claim_type}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {claims.map((s) => (
                <MenuItem key={s} value={s}>
                  {t(s, lang)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {formData.claim_type === 'education' && (
            <>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label={t("education", lang)}
                name="education"
                value={formData.education}
                onChange={handleChange}
                fullWidth
                margin="dense"
              >
                {educationOptions.map((e) => (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label={t("course_duration", lang)}
                name="course_duration"
                value={formData.course_duration}
                onChange={handleChange}
                disabled={!formData.education}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label={t("joining_year", lang)}
                name="joining_year"
                value={formData.joining_year}
                onChange={handleChange}
                fullWidth
                disabled={!formData.education}
              >
                {academicYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label={t("final_year", lang)}
                name="final_year"
                value={formData.final_year}
                disabled
                fullWidth
                margin="dense"
              />
            </Grid>

          </>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              select
              label={t("current_status", lang)}
              name="current_status"
              value={formData.current_status}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {statuses.map((s) => (
                <MenuItem key={s} value={s}>
                  {t(s, lang)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t("cancel", lang)}
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {t("save", lang)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
