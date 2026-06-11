import React, { useState } from 'react';
import {
  Box, Card, Typography, Grid, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, TextField, MenuItem, Avatar, Tabs, Tab, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress,
} from '@mui/material';
import {
  VerifiedUser, GppBad, GppMaybe, Add, Download, Security,
  Visibility, EditNote, Flag,
} from '@mui/icons-material';

const COMPLIANCE_RECORDS = [
  { id: 'CV-001', contractId: 'CLM-2025-042', contractName: 'SCADA AMC — Siemens', vendor: 'Siemens India', dept: 'SCADA & Comm.', value: 85000000, vigilanceStatus: 'cleared', cvcRef: null, auditObservations: 0, lastReview: '2025-04-10', nextReview: '2025-10-10', remarks: 'All clear' },
  { id: 'CV-002', contractId: 'CLM-2025-031', contractName: 'IT Services — TCS', vendor: 'TCS Ltd', dept: 'IT', value: 120000000, vigilanceStatus: 'pending', cvcRef: 'CVC/ERLDC/2025/04', auditObservations: 1, lastReview: '2025-03-01', nextReview: '2025-06-01', remarks: 'Minor observation: Comparative rate not documented' },
  { id: 'CV-003', contractId: 'CLM-2025-018', contractName: 'Network Bandwidth — BSNL', vendor: 'BSNL', dept: 'IT', value: 9500000, vigilanceStatus: 'cleared', cvcRef: null, auditObservations: 0, lastReview: '2025-02-15', nextReview: '2025-08-15', remarks: 'All clear' },
  { id: 'CV-004', contractId: 'CLM-2024-098', contractName: 'Office Civil Works', vendor: 'ABC Construction', dept: 'HR&A', value: 35000000, vigilanceStatus: 'referred', cvcRef: 'CVC/ERLDC/2024/22', auditObservations: 3, lastReview: '2024-12-10', nextReview: '2025-06-30', remarks: 'CVC referral: Rate escalation without proper justification' },
  { id: 'CV-005', contractId: 'CLM-2025-055', contractName: 'UPS Maintenance — Emerson', vendor: 'Emerson NP', dept: 'IT', value: 12000000, vigilanceStatus: 'cleared', cvcRef: null, auditObservations: 0, lastReview: '2025-05-01', nextReview: '2025-11-01', remarks: 'All clear' },
  { id: 'CV-006', contractId: 'CLM-2024-076', contractName: 'Server Procurement — HPE', vendor: 'HPE India', dept: 'IT', value: 55000000, vigilanceStatus: 'under_review', cvcRef: 'CVC/ERLDC/2025/08', auditObservations: 2, lastReview: '2025-03-20', nextReview: '2025-07-20', remarks: 'CAG audit in progress — performance clauses under review' },
];

const AUDIT_FINDINGS = [
  { id: 'AF-001', contractId: 'CLM-2025-031', findingType: 'Minor', description: 'Comparative rate statement not maintained on file', raisedBy: 'Internal Audit', date: '2025-04-02', status: 'open', actionTaken: 'ATR submitted, pending closure' },
  { id: 'AF-002', contractId: 'CLM-2024-098', findingType: 'Major', description: 'Rate escalation of 18% approved without Finance concurrence', raisedBy: 'CVC', date: '2024-11-15', status: 'open', actionTaken: 'Explanation submitted, inquiry pending' },
  { id: 'AF-003', contractId: 'CLM-2024-098', findingType: 'Major', description: 'Work awarded before completion of due diligence', raisedBy: 'CVC', date: '2024-11-15', status: 'open', actionTaken: 'Pending inquiry officer report' },
  { id: 'AF-004', contractId: 'CLM-2024-098', findingType: 'Minor', description: 'SD not collected within stipulated 15 days', raisedBy: 'Internal Audit', date: '2024-10-20', status: 'closed', actionTaken: 'SD collected. Process improved.' },
  { id: 'AF-005', contractId: 'CLM-2025-055', findingType: 'Minor', description: 'SLA report not submitted for Q3 FY24', raisedBy: 'Internal Audit', date: '2025-01-10', status: 'closed', actionTaken: 'Retroactive report obtained. Vendor cautioned.' },
];

