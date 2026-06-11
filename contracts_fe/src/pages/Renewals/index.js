import React, { useState } from 'react';
import {
  Box, Card, Typography, Grid, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  LinearProgress, TextField, MenuItem, Avatar, Alert, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Autorenew, Add, Warning, CheckCircle, AccessTime, Download, Edit } from '@mui/icons-material';

const AMC_CONTRACTS = [
  {
    id: 'AMC-001', title: 'SCADA System Annual Maintenance', vendor: 'Siemens India Ltd', dept: 'SCADA & Comm.',
    value: 8500000, renewalNo: 3, startDate: '2022-04-01', endDate: '2025-09-30', daysLeft: 111,
    status: 'expiring', autoRenewal: false, noticeRequired: 90,
    history: [
      { year: 'FY22-23', amount: 7800000, status: 'completed' },
      { year: 'FY23-24', amount: 8100000, status: 'completed' },
      { year: 'FY24-25', amount: 8500000, status: 'active' },
    ],
    notes: 'Performance satisfactory. Renewal recommended.',
  },
  {
    id: 'AMC-002', title: 'Primary Data Centre Server AMC', vendor: 'HPE India Ltd', dept: 'IT',
    value: 2200000, renewalNo: 2, startDate: '2023-07-01', endDate: '2025-07-15', daysLeft: 34,
    status: 'critical', autoRenewal: false, noticeRequired: 60,
    history: [
      { year: 'FY23-24', amount: 2000000, status: 'completed' },
      { year: 'FY24-25', amount: 2200000, status: 'active' },
    ],
    notes: 'Critical — renewal notice must be issued immediately.',
  },
  {
    id: 'AMC-003', title: 'UPS & Power Backup Maintenance', vendor: 'Emerson Network Power', dept: 'IT',
    value: 1200000, renewalNo: 4, startDate: '2021-06-01', endDate: '2025-06-30', daysLeft: 19,
    status: 'overdue_renewal', autoRenewal: false, noticeRequired: 30,
    history: [
      { year: 'FY21-22', amount: 1000000, status: 'completed' },
      { year: 'FY22-23', amount: 1050000, status: 'completed' },
      { year: 'FY23-24', amount: 1100000, status: 'completed' },
      { year: 'FY24-25', amount: 1200000, status: 'active' },
    ],
    notes: 'URGENT: Tender initiation overdue. Extension letter issued.',
  },
  {
    id: 'AMC-004', title: 'Network Firewall & Cybersecurity AMC', vendor: 'Fortinet India', dept: 'IT',
    value: 1100000, renewalNo: 1, startDate: '2024-06-01', endDate: '2025-12-31', daysLeft: 204,
    status: 'active', autoRenewal: true, noticeRequired: 60,
    history: [
      { year: 'FY24-25', amount: 1100000, status: 'active' },
    ],
    notes: 'First year contract. Performance under evaluation.',
  },
  {
    id: 'AMC-005', title: 'RTU Calibration & Maintenance', vendor: 'ABB India Ltd', dept: 'SCADA & Comm.',
    value: 1800000, renewalNo: 5, startDate: '2020-04-01', endDate: '2025-09-30', daysLeft: 111,
    status: 'expiring', autoRenewal: false, noticeRequired: 90,
    history: [
      { year: 'FY20-21', amount: 1500000, status: 'completed' },
      { year: 'FY21-22', amount: 1600000, status: 'completed' },
      { year: 'FY22-23', amount: 1650000, status: 'completed' },
      { year: 'FY23-24', amount: 1750000, status: 'completed' },
      { year: 'FY24-25', amount: 1800000, status: 'active' },
    ],
    notes: 'Long-standing vendor. Renewal process to begin next month.',
  },
  {
    id: 'AMC-006', title: 'Building HVAC & Air Conditioning', vendor: 'Voltas Ltd', dept: 'HR&A',
    value: 650000, renewalNo: 2, startDate: '2024-01-01', endDate: '2025-12-31', daysLeft: 204,
    status: 'active', autoRenewal: false, noticeRequired: 45,
    history: [
      { year: 'FY23-24', amount: 600000, status: 'completed' },
      { year: 'FY24-25', amount: 650000, status: 'active' },
    ],
    notes: 'Satisfactory.',
  },
];

