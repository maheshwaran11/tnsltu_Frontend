import React, { useState, useEffect } from "react";
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

const relations = ["Father", "Mother", "Brother", "Sister", "Spouse", "Child"];
const genders = ["Male", "Female", "Other"];
const educationOptions = [
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "B.Sc",
  "B.A",
  "B.Com",
  "B.Tech",
  "M.Sc",
  "M.A",
  "M.Com",
  "M.Tech",
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

  // Resolve full member object from ID
  const selectedMember = editMember
    ? user?.family_members?.find((m) => m.id === editMember) || null
    : null;

  // Generate academic years dynamically
  const currentYear = new Date().getFullYear();
  const academicYears = Array.from({ length: 20 }, (_, i) => currentYear - i).reverse();

  // Reset / Prefill form when dialog opens
  useEffect(() => {
    if (selectedMember) {
      setFormData({
        ...selectedMember,
        dob: selectedMember.dob ? selectedMember.dob.split("T")[0] : "",
      });
    } else {
      setFormData(initialEmptyForm);
    }
  }, [selectedMember, open]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate final year based on joining year + duration
    if (name === "joining_year" || name === "course_duration") {
      const joining = parseInt(
        name === "joining_year" ? value : updatedData.joining_year
      );
      const duration = parseInt(
        name === "course_duration" ? value : updatedData.course_duration
      );
      if (joining && duration) {
        updatedData.final_year = joining + duration - 1;
      } else {
        updatedData.final_year = "";
      }
    }

    setFormData(updatedData);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!formData.name || !formData.relation || !formData.dob) {
        return alert(t("please_fill_required_fields", lang));
    }

    let payload = { ...formData };

    if (editMember) {
        payload.family_id = editMember.id;  // 👈 send family_id when editing
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
            />
          </Grid>

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

          {/* Show course details only if higher education */}
          {formData.education &&
            !["6th", "7th", "8th", "9th", "10th", "11th", "12th"].includes(
              formData.education
            ) && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label={t("course_duration", lang)}
                    name="course_duration"
                    value={formData.course_duration}
                    onChange={handleChange}
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
                  >
                    {academicYears.map((num) => (
                      <MenuItem key={num} value={num}>
                        {num}
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
              label={t("claim_type", lang)}
              name="claim_type"
              value={formData.claim_type}
              onChange={handleChange}
              fullWidth
              margin="dense"
            >
              {claims.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

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
                  {s}
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
