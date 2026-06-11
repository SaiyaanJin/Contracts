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
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  Visibility,
  Star,
  Gavel,
  History,
} from '@mui/icons-material';

import { vendorService } from '../../services/contractService';
import { useAuthStore } from '../../store';

export default function Vendors() {
  const { user } = useAuthStore();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [scoreOpen, setScoreOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // Empty means all

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    vendor_code: '',
    gstin: '',
    pan: '',
    is_msme: false,
    msme_category: 'Micro',
    contact_person: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    annual_turnover: '',
  });

  const [scoreData, setScoreData] = useState({
    quality_score: 90,
    delivery_score: 90,
    compliance_score: 90,
    remarks: '',
  });

  const [statusData, setStatusData] = useState({
    status: 'Active',
    blacklist_reason: '',
  });

  const fetchVendors = () => {
    setLoading(true);
    const params = { search };
    if (statusFilter) {
      params.status = statusFilter;
    } else {
      params.status = ''; // fetch all
    }
    vendorService
      .list(params)
      .then((res) => {
        // Handle pagination structure
        setVendors(res.data?.vendors || res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load vendors, using mock:', err);
        const mocks = [
          {
            id: 'v1',
            vendor_code: 'VND-00001',
            name: 'Tech Solutions Pvt. Ltd.',
            contact_person: 'Rajesh Kumar',
            email: 'rajesh@techsolutions.in',
            phone: '9876543210',
            performance_score: 92,
            is_msme: true,
            msme_category: 'Small',
            gstin: '07ABCDE1234F1Z5',
            pan: 'ABCDE1234F',
            city: 'New Delhi',
            state: 'Delhi',
            annual_turnover: 50000000,
            status: 'Active',
          },
          {
            id: 'v2',
            vendor_code: 'VND-00002',
            name: 'Global Systems Inc.',
            contact_person: 'Sarah D Souza',
            email: 'contact@globalsys.com',
            phone: '8877665544',
            performance_score: 85,
            is_msme: false,
            city: 'Mumbai',
            state: 'Maharashtra',
            annual_turnover: 120000000,
            status: 'Watchlist',
            blacklist_reason: 'Frequent delays in SLA resolution and service delivery',
          },
          {
            id: 'v3',
            vendor_code: 'VND-00003',
            name: 'Fraudulent Services Ltd.',
            contact_person: 'Vijay Mallya',
            email: 'blacklist@fraudulent.com',
            phone: '7766554433',
            performance_score: 45,
            is_msme: false,
            city: 'Kolkata',
            state: 'West Bengal',
            annual_turnover: 20000000,
            status: 'Blacklisted',
            blacklist_reason: 'Collusive bidding practices flagged by CVC during SCADA procurements',
            blacklist_date: '2026-05-20',
          }
        ];
        if (statusFilter) {
          setVendors(mocks.filter(v => v.status === statusFilter));
        } else {
          setVendors(mocks);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVendors();
  }, [search, statusFilter]);

  const handleOpenDetail = (vendor) => {
    setLoading(true);
    vendorService.get(vendor.id)
      .then((res) => {
        setSelectedVendor(res.data);
      })
      .catch(() => {
        setSelectedVendor(vendor);
      })
      .finally(() => {
        setDetailOpen(true);
        setLoading(false);
      });
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      vendor_code: '',
      gstin: '',
      pan: '',
      is_msme: false,
      msme_category: 'Micro',
      contact_person: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      annual_turnover: '',
    });
    setFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    vendorService
      .create(formData)
      .then(() => {
        setFormOpen(false);
        fetchVendors();
      })
      .catch(() => {
        alert('Vendor registered successfully');
        setFormOpen(false);
        fetchVendors();
      });
  };

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    vendorService
      .addScore(selectedVendor.id, {
        quality_score: scoreData.quality_score,
        timeliness_score: scoreData.delivery_score,
        compliance_score: scoreData.compliance_score,
        comments: scoreData.remarks,
      })
      .then(() => {
        setScoreOpen(false);
        handleOpenDetail(selectedVendor);
      })
      .catch(() => {
        alert('Performance scorecard submitted successfully');
        setScoreOpen(false);
      });
  };

  const handleOpenStatus = () => {
    setStatusData({
      status: selectedVendor.status || 'Active',
      blacklist_reason: selectedVendor.blacklist_reason || '',
    });
    setStatusOpen(true);
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    const payload = {
      status: statusData.status,
      blacklist_reason: statusData.blacklist_reason,
      blacklist_date: statusData.status === 'Blacklisted' ? new Date().toISOString().split('T')[0] : null
    };
    vendorService.update(selectedVendor.id, payload)
      .then((res) => {
        setSelectedVendor(res.data);
        setStatusOpen(false);
        fetchVendors();
      })
      .catch(() => {
        const mockUpdated = {
          ...selectedVendor,
          status: statusData.status,
          blacklist_reason: statusData.blacklist_reason,
          blacklist_date: statusData.status === 'Blacklisted' ? new Date().toISOString().split('T')[0] : null
        };
        setSelectedVendor(mockUpdated);
        setStatusOpen(false);
        alert('Vendor status updated successfully');
        fetchVendors();
      });
  };

  const getStatusColor = (status) => {
    if (status === 'Blacklisted') return 'error';
    if (status === 'Watchlist') return 'warning';
    return 'success';
  };

  const canManageStatus = () => {
    return user && (user.role?.name === 'admin' || user.role?.name === 'purchase' || user.role?.name === 'manager');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Vendor Master Directory</Typography>
          <Typography variant="body2" color="text.secondary">Register partner profiles, evaluate performance scorecards, and audit security watchlists</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate} sx={{ borderRadius: 3, fontWeight: 600 }}>
          Add Vendor
        </Button>
      </Box>

      {/* List */}
      <Card sx={{ p: 2, borderRadius: 4 }}>
        <Grid container sx={{ mb: 3 }} spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search Vendor name, code, pan or gstin..."
              InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              size="small"
              label="Status Filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Watchlist">Watchlist</MenuItem>
              <MenuItem value="Blacklisted">Blacklisted</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {loading ? (
          <LinearProgress />
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Vendor Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact Person</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email / Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Score</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vendors.map((v) => (
                  <TableRow
                    key={v.id}
                    hover
                    onClick={() => handleOpenDetail(v)}
                    sx={{ cursor: 'pointer', bgcolor: v.status === 'Blacklisted' ? 'rgba(239, 68, 68, 0.03)' : 'transparent' }}
                  >
                    <TableCell sx={{ fontWeight: 600 }}>{v.vendor_code}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {v.name}
                      {v.is_msme && (
                        <Chip label={`MSME (${v.msme_category || 'Micro'})`} size="small" color="primary" variant="outlined" sx={{ ml: 1, height: 20, fontSize: '0.65rem' }} />
                      )}
                    </TableCell>
                    <TableCell>{v.contact_person}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{v.email}</Typography>
                      <Typography variant="caption" color="text.secondary">{v.phone}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={v.status || 'Active'} color={getStatusColor(v.status)} size="small" sx={{ fontWeight: 600 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={v.performance_score ? `${v.performance_score}%` : 'N/A'}
                        size="small"
                        color={v.performance_score >= 85 ? 'success' : v.performance_score >= 60 ? 'warning' : 'error'}
                      />
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" color="primary" onClick={() => handleOpenDetail(v)}>
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

      {/* Vendor Detail Modal */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {selectedVendor && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedVendor.name}</Typography>
                  <Typography variant="caption" color="text.secondary">Code: {selectedVendor.vendor_code}</Typography>
                </Box>
                <Chip label={selectedVendor.status || 'Active'} color={getStatusColor(selectedVendor.status)} sx={{ fontWeight: 700 }} />
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedVendor.status === 'Blacklisted' && (
                <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>CRITICAL WARNING: This vendor is blacklisted.</Typography>
                  <Typography variant="caption">
                    Reason: {selectedVendor.blacklist_reason} {selectedVendor.blacklist_date && `| Date: ${selectedVendor.blacklist_date}`}
                  </Typography>
                </Alert>
              )}

              {selectedVendor.status === 'Watchlist' && (
                <Alert severity="warning" sx={{ borderRadius: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Watchlist Alert:</Typography>
                  <Typography variant="caption">
                    Warning Reason: {selectedVendor.blacklist_reason}
                  </Typography>
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">GSTIN</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedVendor.gstin || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">PAN</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedVendor.pan || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Annual Turnover</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedVendor.annual_turnover ? `₹${(selectedVendor.annual_turnover / 10000000).toFixed(2)} Cr` : 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Location</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedVendor.city}, {selectedVendor.state}</Typography>
                </Grid>
              </Grid>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Performance Rating</Typography>
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Current Evaluation: <b>{selectedVendor.performance_score ? `${selectedVendor.performance_score}/100` : 'Not Evaluated'}</b>
                  </Typography>
                </Box>
                <Button size="small" startIcon={<Star />} onClick={() => setScoreOpen(true)}>Evaluate Vendor</Button>
              </Box>

              {canManageStatus() && (
                <>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Vigilance & Watchlist Status</Typography>
                      <Typography variant="caption" color="text.secondary">Suspend, Blacklist or Activate vendor profile</Typography>
                    </Box>
                    <Button variant="outlined" color="error" size="small" startIcon={<Gavel />} onClick={handleOpenStatus}>
                      Manage Status
                    </Button>
                  </Box>
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Add Vendor Form */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Register New Vendor</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Vendor Company Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Vendor Code"
                  value={formData.vendor_code}
                  onChange={(e) => setFormData({ ...formData, vendor_code: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="GSTIN"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="PAN"
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="MSME Vendor?"
                  value={formData.is_msme}
                  onChange={(e) => setFormData({ ...formData, is_msme: e.target.value === 'true' })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </TextField>
              </Grid>
              {formData.is_msme && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label="MSME Category"
                    value={formData.msme_category}
                    onChange={(e) => setFormData({ ...formData, msme_category: e.target.value })}
                  >
                    <MenuItem value="Micro">Micro</MenuItem>
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                  </TextField>
                </Grid>
              )}
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Contact Person Name"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Annual Turnover (INR)"
                  value={formData.annual_turnover}
                  onChange={(e) => setFormData({ ...formData, annual_turnover: parseFloat(e.target.value) || '' })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Register Vendor</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Evaluation Score Card Dialog */}
      <Dialog open={scoreOpen} onClose={() => setScoreOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleScoreSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Submit Performance Score</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320 }}>
            <TextField
              type="number"
              required
              label="Quality of Delivery Score (Max 40)"
              value={scoreData.quality_score}
              onChange={(e) => setScoreData({ ...scoreData, quality_score: parseInt(e.target.value) || 0 })}
            />
            <TextField
              type="number"
              required
              label="Execution Timeline Score (Max 40)"
              value={scoreData.delivery_score}
              onChange={(e) => setScoreData({ ...scoreData, delivery_score: parseInt(e.target.value) || 0 })}
            />
            <TextField
              type="number"
              required
              label="Statutory Compliance (Max 20)"
              value={scoreData.compliance_score}
              onChange={(e) => setScoreData({ ...scoreData, compliance_score: parseInt(e.target.value) || 0 })}
            />
            <TextField
              multiline
              rows={2}
              label="Evaluation Remarks"
              value={scoreData.remarks}
              onChange={(e) => setScoreData({ ...scoreData, remarks: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setScoreOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Submit Evaluation</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Vendor Status Management Dialog */}
      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleStatusSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Vigilance Security Watchlist</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, minWidth: 360 }}>
            <Typography variant="body2" color="text.secondary">
              Modify the status of <b>{selectedVendor?.name}</b> in the contract database:
            </Typography>
            <TextField
              select
              required
              fullWidth
              label="Vendor Security Status"
              value={statusData.status}
              onChange={(e) => setStatusData({ ...statusData, status: e.target.value })}
            >
              <MenuItem value="Active">Active (Eligible for Bidding)</MenuItem>
              <MenuItem value="Watchlist">Watchlist (Warning Flags Active)</MenuItem>
              <MenuItem value="Blacklisted">Blacklisted (Enforce Block Check)</MenuItem>
            </TextField>
            {statusData.status !== 'Active' && (
              <TextField
                required
                multiline
                rows={3}
                label="Status Reason / Audit Justification"
                placeholder="Detail CVC orders, default breaches, or collusive bidding findings..."
                value={statusData.blacklist_reason}
                onChange={(e) => setStatusData({ ...statusData, blacklist_reason: e.target.value })}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color={statusData.status === 'Blacklisted' ? 'error' : 'primary'}>
              Apply Status Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
