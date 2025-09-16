import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, CircularProgress, TextField,
  Dialog, DialogTitle, DialogContent, Button, TablePagination, MenuItem, Box, Avatar
} from '@mui/material';
import { Edit, Delete, Description as DocIcon, AddCircle } from '@mui/icons-material';
import { CSVLink } from 'react-csv';

import { useAuth } from '../store';
import { getAllNoticeDocuments, deleteNoticeDocument } from '../api';
import { t } from '../utils/i18n';
import AddNoticeDocumentForm from './AddNoticeDocumentForm';

const categories = ['all', 'report', 'policy', 'financial', 'other'];

function AllNoticeDocuments() {
  const { token, profile } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [total, setTotal] = useState(0);

  const [lang, setLang] = useState('en');
  const [filterCategory, setFilterCategory] = useState('all');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await getAllNoticeDocuments(token);
      if (res.status === 200) {
        setDocuments(res.data || []);
        setTotal(res.total || 0);
        setFiltered(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchDocuments();
  }, [token]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    applyFilter(query, filterCategory);
  };

  const handleFilterCategory = (e) => {
    const selected = e.target.value;
    setFilterCategory(selected);
    applyFilter(search, selected);
  };

  const applyFilter = (searchQuery, categoryFilter) => {
    let data = [...documents];

    if (categoryFilter !== 'all') {
      data = data.filter((d) => d.category === categoryFilter);
    }

    if (searchQuery) {
      data = data.filter((d) => d.title?.toLowerCase().includes(searchQuery));
    }

    setFiltered(data);
    setPage(0);
  };

  const openCreateDialog = () => {
    setEditDoc(null);
    setOpenDialog(true);
  };

  const openEditDialog = (doc) => {
    setEditDoc(doc);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setEditDoc(null);
    setOpenDialog(false);
    fetchDocuments();
  };

  const handleDelete = async (doc) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${doc.title}?`);
    if (!confirmDelete) return;

    try {
      const res = await deleteNoticeDocument(doc.id, token);
      if (res.status === 200) {
        alert('Document deleted successfully.');
        fetchDocuments();
      } else {
        alert(res.message || 'Failed to delete document.');
      }
    } catch (error) {
      alert('Something went wrong while deleting document.');
    }
  };

  const headers = [
    { label: 'Title', key: 'title' },
    { label: 'Description', key: 'description' },
    { label: 'Category', key: 'category' },
    { label: 'Status', key: 'status' },
    { label: 'Created By', key: 'created_by_username' },
    { label: 'Created At', key: 'created_at' },
  ];

  return (
    <Paper sx={{ p: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        {t('all_documents', lang)} ({total})
        <Button
          variant="contained"
          startIcon={<AddCircle />}
          onClick={openCreateDialog}
          color="primary"
          sx={{ float: 'right' }}
        >
          {t('add_document', lang)}
        </Button>
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField
          label={t('search_by_title', lang)}
          fullWidth
          value={search}
          onChange={handleSearch}
        />

        <TextField
          select
          label={t('filter_by_category', lang)}
          value={filterCategory}
          onChange={handleFilterCategory}
          sx={{ minWidth: 180 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {t(cat, lang)}
            </MenuItem>
          ))}
        </TextField>

        <CSVLink
          data={filtered}
          headers={headers}
          filename="documents.csv"
          style={{ textDecoration: 'none' }}
        >
          <Button variant="outlined">{t('export_csv', lang)}</Button>
        </CSVLink>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ maxHeight: 'calc(100vh - 64px)', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('Sl No', lang)}</TableCell>
                <TableCell>{t('file', lang)}</TableCell>
                <TableCell>{t('title', lang)}</TableCell>
                <TableCell>{t('description', lang)}</TableCell>
                <TableCell>{t('category', lang)}</TableCell>
                <TableCell>{t('status', lang)}</TableCell>
                <TableCell>{t('created_by', lang)}</TableCell>
                <TableCell>{t('created_at', lang)}</TableCell>
                <TableCell align="right">{t('actions', lang)}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((doc, index) => (
                  <TableRow key={doc.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      {doc.file_url ? (
                        <a
                          href={`https://yourdomain.com/uploads/${doc.file_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Avatar>
                            <DocIcon />
                          </Avatar>
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{doc.title}</TableCell>
                    <TableCell>{doc.description || '-'}</TableCell>
                    <TableCell>{doc.category || '-'}</TableCell>
                    <TableCell>{t(doc.status, lang) || '-'}</TableCell>
                    <TableCell>{doc.created_by_username || '-'}</TableCell>
                    <TableCell>{doc.created_at || '-'}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        onClick={() =>
                          window.open(
                            `https://yourdomain.com/uploads/${doc.file_url}`,
                            '_blank'
                          )
                        }
                        sx={{ mr: 1 }}
                      >
                        {t('view', lang)}
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        startIcon={<Edit />}
                        onClick={() => openEditDialog(doc)}
                      >
                        {t('edit', lang)}
                      </Button>
                      {profile?.user_type === 'admin' && (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(doc)}
                          sx={{ ml: 1 }}
                        >
                          {t('delete', lang)}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Box>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editDoc ? t('edit_document', lang) : t('add_document', lang)}</DialogTitle>
        <DialogContent>
          <AddNoticeDocumentForm initialData={editDoc} onClose={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </Paper>
  );
}

export default AllNoticeDocuments;
