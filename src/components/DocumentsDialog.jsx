import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
} from "@mui/material";

export const documentsData = [
  {
    id: 1,
    title: "புதிய பதிவு / புதுப்பித்தல் | New Register / Renewal",
    forms: [
      "1.போட்டோ/Photo-2"
    ],
    docs: [
      "ஆதார் அட்டை / Aadhaar Card (Mobile number must be linked)",
      "குடும்ப அட்டை / Ration Card",
      "தேசியமயமாக்கப்பட்ட வங்கி கணக்கு புத்தகம் / Bank Pass Book",
      "வாரிசுதாரரின் ஆதார் அட்டை / Nominee Aadhaar Card",
      "சாதி சான்றிதழ் (SC/ST மட்டும்)",
      "ஓட்டுனர் உரிமம் (ஓட்டுனர் என்றால் மட்டும்)",
      "நலவாரிய அசல் அட்டை (புதுப்பித்தலுக்கு மட்டும்)",
    ],
  },
  {
    id: 2,
    title: "திருமண உதவிதொகை / Marriage Assistance",
    forms: [
      "Construction Workers Welfare Board - Form – E",
      "Drivers Workers Welfare Board - Form – XI",
      "Other 15 Manual Workers Welfare Boards - Form – X",
    ],
    docs: [
      "Marriage Registration Certificate OR Certificate by VAO / RI (Chennai only) / MLA / MP / Local Body representative",
      "Marriage hall receipt / Temple receipt",
      "Marriage Invitation",
      "Marriage Photo",
      "Age Proof (Birth Certificate / School Certificate / Voter ID / Ration Card / DL)",
      "Employment Verification Certificate (for Construction Workers Welfare Board Members)",
      "Employment Verification Certificate (for Other 16 Boards)",
    ],
    notes: [
      "Registered member can apply for themselves or their son/daughter.",
      "Bride must be 18+ and Groom must be 21+ on marriage date.",
      "Marriage Invitation must have printing press details.",
      "Marriage Certificate should mention whether it is first marriage.",
      "Marriage assistance can be claimed only for 2 marriages per member’s family.",
    ],
  },
  {
    id: 3,
    title: "மகப்பேறு உதவிதொகை / Maternity Assistance",
    forms: [
      "Construction Workers Welfare Board - Form – G",
      "Drivers Workers Welfare Board - Form – XV",
      "Other 15 Manual Workers Welfare Boards - Form – XIV",
    ],
    docs: [
      "Pregnancy Certificate (7–9 months, from Govt. Civil Asst. Surgeon)",
      "Child Birth Certificate (2–5 months after delivery)",
      "Miscarriage / Termination Certificate (from Govt. Civil Asst. Surgeon)",
      "Employment Verification Certificate",
    ],
    notes: [
      "Apply between 7–9 months pregnancy for 1st installment.",
      "Apply between 2–5 months after delivery for 2nd installment.",
      "Not applicable if already has 2 children.",
      "Medical Certificate must specify 1st or 2nd child.",
      "Only registered female members can apply.",
      "Can avail maternity assistance only twice.",
    ],
  },
  {
    id: 4,
    title:
      "பணியிடத்து விபத்து மரணம் / ஊனம் உதவித்தொகை | Worksite Accidental Death / Disability Assistance",
    forms: [
      "Registered & Unregistered Construction Workers - Form – B1",
      "Accident Intimation Form – B",
    ],
    docs: [
      "Death Certificate (Original)",
      "Legal Heir Certificate (if nominee not given)",
      "Post-mortem Certificate (Attested Copy)",
      "First Information Report (Attested Copy)",
      "Accident Intimation Form",
      "Original ID Card (if Registered Member)",
      "Family Card (Original)",
      "Aadhaar Card (Deceased + Applicant)",
      "Bank Passbook (Original)",
      "Disability Certificate (for Accident Disability)",
      "Discharge Summary Report (for Accident Disability)",
    ],
    notes: [
      "Applications must be submitted by nominee or legal heir.",
      "FIR must be obtained from concerned jurisdiction Police Station.",
      "FIR and Post-mortem must be attested by authorized officers.",
      "Accident Intimation Form must be from employer.",
      "Deceased/disabled person must have been working in construction.",
      "Not eligible if employed in ESI/PF covered establishments.",
      "Disability assistance only if accident occurred at worksite.",
      "Doctor’s certificate must mention disability % with seal & reg. no.",
    ],
  },
  {
    id: 5,
    title: "கல்வி உதவித்தொகை / Education Assistance",
    forms: [],
    docs: [
      "Labour Card (Original)",
      "Aadhaar Card",
      "Ration Card",
      "Bank Passbook",
      "Mark Sheet (10th/12th, Original)",
      "Bonafide Certificate (Original)",
      "Student Aadhaar",
    ],
  },
];


const DocumentsDialog = ({ open, onClose, serviceId }) => {
    const service = documentsData.find((item) => item.id === serviceId);
  console.log("Selected service:", service);
  if (!service) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{service.title}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6">விண்ணப்பிக்க வேண்டிய படிவங்கள் :</Typography>
        <List>
          {service.forms.map((form, i) => (
            <ListItem key={i}>👉 {form}</ListItem>
          ))}
        </List>

        <Typography variant="h6" sx={{ mt: 2 }}>
          பதிவேற்றம் செய்யப்பட வேண்டிய ஆவணங்கள் :
        </Typography>
        <List>
          {service.docs.map((doc, i) => (
            <ListItem key={i}>📄 {doc}</ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentsDialog;
