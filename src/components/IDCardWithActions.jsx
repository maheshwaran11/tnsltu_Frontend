import React, { useRef } from 'react';
import { Button, Box } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function IDCardWithActions({ userData, lang = 'en', t }) {
  const cardRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => cardRef.current,
  });

  const handleDownloadPDF = async () => {
    const element = cardRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [500, 400],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, 500, 400);
    pdf.save(`${userData.username}_idcard.pdf`);
  };

  return (
    <Box>
      {/* Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2}>
        <Button variant="outlined" onClick={handlePrint}>
          Print ID Card
        </Button>
        <Button variant="contained" onClick={handleDownloadPDF}>
          Download PDF
        </Button>
      </Box>

      {/* ID Card */}
      <div
        ref={cardRef}
        style={{
          width: '500px',
          height: '400px',
          backgroundColor: '#f0f4f8',
          padding: '20px',
          border: '2px solid #1976d2',
          borderRadius: '10px',
          color: '#333',
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <img
            src={userData.profile_photo ? `https://tnsltu.in/api/${userData.profile_photo}` : ''}
            alt="Profile"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #1976d2',
              marginBottom: '10px',
            }}
          />
          <h2 style={{ margin: 0 }}>{userData.username}</h2>
          <p style={{ margin: 0 }}>{t(userData.user_type, lang)}</p>
        </div>

        <hr style={{ margin: '15px 0', borderColor: '#1976d2' }} />

        <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
          <p><strong>{t('email', lang)}:</strong> {userData.email}</p>
          <p><strong>{t('district', lang)}:</strong> {userData.district || '-'}</p>
          <p><strong>{t('taluk', lang)}:</strong> {userData.taluk || '-'}</p>
          <p><strong>{t('status', lang)}:</strong> {t(userData.status, lang)}</p>
          <p><strong>{t('dob', lang)}:</strong> {userData.dob || '-'}</p>
          <p><strong>{t('phone', lang)}:</strong> {userData.phone || '-'}</p>
        </div>

        <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
          <p>{t('generated_on', lang)}: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </Box>
  );
}

export default IDCardWithActions;
