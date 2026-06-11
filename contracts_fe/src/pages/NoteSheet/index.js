import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  History,
  Send,
  StickyNote2,
  Visibility,
} from '@mui/icons-material';

import { noteService, contractService } from '../../services/contractService';
import { useAuthStore } from '../../store';

export default function NoteSheets() {
  const { user } = useAuthStore();
  const [noteSheets, setNoteSheets] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  // Noting entry fields
  const [newEntryContent, setNewEntryContent] = useState('');
  const [nextAction, setNextAction] = useState('Forward to Manager');

  // Form Fields for new sheet
  const [newSheetData, setNewSheetData] = useState({
    contract_id: '',
    file_no: '',
    initial_noting: '',
  });

  const fetchNoteSheets = () => {
    setLoading(true);
    noteService
      .list()
      .then((res) => {
        setNoteSheets(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load notesheets, loading mock:', err);
        setNoteSheets([
          {
            id: 'ns1',
            file_no: 'ERLDC/IT/2026/001-NOTE',
            status: 'Under Process',
            contract: { name: 'Annual Maintenance Contract for IT Equipment' },
            created_by: { name: 'Sh. Amit Kumar' },
            entries: [
              {
                id: 'e1',
                content: 'Proposed AMC renewal for IT Equipment for FY 2026-27. The estimated cost is ₹45 Lakhs. Recommended for administrative approval please.',
                action: 'Initiated',
                author: { name: 'Sh. Amit Kumar', department: 'Information Technology' },
                created_at: '2026-06-11T10:00:00',
              },
            ],
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNoteSheets();
    contractService.list().then((res) => {
      setContracts(res.data?.items || []);
    }).catch(() => {
      setContracts([{ id: '1', name: 'Annual Maintenance Contract for IT Equipment' }]);
    });
  }, []);

  const handleOpenDetail = (sheet) => {
    setLoading(true);
    noteService
      .get(sheet.id)
      .then((res) => {
        setSelectedSheet(res.data);
      })
      .catch(() => {
        setSelectedSheet(sheet);
      })
      .finally(() => {
        setDetailOpen(true);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setNewSheetData({
      contract_id: '',
      file_no: '',
      initial_noting: '',
    });
    setFormOpen(true);
  };

  const handleCreateSheet = (e) => {
    e.preventDefault();
    noteService
      .create(newSheetData)
      .then(() => {
        setFormOpen(false);
        fetchNoteSheets();
      })
      .catch(() => {
        alert('Note sheet initiated (Mock UI success)');
        setFormOpen(false);
        fetchNoteSheets();
      });
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newEntryContent) return;
    noteService
      .addEntry(selectedSheet.id, {
        content: newEntryContent,
        action: nextAction,
      })
      .then((res) => {
        setSelectedSheet(res.data);
        setNewEntryContent('');
        fetchNoteSheets();
      })
      .catch(() => {
        // Mock UI Append
        const mockEntry = {
          id: Math.random().toString(),
          content: newEntryContent,
          action: nextAction,
          author: { name: user?.name || 'Dev User', department: user?.department || 'IT' },
          created_at: new Date().toISOString(),
        };
        setSelectedSheet({
          ...selectedSheet,
          entries: [...selectedSheet.entries, mockEntry],
        });
        setNewEntryContent('');
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>eOffice Note Sheet Movement</Typography>
          <Typography variant="body2" color="text.secondary">Initiate administrative approvals, add green-ink notes, and track sheet movement history</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate} sx={{ borderRadius: 3, fontWeight: 600 }}>
          Create Note Sheet
        </Button>
      </Box>

      {/* List */}
      <Card sx={{ p: 2, borderRadius: 4 }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>File Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contract Works Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Initiator</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Note Entries</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {noteSheets.map((ns) => (
                  <TableRow
                    key={ns.id}
                    hover
                    onClick={() => handleOpenDetail(ns)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{ns.file_no}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{ns.contract?.name}</TableCell>
                    <TableCell>{ns.created_by?.name}</TableCell>
                    <TableCell align="center">{ns.entries?.length || 0}</TableCell>
                    <TableCell>
                      <Chip label={ns.status} size="small" color="primary" />
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenDetail(ns)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {selectedSheet && (
          <>
            <DialogTitle sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Noting Sheet</Typography>
              <Typography variant="caption" color="text.secondary">File: {selectedSheet.file_no}</Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 0, bgcolor: '#FEF9E7' }}> {/* Classic Yellow Note Sheet Background */}
              <Grid container sx={{ minHeight: '60vh' }}>
                {/* Left Noting Panel */}
                <Grid item xs={12} md={8} sx={{ borderRight: '1px solid rgba(0,0,0,0.1)', p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {selectedSheet.entries?.map((e, index) => (
                      <Box key={e.id} sx={{ position: 'relative', pl: 1 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#0B5345', fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.6 }}>
                          {e.content}
                        </Typography>
                        <Box sx={{ mt: 1.5, textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1B4F72' }}>
                            {e.author?.name} ({e.author?.department})
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Action: {e.action} | {new Date(e.created_at).toLocaleString()}
                          </Typography>
                        </Box>
                        {index < selectedSheet.entries.length - 1 && <Divider sx={{ mt: 2, borderColor: 'rgba(0,0,0,0.08)' }} />}
                      </Box>
                    ))}
                  </Box>
                </Grid>

                {/* Right Input Panel */}
                <Grid item xs={12} md={4} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>Add Note Entry</Typography>
                  <form onSubmit={handleAddEntry}>
                    <TextField
                      fullWidth
                      multiline
                      required
                      rows={6}
                      placeholder="Type your notes here in green ink format..."
                      value={newEntryContent}
                      onChange={(e) => setNewEntryContent(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      select
                      required
                      label="Next Action / Forward"
                      value={nextAction}
                      onChange={(e) => setNextAction(e.target.value)}
                      sx={{ mb: 3 }}
                    >
                      <MenuItem value="Forward to Manager">Forward to Manager</MenuItem>
                      <MenuItem value="Forward to General Manager">Forward to General Manager</MenuItem>
                      <MenuItem value="Approve & Clear">Approve & Sign Note</MenuItem>
                      <MenuItem value="Reject / Return">Return to Initiator</MenuItem>
                    </TextField>
                    <Button type="submit" variant="contained" fullWidth startIcon={<Send />}>
                      Submit Note
                    </Button>
                  </form>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Note Sheet Dialog */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleCreateSheet}>
          <DialogTitle sx={{ fontWeight: 800 }}>Create Noting Sheet</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              required
              fullWidth
              label="Select Contract"
              value={newSheetData.contract_id}
              onChange={(e) => setNewSheetData({ ...newSheetData, contract_id: e.target.value })}
            >
              {contracts.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              fullWidth
              label="eOffice File Ref Number"
              value={newSheetData.file_no}
              onChange={(e) => setNewSheetData({ ...newSheetData, file_no: e.target.value })}
            />
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Initial Noting / Work Proposal"
              placeholder="State the contract scope and recommended approval details..."
              value={newSheetData.initial_noting}
              onChange={(e) => setNewSheetData({ ...newSheetData, initial_noting: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Initiate Sheet</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
