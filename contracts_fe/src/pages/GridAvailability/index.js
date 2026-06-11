import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Avatar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, LinearProgress, Tooltip, TextField, MenuItem,
  Alert,
} from '@mui/material';
import {
  ElectricBolt, Warning, CheckCircle, AccessTime,
  Router, Computer, Storage, Wifi, Power, Add,
} from '@mui/icons-material';

const EQUIPMENT_TYPES = {
  SCADA: { icon: <Router />, color: '#1A3C6B' },
  Server: { icon: <Computer />, color: '#0F5DA3' },
  RTU: { icon: <Router />, color: '#C9A227' },
  UPS: { icon: <Power />, color: '#22C55E' },
  Network: { icon: <Wifi />, color: '#8B5CF6' },
  Storage: { icon: <Storage />, color: '#F59E0B' },
};

const GRID_CONTRACTS = [
  { id: 'GC-001', name: 'SCADA System Maintenance & Support', vendor: 'Siemens India Ltd', equipment: 'SCADA', criticality: 'P1', status: 'active', expiryDays: 245, value: 85000000, sla: '99.9%', lastAudit: '2025-03-15' },
  { id: 'GC-002', name: 'RTU Calibration & AMC', vendor: 'ABB India Ltd', equipment: 'RTU', criticality: 'P1', status: 'expiring', expiryDays: 28, value: 18000000, sla: '99.5%', lastAudit: '2025-04-01' },
  { id: 'GC-003', name: 'Data Centre UPS Maintenance', vendor: 'Emerson Network Power', equipment: 'UPS', criticality: 'P1', status: 'expiring', expiryDays: 12, value: 12000000, sla: '99.8%', lastAudit: '2025-02-20' },
  { id: 'GC-004', name: 'Core Network Infrastructure (MPLS)', vendor: 'BSNL', equipment: 'Network', criticality: 'P2', status: 'active', expiryDays: 180, value: 9500000, sla: '99.0%', lastAudit: '2025-01-10' },
  { id: 'GC-005', name: 'Primary Data Centre Servers AMC', vendor: 'HPE India Ltd', equipment: 'Server', criticality: 'P1', status: 'active', expiryDays: 92, value: 22000000, sla: '99.7%', lastAudit: '2025-03-28' },
  { id: 'GC-006', name: 'DR Site Servers & Storage AMC', vendor: 'Dell Technologies', equipment: 'Storage', criticality: 'P2', status: 'active', expiryDays: 310, value: 14000000, sla: '99.5%', lastAudit: '2025-04-10' },
  { id: 'GC-007', name: 'Communication Gateway Maintenance', vendor: 'Ericsson India', equipment: 'Network', criticality: 'P1', status: 'expired', expiryDays: -15, value: 7500000, sla: 'N/A', lastAudit: '2024-12-01' },
  { id: 'GC-008', name: 'Firewall & Cybersecurity AMC', vendor: 'Fortinet India', equipment: 'Network', criticality: 'P1', status: 'active', expiryDays: 145, value: 11000000, sla: '99.9%', lastAudit: '2025-04-20' },
];

function DaysChip({ days }) {
  if (days < 0) return <Chip label={`Expired ${Math.abs(days)}d ago`} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171', fontWeight: 700, border: '1px solid rgba(239,68,68,0.3)', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } } }} />;
  if (days <= 30) return <Chip label={`${days}d CRITICAL`} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.15)', color: '#F87171', fontWeight: 700, border: '1px solid rgba(239,68,68,0.4)' }} />;
  if (days <= 90) return <Chip label={`${days}d`} size="small" sx={{ bgcolor: 'rgba(245,158,11,0.12)', color: '#FCD34D', fontWeight: 700, border: '1px solid rgba(245,158,11,0.3)' }} />;
  return <Chip label={`${days}d`} size="small" sx={{ bgcolor: 'rgba(34,197,94,0.1)', color: '#4ADE80', fontWeight: 700, border: '1px solid rgba(34,197,94,0.3)' }} />;
}

function CriticalityBadge({ level }) {
  const colors = { P1: { bg: 'rgba(239,68,68,0.15)', color: '#F87171', border: 'rgba(239,68,68,0.4)' }, P2: { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', border: 'rgba(245,158,11,0.3)' }, P3: { bg: 'rgba(34,197,94,0.1)', color: '#4ADE80', border: 'rgba(34,197,94,0.3)' } };
  const c = colors[level] || colors.P3;
  return <Chip label={level} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 800, border: `1px solid ${c.border}`, fontSize: '0.7rem' }} />;
}

const SUMMARY = [
  { label: 'P1 Critical Contracts', value: 5, color: '#EF4444', icon: '🔴' },
  { label: 'Expiring within 30d', value: 2, color: '#F59E0B', icon: '⚠️' },
  { label: 'Active & Healthy', value: 5, color: '#22C55E', icon: '✅' },
  { label: 'Expired (Action Needed)', value: 1, color: '#DC2626', icon: '🚨' },
];

