import React, { useState } from 'react';
import {
  Box, Card, Typography, Grid, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  TextField, MenuItem, Avatar, Tabs, Tab, Paper, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { Handshake, Add, Download, Visibility, Edit, CheckCircle, Schedule } from '@mui/icons-material';

const MOU_LIST = [
  {
    id: 'MOU-2025-001', title: 'MoU for Integrated SCADA Data Sharing', type: 'MoU',
    counterparty: 'WBSEDCL', counterpartyType: 'State DISCOM', dept: 'SCADA & Comm.',
    signedDate: '2024-04-01', validUpto: '2027-03-31', daysLeft: 660,
    status: 'active', keyCommitments: ['Real-time data exchange via ICCP', 'Joint fault analysis protocol', 'Quarterly review meetings'],
    linkedContracts: ['CLM-2024-042', 'CLM-2024-058'],
    approvedBy: 'Executive Director',
    notes: 'First MoU with a state DISCOM in ERLDC jurisdiction.',
  },
  {
    id: 'MOU-2025-002', title: 'MoU for Grid Stability Research', type: 'MoU',
    counterparty: 'IIT Kharagpur', counterpartyType: 'Academic Institution', dept: 'Technical Services',
    signedDate: '2025-01-15', validUpto: '2028-01-14', daysLeft: 948,
    status: 'active', keyCommitments: ['Joint research on frequency regulation', 'Data access for academic studies', 'Annual workshop at IIT KGP'],
    linkedContracts: [],
    approvedBy: 'General Manager (TS)',
    notes: 'Research collaboration for next-gen grid stability.',
  },
  {
    id: 'LOA-2024-015', title: 'LoA: SCADA Software License Agreement', type: 'LoA',
    counterparty: 'Siemens India Ltd', counterpartyType: 'Technology Vendor', dept: 'SCADA & Comm.',
    signedDate: '2024-06-10', validUpto: '2025-06-09', daysLeft: 0,
    status: 'expired', keyCommitments: ['Software license for SCADA Spectrum Power', 'Annual update subscription', '24×7 support'],
    linkedContracts: ['CLM-2024-042'],
    approvedBy: 'GM (SCADA)',
    notes: 'Renewal LoA under process.',
  },
  {
    id: 'MOU-2024-008', title: 'MoU with POWERGRID for Fiber Connectivity', type: 'MoU',
    counterparty: 'POWERGRID Corporation', counterpartyType: 'CPSU', dept: 'IT',
    signedDate: '2023-09-01', validUpto: '2025-08-31', daysLeft: 81,
    status: 'expiring', keyCommitments: ['Shared OFC backbone for ERLDC-NR connectivity', 'Joint NOC operations', 'Bandwidth sharing @500 Mbps'],
    linkedContracts: ['CLM-2023-089'],
    approvedBy: 'Executive Director',
    notes: 'Renewal discussions underway with POWERGRID HQ.',
  },
  {
    id: 'LOA-2025-003', title: 'LoA: Cybersecurity Assessment Services', type: 'LoA',
    counterparty: 'CERT-In Empanelled Agency', counterpartyType: 'Government Body', dept: 'IT',
    signedDate: '2025-03-01', validUpto: '2026-02-28', daysLeft: 262,
    status: 'active', keyCommitments: ['Annual VAPT assessment', 'Incident response support', 'Compliance audit'],
    linkedContracts: ['CLM-2025-055'],
    approvedBy: 'GM (IT)',
    notes: 'As per MoP/CEA cybersecurity guidelines.',
  },
  {
    id: 'MOU-2025-006', title: 'MoU for Training with NPTI', type: 'MoU',
    counterparty: 'NPTI (Faridabad)', counterpartyType: 'Training Institute', dept: 'HR&A',
    signedDate: '2025-02-01', validUpto: '2028-01-31', daysLeft: 964,
    status: 'active', keyCommitments: ['20 training slots/year for ERLDC engineers', 'Online e-learning access', 'Discounted certification programmes'],
    linkedContracts: [],
    approvedBy: 'GM (HR&A)',
    notes: 'NPTI is the national power training institute.',
  },
];

const COUNTERPARTY_TYPES = ['State DISCOM', 'CPSU', 'Technology Vendor', 'Academic Institution', 'Government Body', 'Training Institute'];

const STATUS_CONFIG = {
  active: { label: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  expiring: { label: 'Expiring Soon', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  expired: { label: 'Expired', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  draft: { label: 'Draft', color: '#8AAAC8', bg: 'rgba(138,170,200,0.1)' },
};

const TYPE_CONFIG = {
  MoU: { color: '#1A3C6B', bg: 'rgba(26,60,107,0.15)' },
  LoA: { color: '#C9A227', bg: 'rgba(201,162,39,0.15)' },
};

export default function MouRegistry() {
  const [tab, setTab] = useState(0);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = MOU_LIST.filter(m =>
    (!filterType || m.type === filterType) &&
    (!filterStatus || m.status === filterStatus)
  );

  const active = MOU_LIST.filter(m => m.status === 'active').length;
  const expiring = MOU_LIST.filter(m => m.status === 'expiring').length;
  const expired = MOU_LIST.filter(m => m.status === 'expired').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Handshake sx={{ color: '#C9A227' }} /> MoU & LoA Registry
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Memoranda of Understanding and Letters of Award — ERLDC institutional agreements
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'divider' }}>Export</Button>
          <Button variant="contained" startIcon={<Add />} sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>Add MoU / LoA</Button>
        </Box>
      </Box>

      {/* Summary */}
      <Grid container spacing={2}>
        {[
          { label: 'Total Agreements', value: MOU_LIST.length, color: '#1A3C6B', icon: '🤝' },
          { label: 'Active', value: active, color: '#22C55E', icon: '✅' },
          { label: 'Expiring (90d)', value: expiring, color: '#F59E0B', icon: '⏰' },
          { label: 'Expired', value: expired, color: '#EF4444', icon: '❌' },
          { label: 'MoU Count', value: MOU_LIST.filter(m => m.type === 'MoU').length, color: '#0F5DA3', icon: '📄' },
          { label: 'LoA Count', value: MOU_LIST.filter(m => m.type === 'LoA').length, color: '#C9A227', icon: '📋' },
        ].map((s) => (
          <Grid item xs={12} sm={6} md={2} key={s.label}>
            <Card sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${s.color}`, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <Typography sx={{ fontSize: '1.6rem' }}>{s.icon}</Typography>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField select size="small" label="Type" value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="MoU">MoU</MenuItem>
          <MenuItem value="LoA">LoA</MenuItem>
        </TextField>
        <TextField select size="small" label="Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All Statuses</MenuItem>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
        </TextField>
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', ml: 'auto' }}>
          {filtered.length} agreement(s)
        </Typography>
      </Box>

      {/* Cards */}
      <Grid container spacing={2}>
        {filtered.map((m) => {
          const sc = STATUS_CONFIG[m.status];
          const tc = TYPE_CONFIG[m.type];
          return (
            <Grid item xs={12} md={6} key={m.id}>
              <Card sx={{
                borderLeft: `5px solid ${sc.color}`,
                transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
              }}>
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip label={m.type} size="small" sx={{ bgcolor: tc.bg, color: tc.color, fontWeight: 800, fontSize: '0.7rem' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem' }}>{m.title}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{m.id}</Typography>
                    </Box>
                    <Chip label={sc.label} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: '0.7rem', height: 'fit-content', border: `1px solid ${sc.color}40` }} />
                  </Box>

                  <Grid container spacing={1.5} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Counterparty</Typography>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700 }}>{m.counterparty}</Typography>
                      <Typography variant="caption" sx={{ color: '#C9A227', fontSize: '0.7rem' }}>{m.counterpartyType}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Signed</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{m.signedDate}</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="caption" color="text.secondary">Valid Upto</Typography>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: m.daysLeft <= 90 ? '#F59E0B' : 'text.primary' }}>{m.validUpto}</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Key Commitments</Typography>
                    {m.keyCommitments.map((kc, i) => (
                      <Typography key={i} variant="caption" sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, color: 'text.secondary', mb: 0.3 }}>
                        <CheckCircle sx={{ fontSize: 12, color: '#22C55E', mt: 0.2, flexShrink: 0 }} /> {kc}
                      </Typography>
                    ))}
                  </Box>

                  {m.linkedContracts.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Linked Contracts</Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {m.linkedContracts.map((lc) => (
                          <Chip key={lc} label={lc} size="small" sx={{ bgcolor: 'rgba(26,60,107,0.1)', color: '#7FB3E8', fontSize: '0.68rem', cursor: 'pointer' }} />
                        ))}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      ✅ Approved by: <b>{m.approvedBy}</b>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined" startIcon={<Visibility sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.75rem' }} onClick={() => setSelected(m)}>
                        View
                      </Button>
                      {m.daysLeft <= 90 && m.daysLeft > 0 && (
                        <Button size="small" variant="contained" sx={{ fontSize: '0.75rem', background: 'linear-gradient(135deg,#C9A227,#E8C14A)', color: '#0F2544' }}>
                          Initiate Renewal
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Detail Dialog */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              {selected.type}: {selected.title}
              <Chip label={selected.id} size="small" sx={{ ml: 1, bgcolor: 'rgba(201,162,39,0.15)', color: '#C9A227', fontSize: '0.7rem' }} />
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <Grid container spacing={2}>
                  {[
                    ['Counterparty', selected.counterparty], ['Type', selected.counterpartyType],
                    ['Department', selected.dept], ['Approved By', selected.approvedBy],
                    ['Signed', selected.signedDate], ['Valid Upto', selected.validUpto],
                  ].map(([l, v]) => (
                    <Grid item xs={6} key={l}>
                      <Typography variant="caption" color="text.secondary">{l}</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{v}</Typography>
                    </Grid>
                  ))}
                </Grid>
                <Divider />
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Key Commitments</Typography>
                  {selected.keyCommitments.map((kc, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.8 }}>
                      <CheckCircle sx={{ fontSize: 16, color: '#22C55E', mt: 0.2 }} />
                      <Typography variant="body2">{kc}</Typography>
                    </Box>
                  ))}
                </Box>
                {selected.notes && (
                  <Box sx={{ bgcolor: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.2)', borderRadius: 1.5, p: 1.5 }}>
                    <Typography variant="caption" color="text.secondary">📌 Notes</Typography>
                    <Typography variant="body2">{selected.notes}</Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setSelected(null)}>Close</Button>
              <Button variant="contained" sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>Download PDF</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