const STATUS_CONFIG = {
  cleared: { label: 'Cleared', color: '#22C55E', bg: 'rgba(34,197,94,0.12)', icon: <VerifiedUser sx={{ fontSize: 14 }} /> },
  pending: { label: 'Pending Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', icon: <GppMaybe sx={{ fontSize: 14 }} /> },
  referred: { label: 'CVC Referred', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', icon: <GppBad sx={{ fontSize: 14 }} /> },
  under_review: { label: 'Under Review', color: '#0F5DA3', bg: 'rgba(15,93,163,0.12)', icon: <GppMaybe sx={{ fontSize: 14 }} /> },
};

const KPI = [
  { label: 'Total Contracts Reviewed', value: 6, icon: '📋', color: '#1A3C6B' },
  { label: 'Vigilance Cleared', value: 3, icon: '✅', color: '#22C55E' },
  { label: 'CVC Referred', value: 1, icon: '🚩', color: '#EF4444' },
  { label: 'Open Audit Findings', value: 3, icon: '⚠️', color: '#F59E0B' },
  { label: 'Under Review', value: 2, icon: '🔍', color: '#0F5DA3' },
  { label: 'Compliance Score', value: '82%', icon: '🛡️', color: '#8B5CF6' },
];

export default function Compliance() {
  const [tab, setTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');

  const filtered = COMPLIANCE_RECORDS.filter(r =>
    (!filterStatus || r.vigilanceStatus === filterStatus) &&
    (!filterDept || r.dept === filterDept)
  );

  const openFindings = AUDIT_FINDINGS.filter(f => f.status === 'open').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Security sx={{ color: '#C9A227' }} /> Compliance & Vigilance Register
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            CVC compliance tracking, audit findings, and vigilance clearance status — ERLDC
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'divider' }}>
            Export Report
          </Button>
          <Button variant="contained" startIcon={<Add />} sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>
            Log New Finding
          </Button>
        </Box>
      </Box>

      {/* Open Findings Alert */}
      {openFindings > 0 && (
        <Alert severity="warning" sx={{ borderRadius: 2, fontWeight: 600 }}>
          ⚠️ {openFindings} open audit finding(s) require Action Taken Reports (ATR). Deadline: 30 days from date of raising.
        </Alert>
      )}

      {/* KPI Row */}
      <Grid container spacing={2}>
        {KPI.map((k) => (
          <Grid item xs={12} sm={6} md={2} key={k.label}>
            <Card sx={{ p: 2, textAlign: 'center', borderTop: `4px solid ${k.color}`, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <Typography sx={{ fontSize: '1.6rem' }}>{k.icon}</Typography>
              <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mt: 0.3 }}>{k.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Compliance Score Bar */}
      <Card sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>Overall CVC Compliance Score — FY 2025-26</Typography>
          <Typography sx={{ fontWeight: 800, color: '#22C55E' }}>82/100</Typography>
        </Box>
        <LinearProgress variant="determinate" value={82} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #1A3C6B, #22C55E)', borderRadius: 5 } }} />
        <Box sx={{ display: 'flex', gap: 3, mt: 1.5, flexWrap: 'wrap' }}>
          {[{ label: 'Process Adherence', val: 90 }, { label: 'Documentation', val: 78 }, { label: 'Timeliness', val: 85 }, { label: 'CVC Clearance Rate', val: 75 }].map(item => (
            <Box key={item.label}>
              <Typography variant="caption" color="text.secondary">{item.label}</Typography>
              <Typography sx={{ fontWeight: 700, color: item.val >= 80 ? '#22C55E' : '#F59E0B' }}>{item.val}%</Typography>
            </Box>
          ))}
        </Box>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider', '& .MuiTab-root': { fontWeight: 600, fontSize: '0.82rem' } }}>
          <Tab label={`Vigilance Register (${COMPLIANCE_RECORDS.length})`} />
          <Tab label={`Audit Findings (${AUDIT_FINDINGS.length})`} />
        </Tabs>

        {tab === 0 && (
          <>
            <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField select size="small" label="Vigilance Status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} sx={{ minWidth: 160 }}>
                <MenuItem value="">All Statuses</MenuItem>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
              </TextField>
              <TextField select size="small" label="Department" value={filterDept} onChange={(e) => setFilterDept(e.target.value)} sx={{ minWidth: 160 }}>
                <MenuItem value="">All Departments</MenuItem>
                {['IT', 'SCADA & Comm.', 'System Operation', 'HR&A', 'Finance & Accounts'].map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Ref. No.', 'Contract', 'Vendor', 'Dept.', 'Value', 'CVC Ref.', 'Observations', 'Status', 'Next Review', 'Actions'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((r) => {
                    const sc = STATUS_CONFIG[r.vigilanceStatus];
                    return (
                      <TableRow key={r.id} sx={{ bgcolor: r.vigilanceStatus === 'referred' ? 'rgba(239,68,68,0.04)' : 'transparent' }}>
                        <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#C9A227' }}>{r.id}</Typography></TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{r.contractName}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{r.contractId}</Typography>
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.8rem' }} color="text.secondary">{r.vendor}</Typography></TableCell>
                        <TableCell><Chip label={r.dept} size="small" sx={{ fontSize: '0.68rem', bgcolor: 'rgba(26,60,107,0.1)', color: '#7FB3E8' }} /></TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.8rem' }}>₹{(r.value / 10000000).toFixed(2)} Cr</Typography></TableCell>
                        <TableCell>
                          {r.cvcRef ? <Typography sx={{ fontSize: '0.75rem', color: '#F87171', fontFamily: 'monospace' }}>{r.cvcRef}</Typography> : <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>—</Typography>}
                        </TableCell>
                        <TableCell>
                          <Chip label={r.auditObservations === 0 ? 'Nil' : r.auditObservations} size="small" sx={{ bgcolor: r.auditObservations > 0 ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.1)', color: r.auditObservations > 0 ? '#F87171' : '#4ADE80', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell>
                          <Chip label={sc.label} size="small" icon={sc.icon} sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: '0.7rem', border: `1px solid ${sc.color}40` }} />
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: '0.78rem' }} color="text.secondary">{r.nextReview}</Typography></TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button size="small" variant="outlined" sx={{ fontSize: '0.68rem', py: 0.3, px: 0.8, minWidth: 0 }}>View</Button>
                            {r.auditObservations > 0 && <Button size="small" variant="contained" sx={{ fontSize: '0.68rem', py: 0.3, px: 0.8, minWidth: 0, bgcolor: '#F59E0B', color: '#0F2544', '&:hover': { bgcolor: '#D97706' } }}>ATR</Button>}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tab === 1 && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['Finding ID', 'Contract Ref.', 'Finding Type', 'Description', 'Raised By', 'Date', 'Status', 'Action Taken'].map(h => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {AUDIT_FINDINGS.map((f) => (
                  <TableRow key={f.id} sx={{ bgcolor: f.status === 'open' ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                    <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#C9A227' }}>{f.id}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#7FB3E8' }}>{f.contractId}</Typography></TableCell>
                    <TableCell>
                      <Chip label={f.findingType} size="small" sx={{ bgcolor: f.findingType === 'Major' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: f.findingType === 'Major' ? '#F87171' : '#FCD34D', fontWeight: 700, fontSize: '0.68rem' }} />
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.8rem', maxWidth: 280 }}>{f.description}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem' }} color="text.secondary">{f.raisedBy}</Typography></TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem' }} color="text.secondary">{f.date}</Typography></TableCell>
                    <TableCell>
                      <Chip label={f.status === 'open' ? 'OPEN' : 'Closed'} size="small" sx={{ bgcolor: f.status === 'open' ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.1)', color: f.status === 'open' ? '#F87171' : '#4ADE80', fontWeight: 700, fontSize: '0.68rem' }} />
                    </TableCell>
                    <TableCell><Typography sx={{ fontSize: '0.78rem' }} color="text.secondary">{f.actionTaken}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </Box>
  );
}