export default function GridAvailability() {
  const [filterCriticality, setFilterCriticality] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = GRID_CONTRACTS.filter(c =>
    (!filterCriticality || c.criticality === filterCriticality) &&
    (!filterStatus || c.status === filterStatus)
  );

  const expired = filtered.filter(c => c.expiryDays < 0).length;
  const criticalExpiring = filtered.filter(c => c.expiryDays >= 0 && c.expiryDays <= 30).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ElectricBolt sx={{ color: '#C9A227' }} /> Grid Availability Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Critical infrastructure contract health monitoring — ERLDC SCADA, Servers, Network & UPS systems
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>
          Add Equipment Contract
        </Button>
      </Box>

      {/* Critical Alerts */}
      {(expired > 0 || criticalExpiring > 0) && (
        <Alert severity="error" sx={{ borderRadius: 2, fontWeight: 600 }}>
          🚨 URGENT: {expired} contract(s) EXPIRED and {criticalExpiring} contract(s) expiring within 30 days. Immediate renewal action required to ensure grid availability.
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={2}>
        {SUMMARY.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <Card sx={{ p: 2, borderLeft: `4px solid ${s.color}`, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <Typography sx={{ fontSize: '2rem' }}>{s.icon}</Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Equipment Availability Grid */}
      <Card sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Critical System Health Overview</Typography>
        <Grid container spacing={2}>
          {Object.entries(EQUIPMENT_TYPES).map(([type, meta]) => {
            const typeContracts = GRID_CONTRACTS.filter(c => c.equipment === type);
            const hasIssue = typeContracts.some(c => c.expiryDays < 30);
            return (
              <Grid item xs={6} sm={4} md={2} key={type}>
                <Paper variant="outlined" sx={{
                  p: 2, textAlign: 'center', borderRadius: 2,
                  borderColor: hasIssue ? 'rgba(239,68,68,0.4)' : 'rgba(26,60,107,0.2)',
                  bgcolor: hasIssue ? 'rgba(239,68,68,0.04)' : 'transparent',
                  transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' },
                }}>
                  <Avatar sx={{ bgcolor: `${meta.color}18`, color: meta.color, mx: 'auto', mb: 1 }}>{meta.icon}</Avatar>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{type}</Typography>
                  <Typography variant="caption" color="text.secondary">{typeContracts.length} contract(s)</Typography>
                  {hasIssue && <Warning sx={{ color: '#F59E0B', fontSize: 16, display: 'block', mx: 'auto', mt: 0.5 }} />}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Card>

      {/* Filters + Table */}
      <Card>
        <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField select size="small" label="Criticality" value={filterCriticality} onChange={(e) => setFilterCriticality(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="P1">P1 — Critical</MenuItem>
            <MenuItem value="P2">P2 — High</MenuItem>
            <MenuItem value="P3">P3 — Normal</MenuItem>
          </TextField>
          <TextField select size="small" label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="expiring">Expiring Soon</MenuItem>
            <MenuItem value="expired">Expired</MenuItem>
          </TextField>
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', ml: 'auto' }}>
            Showing {filtered.length} of {GRID_CONTRACTS.length} contracts
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Contract Name</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Vendor</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Criticality</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>SLA Target</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Value (₹)</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Days to Expiry</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} sx={{ bgcolor: c.expiryDays < 0 ? 'rgba(239,68,68,0.05)' : c.expiryDays <= 30 ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                  <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#C9A227' }}>{c.id}</Typography></TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.82rem', fontWeight: 600, maxWidth: 220 }}>{c.name}</Typography></TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.8rem' }} color="text.secondary">{c.vendor}</Typography></TableCell>
                  <TableCell>
                    <Chip label={c.equipment} size="small" sx={{ bgcolor: `${EQUIPMENT_TYPES[c.equipment]?.color}18`, color: EQUIPMENT_TYPES[c.equipment]?.color, fontWeight: 600, fontSize: '0.7rem' }} />
                  </TableCell>
                  <TableCell><CriticalityBadge level={c.criticality} /></TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#22C55E' }}>{c.sla}</Typography></TableCell>
                  <TableCell><Typography sx={{ fontSize: '0.8rem' }}>₹{(c.value / 100000).toFixed(1)}L</Typography></TableCell>
                  <TableCell><DaysChip days={c.expiryDays} /></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button size="small" variant="outlined" sx={{ fontSize: '0.7rem', py: 0.3, px: 1, minWidth: 0 }}>View</Button>
                      {c.expiryDays <= 90 && <Button size="small" variant="contained" sx={{ fontSize: '0.7rem', py: 0.3, px: 1, minWidth: 0, background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>Renew</Button>}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
