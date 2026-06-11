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
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Search,
  Visibility,
  Warning,
  CheckCircle,
} from '@mui/icons-material';

import { slaService, contractService } from '../../services/contractService';

export default function SLA() {
  const [breaches, setBreaches] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedBreach, setSelectedBreach] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    contract_id: '',
    metric_name: 'System Uptime',
    breach_date: '',
    penalty_amount: '',
    remarks: '',
  });

  const [resolveData, setResolveData] = useState({
    resolved_remarks: '',
    penalty_applied: '',
  });

  const [resolveOpen, setResolveOpen] = useState(false);

  const fetchBreaches = () => {
    setLoading(true);
    slaService
      .listBreaches()
      .then((res) => {
        setBreaches(Array.isArray(res.data) ? res.data : (res.data?.breaches || res.data?.items || []));
      })
      .catch((err) => {
        console.error('Failed to load SLA breaches, using mock:', err);
        setBreaches([
          {
            id: 'b1',
            metric_name: 'System Availability < 99.5%',
            breach_date: '2026-06-01',
            penalty_amount: 50000,
            status: 'Open',
            contract: { name: 'Annual Maintenance Contract for IT Equipment', contract_no: 'ERLDC/IT/AMC/2026/001' },
          },
          {
            id: 'b2',
            metric_name: 'Response Time Delayed > 4 Hours',
            breach_date: '2026-05-18',
            penalty_amount: 15000,
            status: 'Resolved',
            resolved_date: '2026-05-20',
            contract: { name: 'Network Infrastructure Upgrade', contract_no: 'ERLDC/IT/NET/2026/002' },
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBreaches();
    contractService.list().then((res) => {
      setContracts(res.data?.contracts || res.data?.items || []);
    }).catch(() => {
      setContracts([{ id: '1', name: 'Annual Maintenance Contract for IT Equipment' }]);
    });
  }, []);

  const handleOpenDetail = (breach) => {
    setSelectedBreach(breach);
    setDetailOpen(true);
  };

  const handleOpenCreate = () => {
    setFormData({
      contract_id: '',
      metric_name: 'System Uptime',
      breach_date: '',
      penalty_amount: '',
      remarks: '',
    });
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    slaService
      .reportBreach(formData)
      .then(() => {
        setFormOpen(false);
        fetchBreaches();
      })
      .catch(() => {
        alert('SLA breach logged (Mock UI success)');
        setFormOpen(false);
        fetchBreaches();
      });
  };

  const handleResolveOpen = () => {
    setResolveData({
      resolved_remarks: '',
      penalty_applied: selectedBreach.penalty_amount,
    });
    setResolveOpen(true);
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    slaService
      .resolveBreach(selectedBreach.id, resolveData)
      .then(() => {
        setResolveOpen(false);
        setDetailOpen(false);
        fetchBreaches();
      })
      .catch(() => {
        alert('Breach resolved successfully (Mock UI success)');
        setResolveOpen(false);
        setDetailOpen(false);
        fetchBreaches();
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>SLA & Service Matrices</Typography>
          <Typography variant="body2" color="text.secondary">Monitor service level commitments, document uptime breach events, and calculate penalties</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate} sx={{ borderRadius: 3, fontWeight: 600 }}>
          Log SLA Breach
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
                  <TableCell sx={{ fontWeight: 600 }}>Breach Reference</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contract Works</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Penalty (Est)</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Log Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {breaches.map((b) => (
                  <TableRow
                    key={b.id}
                    hover
                    onClick={() => handleOpenDetail(b)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.metric_name}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{b.contract?.name}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main' }}>
                      ₹{b.penalty_amount?.toLocaleString()}
                    </TableCell>
                    <TableCell>{b.breach_date}</TableCell>
                    <TableCell>
                      <Chip label={b.status} size="small" color={b.status === 'Open' ? 'error' : 'success'} />
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenDetail(b)}>
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
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        {selectedBreach && (
          <>
            <DialogTitle>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>SLA Breach Details</Typography>
              <Typography variant="caption" color="text.secondary">Metric: {selectedBreach.metric_name}</Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Associated Contract</Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedBreach.contract?.name}</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Estimated Penalty</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: 'error.main' }}>₹{selectedBreach.penalty_amount?.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Breach Logged On</Typography>
                  <Typography variant="body2">{selectedBreach.breach_date}</Typography>
                </Grid>
              </Grid>
              {selectedBreach.status === 'Open' ? (
                <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={handleResolveOpen}>
                  Resolve & Process Penalty
                </Button>
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary">Resolution Summary</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>Resolved on {selectedBreach.resolved_date}</Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Log SLA Form */}
      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Log SLA Breach Event</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              required
              fullWidth
              label="Select Contract File"
              value={formData.contract_id}
              onChange={(e) => setFormData({ ...formData, contract_id: e.target.value })}
            >
              {contracts.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              required
              fullWidth
              label="Metric Name"
              value={formData.metric_name}
              onChange={(e) => setFormData({ ...formData, metric_name: e.target.value })}
            />
            <TextField
              required
              fullWidth
              type="date"
              label="Breach Date"
              InputLabelProps={{ shrink: true }}
              value={formData.breach_date}
              onChange={(e) => setFormData({ ...formData, breach_date: e.target.value })}
            />
            <TextField
              required
              fullWidth
              type="number"
              label="Estimated Penalty Amount (INR)"
              value={formData.penalty_amount}
              onChange={(e) => setFormData({ ...formData, penalty_amount: parseFloat(e.target.value) })}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Remarks / Incidents logged"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="error">Submit Log</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Resolve SLA Dialog */}
      <Dialog open={resolveOpen} onClose={() => setResolveOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleResolveSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Confirm Breach Resolution</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="number"
              required
              label="Final Penalty Applied (INR)"
              value={resolveData.penalty_applied}
              onChange={(e) => setResolveData({ ...resolveData, penalty_applied: parseFloat(e.target.value) })}
            />
            <TextField
              multiline
              rows={2}
              required
              label="Resolution Summary"
              placeholder="Detail actions taken to resolve uptime or timeline breach..."
              value={resolveData.resolved_remarks}
              onChange={(e) => setResolveData({ ...resolveData, resolved_remarks: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResolveOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="success">Mark Resolved</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
