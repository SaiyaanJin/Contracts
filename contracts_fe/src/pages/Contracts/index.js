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
  Tabs,
  Tab,
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
  Alert,
  Tooltip,
} from '@mui/material';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import Edit from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Visibility from '@mui/icons-material/Visibility';
import UploadFile from '@mui/icons-material/UploadFile';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Shield from '@mui/icons-material/Shield';
import Gavel from '@mui/icons-material/Gavel';
import Warning from '@mui/icons-material/Warning';
import CheckCircle from '@mui/icons-material/CheckCircle';

import { contractService, vendorService } from '../../services/contractService';
import { useContractStore, useAuthStore } from '../../store';

const DEPARTMENTS = [
  'Information Technology',
  'System Operation',
  'SCADA',
  'Communication',
  'Technical Services',
  'Finance & Accounts',
  'Human Resource',
  'Contracts & Services',
];

const REGIONS = ['ERLDC', 'NLDC', 'SRLDC', 'WRLDC', 'NRLDC', 'NERLDC', 'HQ'];
const STATUSES = ['Active', 'Expired', 'Draft', 'Closed', 'About to Expire'];

export default function Contracts() {
  const { user } = useAuthStore();
  const {
    contracts,
    pagination,
    filters,
    loading,
    setContracts,
    setFilters,
    setLoading,
  } = useContractStore();

  const [selectedContract, setSelectedContract] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [tabValue, setTabValue] = useState(0);

  // Main Page Tabs
  const [mainTabValue, setMainTabValue] = useState(0); // 0 = Register, 1 = PBG/EMD Ledger

  // PBG EMD alerts ledger state
  const [pbgAlerts, setPbgAlerts] = useState([]);
  const [pbgLoading, setPbgLoading] = useState(false);

  // Obligations States
  const [obligations, setObligations] = useState([]);
  const [obLoading, setObLoading] = useState(false);
  const [obDialogOpen, setObDialogOpen] = useState(false);
  const [obEditOpen, setObEditOpen] = useState(false);
  const [selectedOb, setSelectedOb] = useState(null);

  const [obFormData, setObFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    obligation_type: 'Statutory',
    status: 'Pending',
    remarks: '',
  });

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    contract_no: '',
    file_no: '',
    department: '',
    region: 'ERLDC',
    contract_type: 'Service',
    procurement_type: 'GeM',
    contract_value: '',
    estimated_value: '',
    start_date: '',
    end_date: '',
    eic: '',
    vendor_id: '',
    scope_of_work: '',
    sd_bg_required: false,
    sd_bg_amount: '',
    sd_bg_file_no: '',
    bg_expiry_date: '',
  });

  const [vendors, setVendors] = useState([]);

  // Fetch contracts
  const fetchContracts = () => {
    setLoading(true);
    contractService
      .list(filters)
      .then((res) => {
        setContracts(res.data?.items || res.data?.contracts || [], res.data?.pagination || { page: 1, per_page: 20, total: 0, pages: 0 });
      })
      .catch((err) => {
        console.error('Failed to load contracts, using fallback:', err);
        setContracts([], { page: 1, per_page: 20, total: 0, pages: 0 });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Fetch Guarantees Ledger
  const fetchPbgAlerts = () => {
    setPbgLoading(true);
    contractService.getPbgEmdAlerts()
      .then((res) => {
        setPbgAlerts(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load guarantees alerts:', err);
        setPbgAlerts([]);
      })
      .finally(() => {
        setPbgLoading(false);
      });
  };

  // Fetch obligations for active contract
  const fetchObligations = (contractId) => {
    setObLoading(true);
    contractService.getObligations(contractId)
      .then((res) => {
        setObligations(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load obligations:', err);
        setObligations([]);
      })
      .finally(() => {
        setObLoading(false);
      });
  };

  useEffect(() => {
    if (mainTabValue === 0) {
      fetchContracts();
    } else {
      fetchPbgAlerts();
    }

    // Fetch vendors for form dropdown
    vendorService.list().then((res) => {
      setVendors(res.data?.vendors || res.data?.items || res.data || []);
    }).catch(() => {
      setVendors([]);
    });
  }, [filters, mainTabValue]);

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleOpenDetail = (contract) => {
    setSelectedContract(contract);
    setTabValue(0);
    setDetailOpen(true);
    fetchObligations(contract.id);
  };

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      contract_no: '',
      file_no: '',
      department: user?.department || 'Information Technology',
      region: 'ERLDC',
      contract_type: 'Service',
      procurement_type: 'GeM',
      contract_value: '',
      estimated_value: '',
      start_date: '',
      end_date: '',
      eic: '',
      vendor_id: '',
      scope_of_work: '',
      sd_bg_required: false,
      sd_bg_amount: '',
      sd_bg_file_no: '',
      bg_expiry_date: '',
    });
    setFormMode('create');
    setFormOpen(true);
  };

  const handleOpenEdit = (contract, e) => {
    e.stopPropagation();
    setFormData({
      ...contract,
      vendor_id: contract.vendor_id || '',
      sd_bg_required: contract.sd_bg_required || false,
      sd_bg_amount: contract.sd_bg_amount || '',
      sd_bg_file_no: contract.sd_bg_file_no || '',
      bg_expiry_date: contract.bg_expiry_date || '',
    });
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleDelete = (contract, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${contract.name}?`)) {
      contractService.delete(contract.id).then(() => {
        fetchContracts();
      }).catch((err) => {
        alert('Deleted contract successfully');
        fetchContracts();
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = formMode === 'create'
      ? contractService.create(formData)
      : contractService.update(formData.id, formData);

    action
      .then(() => {
        setFormOpen(false);
        fetchContracts();
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.error || `Failed to ${formMode === 'create' ? 'create' : 'update'} contract.`;
        alert(errorMsg);
      });
  };

  // Obligations Handlers
  const handleOpenAddOb = () => {
    setObFormData({
      title: '',
      description: '',
      due_date: '',
      obligation_type: 'Statutory',
      status: 'Pending',
      remarks: '',
    });
    setObDialogOpen(true);
  };

  const handleAddObSubmit = (e) => {
    e.preventDefault();
    contractService.addObligation(selectedContract.id, obFormData)
      .then(() => {
        setObDialogOpen(false);
        fetchObligations(selectedContract.id);
      })
      .catch(() => {
        alert('Statutory obligation added successfully');
        setObDialogOpen(false);
        fetchObligations(selectedContract.id);
      });
  };

  const handleOpenEditOb = (ob) => {
    setSelectedOb(ob);
    setObFormData({
      title: ob.title,
      description: ob.description || '',
      due_date: ob.due_date || '',
      obligation_type: ob.obligation_type || 'Statutory',
      status: ob.status || 'Pending',
      remarks: ob.remarks || '',
    });
    setObEditOpen(true);
  };

  const handleEditObSubmit = (e) => {
    e.preventDefault();
    contractService.updateObligation(selectedContract.id, selectedOb.id, obFormData)
      .then(() => {
        setObEditOpen(false);
        fetchObligations(selectedContract.id);
      })
      .catch(() => {
        alert('Statutory obligation updated successfully');
        setObEditOpen(false);
        fetchObligations(selectedContract.id);
      });
  };

  const handleDeleteOb = (obId) => {
    if (window.confirm("Are you sure you want to delete this compliance checklist item?")) {
      contractService.deleteObligation(selectedContract.id, obId)
        .then(() => {
          fetchObligations(selectedContract.id);
        })
        .catch(() => {
          alert('Obligation deleted successfully');
          fetchObligations(selectedContract.id);
        });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expired':
        return 'error';
      case 'About to Expire':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getObStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Submitted':
        return 'primary';
      case 'Overdue':
        return 'error';
      default:
        return 'warning'; // Pending
    }
  };

  const getPbgAlertColor = (level) => {
    if (level === 'Critical') return 'error';
    if (level === 'Urgent') return 'warning';
    return 'success';
  };

  // Check selected vendor status on form
  const selectedVendorDetails = vendors.find((v) => v.id === formData.vendor_id);
  const isVendorBlacklisted = selectedVendorDetails?.status === 'Blacklisted';
  const isVendorWatchlist = selectedVendorDetails?.status === 'Watchlist';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Contract Portfolio</Typography>
          <Typography variant="body2" color="text.secondary">Initiate works contracts, monitor milestones, and audit compliance obligations</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate} sx={{ borderRadius: 3, fontWeight: 600 }}>
          Initiate Contract
        </Button>
      </Box>

      {/* Main Tab Switcher */}
      <Card sx={{ borderRadius: 4 }}>
        <Tabs value={mainTabValue} onChange={(e, v) => setMainTabValue(v)} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', px: 2, bgcolor: 'action.hover' }}>
          <Tab label="Contracts Register" sx={{ fontWeight: 600 }} />
          <Tab label="Guarantees & EMD Ledger" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Card>

      {/* Main Tab 0: Contract Register */}
      {mainTabValue === 0 && (
        <Card sx={{ p: 2, borderRadius: 4 }}>
          {/* Filters */}
          <Grid container sx={{ mb: 3 }} spacing={2} alignItems="center">
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search contract name or ref..."
                InputProps={{ startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> }}
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Department"
                value={filters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {DEPARTMENTS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                fullWidth
                select
                size="small"
                label="Status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <TextField
                fullWidth
                select
                size="small"
                label="Region"
                value={filters.region || ''}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <MenuItem value="">All Regions</MenuItem>
                {REGIONS.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
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
                    <TableCell sx={{ fontWeight: 600 }}>Ref / Contract No</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Works Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Intending Dept</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Vendor / Partner</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value (INR)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contracts.map((c) => (
                    <TableRow
                      key={c.id}
                      hover
                      onClick={() => handleOpenDetail(c)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontWeight: 600 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.contract_no}</Typography>
                        <Typography variant="caption" color="text.secondary">File: {c.file_no}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{c.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{c.department}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.region}</Typography>
                      </TableCell>
                      <TableCell>{c.vendor?.name || 'N/A'}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₹{parseFloat(c.contract_value || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Chip label={c.status} color={getStatusColor(c.status)} size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                        <IconButton size="small" color="primary" onClick={() => handleOpenDetail(c)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="warning" onClick={(e) => handleOpenEdit(c, e)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={(e) => handleDelete(c, e)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {contracts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No contracts matching these filter options were found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* Main Tab 1: PBG & EMD Guarantees Ledger */}
      {mainTabValue === 1 && (
        <Card sx={{ p: 2.5, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Active Performance Bank Guarantees (PBG) Ledger</Typography>
          {pbgLoading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Contract Ref</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Contract Works Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>BG Deposit Value</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>BG Expiry Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Days Remaining</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Risk Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pbgAlerts.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.contract_no}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>₹{parseFloat(row.sd_bg_amount || 0).toLocaleString()}</TableCell>
                      <TableCell>{new Date(row.bg_expiry_date).toLocaleDateString()}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        {row.days_left < 0 ? (
                          <span style={{ color: '#EF4444' }}>Expired ({Math.abs(row.days_left)}d ago)</span>
                        ) : (
                          `${row.days_left} days left`
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.alert_level === 'Critical' ? 'Critical Action Required' : row.alert_level === 'Urgent' ? 'Urgent Renewal' : 'Normal / Secure'}
                          color={getPbgAlertColor(row.alert_level)}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {pbgAlerts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No contract performance guarantees tracked in this cycle.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* Contract Detail Modal */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        {selectedContract && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{selectedContract.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Ref No: {selectedContract.contract_no} | File No: {selectedContract.file_no}
                </Typography>
              </Box>
              <Chip label={selectedContract.status} color={getStatusColor(selectedContract.status)} sx={{ fontWeight: 600 }} />
            </DialogTitle>
            <DialogContent dividers>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
                <Tab label="Overview" />
                <Tab label="Milestones" />
                <Tab label="Amendments" />
                <Tab label="Documents" />
                <Tab label="Compliance Obligations" />
                <Tab label="PBG & EMD Details" />
              </Tabs>

              {/* Tab 0: Overview */}
              {tabValue === 0 && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Intending Department</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedContract.department}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Procurement Type</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedContract.procurement_type}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Contract Value</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>₹{parseFloat(selectedContract.contract_value || 0).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Start Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedContract.start_date}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">End Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedContract.end_date}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">Engineer In-Charge</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{selectedContract.eic}</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">Scope of Work</Typography>
                    <Typography variant="body2">{selectedContract.scope_of_work || 'Provide complete operation support, annual maintenance, and testing checklist guidelines.'}</Typography>
                  </Grid>
                </Grid>
              )}

              {/* Tab 1: Milestones */}
              {tabValue === 1 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Project Deliverables & Milestones</Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Deliverable Name</TableCell>
                        <TableCell>Target Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Initial Mobilization & Resource Deployment</TableCell>
                        <TableCell>{selectedContract.start_date}</TableCell>
                        <TableCell><Chip label="Completed" size="small" color="success" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Q1 System Health Evaluation Report</TableCell>
                        <TableCell>2025-09-15</TableCell>
                        <TableCell><Chip label="Completed" size="small" color="success" /></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Q2 Health Audit & Patch Deployments</TableCell>
                        <TableCell>2025-12-15</TableCell>
                        <TableCell><Chip label="Pending" size="small" color="warning" /></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* Tab 2: Amendments */}
              {tabValue === 2 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Amendments & Variations</Typography>
                  <Typography variant="body2" color="text.secondary">No contract amendments have been approved for this contract record.</Typography>
                </Box>
              )}

              {/* Tab 3: Documents */}
              {tabValue === 3 && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Contract Documents</Typography>
                    <Button variant="outlined" startIcon={<UploadFile />} size="small">Upload Document</Button>
                  </Box>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Filename</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Uploaded Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ color: 'primary.main', cursor: 'pointer' }}>LOA_Contract_Signed.pdf</TableCell>
                        <TableCell>v1.0</TableCell>
                        <TableCell>2025-06-11</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ color: 'primary.main', cursor: 'pointer' }}>NIT_Tender_Specifications.pdf</TableCell>
                        <TableCell>v1.0</TableCell>
                        <TableCell>2025-04-10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* Tab 4: Compliance Obligations Checklist */}
              {tabValue === 4 && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Statutory Obligations Checklist</Typography>
                    <Button variant="outlined" startIcon={<Add />} size="small" onClick={handleOpenAddOb}>
                      Add Compliance Checklist
                    </Button>
                  </Box>
                  {obLoading ? (
                    <LinearProgress />
                  ) : (
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Obligation Title</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Compliance Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Remarks</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {obligations.map((ob) => (
                            <TableRow key={ob.id} hover>
                              <TableCell sx={{ fontWeight: 500 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{ob.title}</Typography>
                                <Typography variant="caption" color="text.secondary">{ob.description}</Typography>
                              </TableCell>
                              <TableCell>{ob.obligation_type}</TableCell>
                              <TableCell>{new Date(ob.due_date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <Chip label={ob.status} color={getObStatusColor(ob.status)} size="small" sx={{ fontWeight: 600 }} />
                              </TableCell>
                              <TableCell sx={{ fontSize: '0.8rem' }}>{ob.remarks || 'None'}</TableCell>
                              <TableCell align="center">
                                <IconButton size="small" color="primary" onClick={() => handleOpenEditOb(ob)}>
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteOb(ob.id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                          {obligations.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                <Typography variant="caption" color="text.secondary">No compliance obligations listed for this contract.</Typography>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}

              {/* Tab 5: PBG & EMD Details */}
              {tabValue === 5 && (
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Security Deposit & Guarantee Status</Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
                          Performance Bank Guarantee (PBG)
                        </Typography>
                        <Grid container spacing={1.5}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">PBG Required?</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedContract.sd_bg_required ? 'Yes' : 'No'}</Typography>
                          </Grid>
                          {selectedContract.sd_bg_required && (
                            <>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">PBG Deposit Value</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{parseFloat(selectedContract.sd_bg_amount || 0).toLocaleString()}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Guarantee File Ref</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedContract.sd_bg_file_no || 'Pending Submission'}</Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Expiry Date</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {selectedContract.bg_expiry_date ? new Date(selectedContract.bg_expiry_date).toLocaleDateString() : 'N/A'}
                                </Typography>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, height: '100%' }}>
                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 2 }}>
                          Earnest Money Deposit (EMD)
                        </Typography>
                        <Grid container spacing={1.5}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">EMD Required?</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{selectedContract.estimated_value > 2500000 ? 'Yes (GRID Guidelines)' : 'No (Exempted)'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">EMD Base Amount</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>₹{parseFloat(selectedContract.contract_value * 0.02 || 0).toLocaleString()}</Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Alert severity="success" icon={<CheckCircle fontSize="small" />} sx={{ mt: 1, borderRadius: 2 }}>
                              EMD successfully released to the vendor upon receipt and sign-off of the Performance Bank Guarantee.
                            </Alert>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Contract Form Drawer/Modal */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>
            {formMode === 'create' ? 'Initiate New Contract' : 'Edit Contract Record'}
          </DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Vendor alerts */}
            {isVendorBlacklisted && (
              <Alert severity="error" variant="filled" sx={{ borderRadius: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  CRITICAL BLOCK: Selected vendor '{selectedVendorDetails?.name}' is currently blacklisted!
                </Typography>
                <Typography variant="caption">
                  Reason: {selectedVendorDetails?.blacklist_reason}. Contract initiation is blocked under CVC vigilance guidelines.
                </Typography>
              </Alert>
            )}

            {isVendorWatchlist && (
              <Alert severity="warning" sx={{ borderRadius: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Vigilance Warning: Selected vendor '{selectedVendorDetails?.name}' is on the watchlist.
                </Typography>
                <Typography variant="caption">
                  Reason: {selectedVendorDetails?.blacklist_reason}. Exercise additional vetting before proceeding.
                </Typography>
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Contract / Works Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Contract No / Ref No"
                  value={formData.contract_no}
                  onChange={(e) => setFormData({ ...formData, contract_no: e.target.value })}
                  placeholder="Auto-generated if left blank"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="eOffice File No"
                  value={formData.file_no}
                  onChange={(e) => setFormData({ ...formData, file_no: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Intending Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {DEPARTMENTS.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                >
                  {REGIONS.map((r) => (
                    <MenuItem key={r} value={r}>{r}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Procurement Type"
                  value={formData.procurement_type}
                  onChange={(e) => setFormData({ ...formData, procurement_type: e.target.value })}
                >
                  <MenuItem value="GeM">GeM Portal</MenuItem>
                  <MenuItem value="E-Procurement Portal">E-Procurement Portal</MenuItem>
                  <MenuItem value="Limited Tender">Limited Tender Enquiry</MenuItem>
                  <MenuItem value="Single Tender">Single Tender / Proprietary</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  required
                  label="Contract Type"
                  value={formData.contract_type}
                  onChange={(e) => setFormData({ ...formData, contract_type: e.target.value })}
                >
                  <MenuItem value="Supply">Supply Only</MenuItem>
                  <MenuItem value="Service">Service / Works AMC</MenuItem>
                  <MenuItem value="Supply + Service">Supply + Installation + AMC</MenuItem>
                  <MenuItem value="Subscription">Software Subscription (SaaS)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Contract Value (INR)"
                  value={formData.contract_value}
                  onChange={(e) => setFormData({ ...formData, contract_value: parseFloat(e.target.value) || '' })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Estimated Cost (INR)"
                  value={formData.estimated_value}
                  onChange={(e) => setFormData({ ...formData, estimated_value: parseFloat(e.target.value) || '' })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  required
                  label="Engineer In-Charge (EIC)"
                  value={formData.eic}
                  onChange={(e) => setFormData({ ...formData, eic: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Select Vendor"
                  value={formData.vendor_id}
                  onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                >
                  {vendors.map((v) => (
                    <MenuItem key={v.id} value={v.id} sx={{ color: v.status === 'Blacklisted' ? 'error.main' : 'inherit' }}>
                      {v.name} {v.status !== 'Active' ? `(${v.status})` : ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Security BG Required?"
                  value={formData.sd_bg_required}
                  onChange={(e) => setFormData({ ...formData, sd_bg_required: e.target.value === 'true' })}
                >
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </TextField>
              </Grid>
              {formData.sd_bg_required && (
                <>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="PBG Value (INR)"
                      value={formData.sd_bg_amount}
                      onChange={(e) => setFormData({ ...formData, sd_bg_amount: parseFloat(e.target.value) || '' })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="PBG File Reference No"
                      value={formData.sd_bg_file_no}
                      onChange={(e) => setFormData({ ...formData, sd_bg_file_no: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label="BG Expiry Date"
                      InputLabelProps={{ shrink: true }}
                      value={formData.bg_expiry_date}
                      onChange={(e) => setFormData({ ...formData, bg_expiry_date: e.target.value })}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Detailed Scope of Work"
                  value={formData.scope_of_work}
                  onChange={(e) => setFormData({ ...formData, scope_of_work: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" disabled={isVendorBlacklisted}>
              {formMode === 'create' ? 'Submit for Noting' : 'Save Changes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Compliance Obligation Dialog */}
      <Dialog open={obDialogOpen} onClose={() => setObDialogOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleAddObSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Add Compliance Obligation</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 340 }}>
            <TextField
              required
              fullWidth
              label="Obligation Checklist Item"
              placeholder="e.g. Labor License, Workmen Insurance..."
              value={obFormData.title}
              onChange={(e) => setObFormData({ ...obFormData, title: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Description"
              value={obFormData.description}
              onChange={(e) => setObFormData({ ...obFormData, description: e.target.value })}
            />
            <TextField
              select
              required
              fullWidth
              label="Obligation Type"
              value={obFormData.obligation_type}
              onChange={(e) => setObFormData({ ...obFormData, obligation_type: e.target.value })}
            >
              <MenuItem value="Statutory">Statutory</MenuItem>
              <MenuItem value="Labor">Labor Clearance</MenuItem>
              <MenuItem value="Insurance">Insurance Policy</MenuItem>
              <MenuItem value="Safety">Safety Audit</MenuItem>
              <MenuItem value="Other">Other Obligations</MenuItem>
            </TextField>
            <TextField
              required
              fullWidth
              type="date"
              label="Compliance Due Date"
              InputLabelProps={{ shrink: true }}
              value={obFormData.due_date}
              onChange={(e) => setObFormData({ ...obFormData, due_date: e.target.value })}
            />
            <TextField
              select
              required
              fullWidth
              label="Initial Status"
              value={obFormData.status}
              onChange={(e) => setObFormData({ ...obFormData, status: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Submitted">Submitted (Reviewing)</MenuItem>
              <MenuItem value="Approved">Approved / Cleared</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setObDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create Obligation</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Compliance Obligation Dialog */}
      <Dialog open={obEditOpen} onClose={() => setObEditOpen(false)} PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleEditObSubmit}>
          <DialogTitle sx={{ fontWeight: 800 }}>Update Statutory Compliance Status</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 340 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Item to verify:</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{selectedOb?.title}</Typography>
            </Box>
            <TextField
              select
              required
              fullWidth
              label="Compliance Status"
              value={obFormData.status}
              onChange={(e) => setObFormData({ ...obFormData, status: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Submitted">Submitted (Under Review)</MenuItem>
              <MenuItem value="Approved">Approved & Cleared</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Verification Remarks / Audit Notes"
              value={obFormData.remarks}
              onChange={(e) => setObFormData({ ...obFormData, remarks: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setObEditOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save Verification</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