const STATUS_MAP = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  expiring: { label: 'Expiring Soon', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  critical: { label: 'CRITICAL', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', pulse: true },
  overdue_renewal: { label: 'Renewal Overdue', color: '#DC2626', bg: 'rgba(220,38,38,0.15)', pulse: true },
};

function RenewalTimeline({ history }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {history.map((h) => (
        <Paper key={h.year} variant="outlined" sx={{
          px: 1.2, py: 0.6,
          borderRadius: 1.5,
          borderColor: h.status === 'completed' ? 'rgba(34,197,94,0.3)' : h.status === 'active' ? 'rgba(201,162,39,0.4)' : 'divider',
          bgcolor: h.status === 'completed' ? 'rgba(34,197,94,0.06)' : h.status === 'active' ? 'rgba(201,162,39,0.08)' : 'transparent',
        }}>
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: h.status === 'completed' ? '#4ADE80' : h.status === 'active' ? '#C9A227' : 'text.muted' }}>
            {h.year}
          </Typography>
          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>₹{(h.amount / 100000).toFixed(1)}L</Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default function Renewals() {
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [draftOpen, setDraftOpen] = useState(false);

  const filtered = AMC_CONTRACTS.filter(c => !filter || c.status === filter);
  const criticalCount = AMC_CONTRACTS.filter(c => c.status === 'critical' || c.status === 'overdue_renewal').length;
  const expiringCount = AMC_CONTRACTS.filter(c => c.status === 'expiring').length;

  const handleDraftNoteSheet = (c) => { setSelected(c); setDraftOpen(true); };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Autorenew sx={{ color: '#C9A227' }} /> Renewals & AMC Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Annual Maintenance Contract renewal management — ERLDC procurement lifecycle
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'divider' }}>Export</Button>
          <Button variant="contained" startIcon={<Add />} sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>Add AMC Contract</Button>
        </Box>
      </Box>

      {/* Alerts */}
      {criticalCount > 0 && (
        <Alert severity="error" sx={{ borderRadius: 2, fontWeight: 600 }}>
          🚨 {criticalCount} AMC contract(s) require IMMEDIATE renewal action — risk of service disruption to critical grid infrastructure.
        </Alert>
      )}

      {/* Summary */}
      <Grid container spacing={2}>
        {[
          { label: 'Total AMC Contracts', value: AMC_CONTRACTS.length, color: '#1A3C6B', icon: '📋' },
          { label: 'Active', value: AMC_CONTRACTS.filter(c => c.status === 'active').length, color: '#22C55E', icon: '✅' },
          { label: 'Expiring (90d)', value: expiringCount, color: '#F59E0B', icon: '⏰' },
          { label: 'Critical / Overdue', value: criticalCount, color: '#EF4444', icon: '🚨' },
          { label: 'Total AMC Value', value: `₹${(AMC_CONTRACTS.reduce((s, c) => s + c.value, 0) / 10000000).toFixed(2)} Cr`, color: '#C9A227', icon: '💰' },
          { label: 'Avg. Tenure (yrs)', value: `${(AMC_CONTRACTS.reduce((s, c) => s + c.renewalNo, 0) / AMC_CONTRACTS.length).toFixed(1)}`, color: '#8B5CF6', icon: '📅' },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={2} key={s.label}>
            <Card sx={{ p: 2, borderTop: `4px solid ${s.color}`, textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <Typography sx={{ fontSize: '1.6rem' }}>{s.icon}</Typography>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filter + Cards */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Filter:</Typography>
        {['', 'critical', 'overdue_renewal', 'expiring', 'active'].map((s) => (
          <Chip
            key={s}
            label={s === '' ? 'All' : STATUS_MAP[s]?.label || s}
            onClick={() => setFilter(s)}
            variant={filter === s ? 'filled' : 'outlined'}
            size="small"
            sx={{
              fontWeight: 600,
              cursor: 'pointer',
              bgcolor: filter === s ? (s === '' ? '#1A3C6B' : STATUS_MAP[s]?.bg) : 'transparent',
              color: filter === s ? (s === '' ? '#fff' : STATUS_MAP[s]?.color) : 'text.secondary',
              borderColor: s && STATUS_MAP[s]?.color ? `${STATUS_MAP[s].color}50` : 'divider',
            }}
          />
        ))}
      </Box>

      <Grid container spacing={2}>
        {filtered.map((c) => {
          const sc = STATUS_MAP[c.status];
          const noticeOverdue = c.daysLeft <= c.noticeRequired;
          return (
            <Grid item xs={12} md={6} key={c.id}>
              <Card sx={{
                borderLeft: `5px solid ${sc.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
              }}>
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{c.id} · {c.dept}</Typography>
                    </Box>
                    <Chip
                      label={sc.label}
                      size="small"
                      sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: '0.7rem', border: `1px solid ${sc.color}40` }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Vendor</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.vendor}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Annual Value</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#C9A227' }}>₹{(c.value / 100000).toFixed(1)} L</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Renewal #</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.renewalNo}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Expires</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{c.endDate}</Typography>
                    </Box>
                  </Box>

                  {/* Days Left Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        {c.daysLeft <= 0 ? 'EXPIRED' : `${c.daysLeft} days remaining`}
                        {noticeOverdue && c.daysLeft > 0 && <span style={{ color: '#F87171', fontWeight: 700 }}> — Notice period overdue!</span>}
                      </Typography>
                      <Typography variant="caption" sx={{ color: sc.color, fontWeight: 700 }}>Notice: {c.noticeRequired}d</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(100, Math.max(0, (c.daysLeft / 365) * 100))}
                      sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { background: sc.color, borderRadius: 3 } }}
                    />
                  </Box>

                  {/* Renewal History */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Renewal History</Typography>
                    <RenewalTimeline history={c.history} />
                  </Box>

                  {/* Notes */}
                  {c.notes && (
                    <Box sx={{ bgcolor: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 1.5, px: 1.5, py: 1, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">📌 {c.notes}</Typography>
                    </Box>
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button size="small" variant="outlined" startIcon={<Edit sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.75rem' }}>View Details</Button>
                    <Button size="small" variant="contained" startIcon={<Autorenew sx={{ fontSize: 14 }} />} onClick={() => handleDraftNoteSheet(c)} sx={{ fontSize: '0.75rem', background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>Draft Note Sheet</Button>
                    {(c.status === 'critical' || c.status === 'overdue_renewal') && (
                      <Button size="small" variant="contained" sx={{ fontSize: '0.75rem', bgcolor: '#DC2626', '&:hover': { bgcolor: '#B91C1C' } }}>
                        🚨 Initiate Tender
                      </Button>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Draft Note Sheet Dialog */}
      <Dialog open={draftOpen} onClose={() => setDraftOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>📝 Draft Renewal Note Sheet — {selected?.id}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, bgcolor: 'rgba(26,60,107,0.05)', borderRadius: 2, fontFamily: 'monospace', fontSize: '0.82rem', lineHeight: 2 }}>
            <Typography sx={{ fontWeight: 700, mb: 1, fontFamily: 'inherit' }}>EASTERN REGIONAL LOAD DESPATCH CENTRE</Typography>
            <Typography sx={{ fontFamily: 'inherit' }}>Note No: ____/IT/AMC/{new Date().getFullYear()}</Typography>
            <Typography sx={{ fontFamily: 'inherit' }}>Date: {new Date().toLocaleDateString('en-IN')}</Typography>
            <br />
            <Typography sx={{ fontFamily: 'inherit', fontWeight: 700 }}>Subject: Renewal of AMC for {selected?.title}</Typography>
            <br />
            <Typography sx={{ fontFamily: 'inherit' }}>Reference Contract: {selected?.id}</Typography>
            <Typography sx={{ fontFamily: 'inherit' }}>Vendor: {selected?.vendor}</Typography>
            <Typography sx={{ fontFamily: 'inherit' }}>Existing Contract Value: ₹{selected ? (selected.value / 100000).toFixed(2) : ''} Lakhs</Typography>
            <Typography sx={{ fontFamily: 'inherit' }}>Expiry Date: {selected?.endDate}</Typography>
            <br />
            <Typography sx={{ fontFamily: 'inherit' }}>The above AMC is due for renewal. It is proposed to renew the same for a further period of one (1) year. The vendor has been performing satisfactorily. Necessary funds are available under the approved budget head. Finance & CVC concurrence may please be obtained.</Typography>
            <br />
            <Typography sx={{ fontFamily: 'inherit' }}>Submitted for approval of competent authority.</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDraftOpen(false)}>Close</Button>
          <Button variant="contained" sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>
            Send to eOffice
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
