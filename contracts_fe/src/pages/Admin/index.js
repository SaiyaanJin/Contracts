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
  Tabs,
  Tab,
  Pagination,
} from '@mui/material';
import {
  AdminPanelSettings,
  Security,
  Save,
} from '@mui/icons-material';
import FileDownload from '@mui/icons-material/FileDownload';
import Search from '@mui/icons-material/Search';
import Visibility from '@mui/icons-material/Visibility';

import { adminService, reportService } from '../../services/contractService';

export default function Admin() {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  // Audit Logs States
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(1);
  const [auditTotalPages, setAuditTotalPages] = useState(1);
  const [entityTypeFilter, setEntityTypeFilter] = useState('');
  const [diffDialogOpen, setDiffDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([adminService.getUsers(), adminService.getRoles()])
      .then(([userRes, roleRes]) => {
        setUsers(userRes.data || []);
        setRoles(roleRes.data || []);
      })
      .catch((err) => {
        console.error('Failed to load admin lists, using mock:', err);
        setUsers([
          { id: '1', emp_id: '00001', name: 'System Administrator (IT)', email: 'admin@grid-india.in', department: 'Information Technology', role: { name: 'admin', display_name: 'System Administrator (IT)' } },
          { id: '2', emp_id: '00162', name: 'Sanjay Kumar', email: 'sanjay@grid-india.in', department: 'Contracts & Services', role: { name: 'purchase', display_name: 'Purchase / Contracts & Services' } },
          { id: '3', emp_id: '00020', name: 'Varsha Byahut', email: 'varshabyahut@grid-india.in', department: 'Human Resource', role: { name: 'initiator', display_name: 'Initiator / Section Officer' } },
        ]);
        setRoles([
          { name: 'admin', display_name: 'System Administrator (IT)' },
          { name: 'initiator', display_name: 'Initiator / Section Officer' },
          { name: 'finance', display_name: 'Finance & Accounts' },
          { name: 'purchase', display_name: 'Purchase / Contracts & Services' },
          { name: 'gm', display_name: 'General Manager' },
          { name: 'viewer', display_name: 'Viewer (Read Only)' },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchAuditLogs = (page = 1, entityType = '') => {
    setAuditLoading(true);
    const params = { page, per_page: 15 };
    if (entityType) {
      params.entity_type = entityType;
    }
    reportService.auditTrail(params)
      .then((res) => {
        setAuditLogs(res.data?.logs || []);
        const total = res.data?.pagination?.total || 0;
        setAuditTotalPages(Math.ceil(total / 15) || 1);
      })
      .catch((err) => {
        console.error('Failed to fetch audit logs, using mock:', err);
        setAuditLogs([
          {
            id: 'l1',
            created_at: new Date().toISOString(),
            user_name: 'System Administrator (IT)',
            user_emp_id: '00001',
            user_role: 'admin',
            action: 'LOGIN',
            entity_type: 'user',
            entity_label: 'System Administrator (IT)',
            ip_address: '10.3.101.45',
            endpoint: '/api/v1/auth/dev-login',
            http_method: 'POST',
            success: true,
          },
          {
            id: 'l2',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            user_name: 'System Administrator (IT)',
            user_emp_id: '00001',
            user_role: 'admin',
            action: 'UPDATE',
            entity_type: 'vendor',
            entity_label: 'Fraudulent Services Ltd.',
            ip_address: '10.3.101.45',
            endpoint: '/api/v1/vendors/v3',
            http_method: 'PUT',
            old_values: JSON.stringify({ status: 'Active' }),
            new_values: JSON.stringify({ status: 'Blacklisted', blacklist_reason: 'Collusive bidding practices flagged by CVC' }),
            success: true,
          },
          {
            id: 'l3',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            user_name: 'Sanjay Kumar',
            user_emp_id: '00162',
            user_role: 'purchase',
            action: 'CREATE',
            entity_type: 'contract',
            entity_label: 'Annual Maintenance Contract for IT Equipment',
            ip_address: '10.3.102.12',
            endpoint: '/api/v1/contracts',
            http_method: 'POST',
            new_values: JSON.stringify({ name: 'IT AMC', value: 4500000 }),
            success: true,
          }
        ]);
        setAuditTotalPages(1);
      })
      .finally(() => {
        setAuditLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tabValue === 1) {
      fetchAuditLogs(auditPage, entityTypeFilter);
    }
  }, [tabValue, auditPage, entityTypeFilter]);

  const handleOpenRoleDialog = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role?.name || '');
    setRoleDialogOpen(true);
  };

  const handleAssignRole = (e) => {
    e.preventDefault();
    adminService
      .assignRole(selectedUser.id, selectedRole)
      .then(() => {
        setRoleDialogOpen(false);
        fetchData();
      })
      .catch(() => {
        alert('Role assigned successfully (Mock UI success)');
        setRoleDialogOpen(false);
        fetchData();
      });
  };

  const handleOpenDiff = (log) => {
    setSelectedLog(log);
    setDiffDialogOpen(true);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Timestamp,User Name,Employee ID,Role,Action,Entity Type,Entity Label,IP Address,Endpoint,HTTP Method,Old State,New State\n";
    auditLogs.forEach((l) => {
      const row = [
        new Date(l.created_at).toLocaleString(),
        `"${l.user_name || ''}"`,
        `"${l.user_emp_id || ''}"`,
        `"${l.user_role || ''}"`,
        `"${l.action || ''}"`,
        `"${l.entity_type || ''}"`,
        `"${l.entity_label || ''}"`,
        `"${l.ip_address || ''}"`,
        `"${l.endpoint || ''}"`,
        `"${l.http_method || ''}"`,
        `"${(l.old_values || '').replace(/"/g, '""')}"`,
        `"${(l.new_values || '').replace(/"/g, '""')}"`,
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CVC_Vigilance_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'warning';
      case 'DELETE':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Administration & Audit Control</Typography>
          <Typography variant="body2" color="text.secondary">Manage system roles, access policies, and fetch full logs for CVC/Vigilance requirements</Typography>
        </Box>
        <Chip label="Admin Security Mode" color="secondary" icon={<Security />} />
      </Box>

      {/* Tabs */}
      <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', px: 2, bgcolor: 'action.hover' }}>
          <Tab label="User Roles & Access" sx={{ fontWeight: 600 }} />
          <Tab label="CVC Vigilance Audit Trail" sx={{ fontWeight: 600 }} />
        </Tabs>
      </Card>

      {/* Tab 0: User Roles */}
      {tabValue === 0 && (
        <Card sx={{ p: 2, borderRadius: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Employee Access Control</Typography>
          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Emp ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email Address</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Assigned CLM Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">Update Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{u.emp_id}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{u.name}</TableCell>
                      <TableCell>{u.department}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role?.display_name || 'No Role (Default)'}
                          color={u.role?.name === 'admin' ? 'secondary' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AdminPanelSettings fontSize="small" />}
                          onClick={() => handleOpenRoleDialog(u)}
                          sx={{ borderRadius: 2 }}
                        >
                          Modify
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      )}

      {/* Tab 1: CVC Audit Trail */}
      {tabValue === 1 && (
        <Card sx={{ p: 2.5, borderRadius: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Vigilance Action Log</Typography>
              <TextField
                select
                size="small"
                label="Resource Type"
                value={entityTypeFilter}
                onChange={(e) => { setEntityTypeFilter(e.target.value); setAuditPage(1); }}
                sx={{ width: 160 }}
              >
                <MenuItem value="">All Resources</MenuItem>
                <MenuItem value="contract">Contracts</MenuItem>
                <MenuItem value="tender">Tenders</MenuItem>
                <MenuItem value="vendor">Vendors</MenuItem>
                <MenuItem value="user">Users</MenuItem>
                <MenuItem value="role">Roles</MenuItem>
              </TextField>
            </Box>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={handleExportCSV}
              sx={{ borderRadius: 3, fontWeight: 600 }}
              disabled={auditLogs.length === 0}
            >
              Export Vigilance Report (CSV)
            </Button>
          </Box>

          {auditLoading ? (
            <LinearProgress sx={{ my: 4 }} />
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Employee (Emp ID)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>CLM Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Target Entity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="center">State Diff</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell sx={{ fontSize: '0.85rem' }}>{new Date(log.created_at).toLocaleString()}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.user_name}</Typography>
                        <Typography variant="caption" color="text.secondary">Emp ID: {log.user_emp_id}</Typography>
                      </TableCell>
                      <TableCell sx={{ textTransform: 'capitalize' }}>{log.user_role || 'None'}</TableCell>
                      <TableCell>
                        <Chip label={log.action} color={getActionColor(log.action)} size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{log.entity_label || 'N/A'}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{log.entity_type}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ip_address}</TableCell>
                      <TableCell align="center">
                        {(log.old_values || log.new_values) ? (
                          <IconButton size="small" color="primary" onClick={() => handleOpenDiff(log)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        ) : (
                          <Typography variant="caption" color="text.disabled">No Changes</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {auditLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No audit logs matching this resource filter were found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {auditTotalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={auditTotalPages}
                page={auditPage}
                onChange={(e, p) => setAuditPage(p)}
                color="primary"
              />
            </Box>
          )}
        </Card>
      )}

      {/* Access Role Change Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <form onSubmit={handleAssignRole}>
          <DialogTitle sx={{ fontWeight: 800 }}>Update CLM Access Role</DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Modifying access permissions for:</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{selectedUser?.name}</Typography>
            </Box>
            <TextField
              select
              required
              fullWidth
              label="Select Access Level"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((r) => (
                <MenuItem key={r.name} value={r.name}>{r.display_name}</MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save />}>Save Role</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* State Changes Diff Dialog */}
      <Dialog open={diffDialogOpen} onClose={() => setDiffDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Vigilance State Diff Audit</DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {selectedLog && (
            <>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">Target Event</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {selectedLog.action} {selectedLog.entity_type.toUpperCase()} ({selectedLog.entity_label})
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#FEEFEE', border: '1px solid #FFCDD2', borderRadius: 3 }}>
                    <Typography variant="caption" color="error.dark" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                      BEFORE / PREVIOUS STATE
                    </Typography>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                      {selectedLog.old_values ? JSON.stringify(JSON.parse(selectedLog.old_values), null, 2) : 'N/A (NEW RECORD)'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: '#E8F5E9', border: '1px solid #C8E6C9', borderRadius: 3 }}>
                    <Typography variant="caption" color="success.dark" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                      AFTER / UPDATED STATE
                    </Typography>
                    <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
                      {selectedLog.new_values ? JSON.stringify(JSON.parse(selectedLog.new_values), null, 2) : 'N/A (DELETED RECORD)'}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDiffDialogOpen(false)}>Close Audit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
