import React, { useState } from 'react';
import {
  Box, Card, Typography, Grid, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  TextField, MenuItem, Avatar, Alert, Paper, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress,
} from '@mui/material';
import { Policy, Add, Download, Warning, CheckCircle, AccessTime, OpenInNew } from '@mui/icons-material';

const DIRECTIVES = [
  {
    id: 'DIR-2025-001', refNo: 'MoP/2025/DO/142', subject: 'Cybersecurity Guidelines for Power Sector — CERT-In Compliance', issuedBy: 'Ministry of Power',
    issuedDate: '2025-01-15', complianceDate: '2025-06-30', daysLeft: 19,
    category: 'Cybersecurity', priority: 'high', status: 'in_progress',
    impactedContracts: ['CLM-2025-055', 'CLM-2024-042'],
    complianceActions: [
      { action: 'Conduct VAPT assessment', responsible: 'IT Dept.', done: true },
      { action: 'Submit compliance report to MoP', responsible: 'GM (IT)', done: false },
      { action: 'Implement OT-IT segmentation', responsible: 'IT + SCADA', done: true },
    ],
    notes: 'Critical compliance — non-compliance may attract notice from CERT-In.',
  },
  {
    id: 'DIR-2025-002', refNo: 'CEA/2025/Regs/RE-Grid/08', subject: 'Grid Code Amendment — Real-Time Monitoring Requirements', issuedBy: 'CEA',
    issuedDate: '2025-02-10', complianceDate: '2025-09-30', daysLeft: 111,
    category: 'Grid Operations', priority: 'medium', status: 'planned',
    impactedContracts: ['CLM-2024-042', 'CLM-2024-058'],
    complianceActions: [
      { action: 'Upgrade SCADA to support 1-second data granularity', responsible: 'SCADA Dept.', done: false },
      { action: 'Amend SCADA AMC to include new spec', responsible: 'C&S Dept.', done: false },
      { action: 'Submit implementation plan', responsible: 'GM (SO)', done: false },
    ],
    notes: 'Grid Code amendment impacts SCADA AMC contract scope.',
  },
  {
    id: 'DIR-2025-003', refNo: 'POSOCO/2025/STF/22', subject: 'Mandatory Use of GeM Portal for Procurement ≤ ₹50L', issuedBy: 'POSOCO / MoP',
    issuedDate: '2025-01-01', complianceDate: '2025-04-01', daysLeft: -71,
    category: 'Procurement', priority: 'high', status: 'completed',
    impactedContracts: [],
    complianceActions: [
      { action: 'Map existing vendors on GeM', responsible: 'C&S Dept.', done: true },
      { action: 'Initiate all new procurements via GeM', responsible: 'All Depts.', done: true },
      { action: 'Submit compliance certificate to POSOCO', responsible: 'DGM (C&S)', done: true },
    ],
    notes: 'Compliance achieved. Certificate submitted on 01-Apr-2025.',
  },
  {
    id: 'DIR-2024-018', refNo: 'MoP/2024/ESG/05', subject: 'Green Procurement Policy — ESG Criteria in Vendor Selection', issuedBy: 'Ministry of Power',
    issuedDate: '2024-10-01', complianceDate: '2025-12-31', daysLeft: 204,
    category: 'Sustainability', priority: 'low', status: 'in_progress',
    impactedContracts: [],
    complianceActions: [
      { action: 'Develop ESG scoring criteria for vendor evaluation', responsible: 'C&S Dept.', done: true },
      { action: 'Include ESG clause in new tender documents', responsible: 'C&S Dept.', done: false },
      { action: 'Mandatory ESG report from vendors > ₹1Cr', responsible: 'C&S Dept.', done: false },
    ],
    notes: 'Part of POWERGRID sustainability initiative.',
  },
  {
    id: 'DIR-2025-004', refNo: 'CVC/2025/Circular/3', subject: 'Integrity Pact for Contracts above ₹2 Crore', issuedBy: 'Central Vigilance Commission',
    issuedDate: '2025-03-01', complianceDate: '2025-07-31', daysLeft: 50,
    category: 'Vigilance', priority: 'high', status: 'in_progress',
    impactedContracts: ['CLM-2025-031', 'CLM-2024-042'],
    complianceActions: [
      { action: 'Identify contracts ≥ ₹2Cr without Integrity Pact', responsible: 'C&S + Vigilance', done: true },
      { action: 'Execute Integrity Pact with vendors', responsible: 'DGM (C&S)', done: false },
      { action: 'Upload executed pacts on CVC portal', responsible: 'Vigilance Dept.', done: false },
    ],
    notes: 'CVC mandate — non-compliance may be flagged in audit.',
  },
  {
    id: 'DIR-2025-005', refNo: 'MoP/2025/DO/189', subject: 'Adoption of India Stack — Aadhaar-based eSign for Contracts', issuedBy: 'Ministry of Power',
    issuedDate: '2025-04-01', complianceDate: '2026-03-31', daysLeft: 294,
    category: 'Digital Initiatives', priority: 'low', status: 'planned',
    impactedContracts: [],
    complianceActions: [
      { action: 'Assess CLM system for eSign integration', responsible: 'IT Dept.', done: false },
      { action: 'Procure eSign API from NIC / DigiLocker', responsible: 'IT Dept.', done: false },
      { action: 'Pilot rollout for new contracts', responsible: 'IT + C&S', done: false },
    ],
    notes: 'Long-term digital transformation initiative.',
  },
];

const PRIORITY_CONFIG = {
  high: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'High' },
  medium: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'Medium' },
  low: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Low' },
};

const STATUS_CONFIG = {
  completed: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)', label: 'Completed', icon: '✅' },
  in_progress: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', label: 'In Progress', icon: '🔄' },
  planned: { color: '#0F5DA3', bg: 'rgba(15,93,163,0.12)', label: 'Planned', icon: '📅' },
  overdue: { color: '#EF4444', bg: 'rgba(239,68,68,0.12)', label: 'Overdue', icon: '🚨' },
};

const CATEGORIES = ['Cybersecurity', 'Grid Operations', 'Procurement', 'Vigilance', 'Sustainability', 'Digital Initiatives'];

function DirectiveCard({ d, onView }) {
  const pc = PRIORITY_CONFIG[d.priority];
  const sc = STATUS_CONFIG[d.daysLeft < 0 && d.status !== 'completed' ? 'overdue' : d.status] || STATUS_CONFIG[d.status];
  const doneCount = d.complianceActions.filter(a => a.done).length;
  const completionPct = Math.round((doneCount / d.complianceActions.length) * 100);

  return (
    <Card sx={{
      borderLeft: `5px solid ${sc.color}`,
      transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 },
    }}>
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Chip label={d.category} size="small" sx={{ bgcolor: 'rgba(26,60,107,0.12)', color: '#7FB3E8', fontSize: '0.68rem' }} />
              <Chip label={`${pc.label} Priority`} size="small" sx={{ bgcolor: pc.bg, color: pc.color, fontSize: '0.68rem', fontWeight: 700 }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.4 }}>{d.subject}</Typography>
            <Typography variant="caption" color="text.secondary">{d.id} · Ref: {d.refNo}</Typography>
          </Box>
          <Chip label={sc.label} size="small" sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 700, fontSize: '0.7rem', height: 'fit-content', border: `1px solid ${sc.color}40` }} />
        </Box>

        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Issued By</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{d.issuedBy}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Issued Date</Typography>
            <Typography sx={{ fontSize: '0.8rem' }}>{d.issuedDate}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">Compliance Deadline</Typography>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: d.daysLeft <= 30 && d.status !== 'completed' ? '#F87171' : 'text.primary' }}>
              {d.complianceDate}
              {d.status !== 'completed' && d.daysLeft > 0 && <span style={{ color: d.daysLeft <= 30 ? '#F87171' : '#FCD34D', fontSize: '0.72rem', fontWeight: 700 }}> ({d.daysLeft}d)</span>}
              {d.status !== 'completed' && d.daysLeft < 0 && <span style={{ color: '#F87171', fontSize: '0.72rem', fontWeight: 700 }}> (OVERDUE!)</span>}
            </Typography>
          </Grid>
        </Grid>

        {/* Compliance Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Compliance Progress</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: completionPct === 100 ? '#22C55E' : completionPct >= 50 ? '#F59E0B' : '#EF4444' }}>
              {doneCount}/{d.complianceActions.length} actions ({completionPct}%)
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionPct}
            sx={{
              height: 6, borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.06)',
              '& .MuiLinearProgress-bar': {
                background: completionPct === 100 ? 'linear-gradient(90deg,#16A34A,#22C55E)' : completionPct >= 50 ? 'linear-gradient(90deg,#D97706,#F59E0B)' : 'linear-gradient(90deg,#DC2626,#EF4444)',
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Action Items */}
        <Box sx={{ mb: 2 }}>
          {d.complianceActions.map((a, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
              {a.done
                ? <CheckCircle sx={{ fontSize: 14, color: '#22C55E', mt: 0.2, flexShrink: 0 }} />
                : <AccessTime sx={{ fontSize: 14, color: '#F59E0B', mt: 0.2, flexShrink: 0 }} />}
              <Typography variant="caption" sx={{ color: a.done ? 'text.secondary' : 'text.primary', textDecoration: a.done ? 'line-through' : 'none' }}>
                {a.action} <span style={{ color: '#8AAAC8' }}>({a.responsible})</span>
              </Typography>
            </Box>
          ))}
        </Box>

        {d.impactedContracts.length > 0 && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Impacted Contracts</Typography>
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {d.impactedContracts.map((ic) => (
                <Chip key={ic} label={ic} size="small" sx={{ bgcolor: 'rgba(26,60,107,0.1)', color: '#7FB3E8', fontSize: '0.68rem', cursor: 'pointer' }} />
              ))}
            </Box>
          </Box>
        )}

        {d.notes && (
          <Box sx={{ bgcolor: 'rgba(201,162,39,0.06)', border: '1px solid rgba(201,162,39,0.18)', borderRadius: 1.5, px: 1.5, py: 1, mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary">📌 {d.notes}</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} onClick={() => onView(d)}>View Details</Button>
          <Button size="small" variant="outlined" startIcon={<OpenInNew sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.75rem' }}>Original Circular</Button>
          {d.status !== 'completed' && <Button size="small" variant="contained" sx={{ fontSize: '0.75rem', background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)', ml: 'auto' }}>Update Status</Button>}
        </Box>
      </Box>
    </Card>
  );
}

export default function MinistryDirectives() {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = DIRECTIVES.filter(d =>
    (!filterCategory || d.category === filterCategory) &&
    (!filterPriority || d.priority === filterPriority)
  );

  const overdueCount = DIRECTIVES.filter(d => d.daysLeft < 0 && d.status !== 'completed').length;
  const dueIn30 = DIRECTIVES.filter(d => d.daysLeft >= 0 && d.daysLeft <= 30 && d.status !== 'completed').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Policy sx={{ color: '#C9A227' }} /> Ministry Directives Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Track MoP, CEA, CVC, POSOCO circulars and their compliance deadlines — ERLDC
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'divider' }}>Export</Button>
          <Button variant="contained" startIcon={<Add />} sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>Log New Directive</Button>
        </Box>
      </Box>

      {/* Alerts */}
      {overdueCount > 0 && (
        <Alert severity="error" sx={{ borderRadius: 2, fontWeight: 600 }}>
          🚨 {overdueCount} ministry directive(s) OVERDUE for compliance. Immediate escalation required.
        </Alert>
      )}
      {dueIn30 > 0 && (
        <Alert severity="warning" sx={{ borderRadius: 2, fontWeight: 600 }}>
          ⚠️ {dueIn30} directive(s) have compliance deadlines within 30 days. Please expedite.
        </Alert>
      )}

      {/* Summary */}
      <Grid container spacing={2}>
        {[
          { label: 'Total Directives', value: DIRECTIVES.length, color: '#1A3C6B', icon: '📋' },
          { label: 'Completed', value: DIRECTIVES.filter(d => d.status === 'completed').length, color: '#22C55E', icon: '✅' },
          { label: 'In Progress', value: DIRECTIVES.filter(d => d.status === 'in_progress').length, color: '#F59E0B', icon: '🔄' },
          { label: 'Planned', value: DIRECTIVES.filter(d => d.status === 'planned').length, color: '#0F5DA3', icon: '📅' },
          { label: 'Overdue', value: overdueCount, color: '#EF4444', icon: '🚨' },
          { label: 'Due in 30d', value: dueIn30, color: '#DC2626', icon: '⚠️' },
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
        <TextField select size="small" label="Category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} sx={{ minWidth: 180 }}>
          <MenuItem value="">All Categories</MenuItem>
          {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="Priority" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} sx={{ minWidth: 140 }}>
          <MenuItem value="">All Priorities</MenuItem>
          {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
        </TextField>
        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center', ml: 'auto' }}>
          {filtered.length} directive(s)
        </Typography>
      </Box>

      {/* Directive Cards */}
      <Grid container spacing={2}>
        {filtered.map((d) => (
          <Grid item xs={12} md={6} key={d.id}>
            <DirectiveCard d={d} onView={setSelected} />
          </Grid>
        ))}
      </Grid>

      {/* Detail Dialog */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {selected && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>Directive Details — {selected.id}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>{selected.subject}</Typography>
                <Divider />
                <Grid container spacing={2}>
                  {[['Reference No.', selected.refNo], ['Issued By', selected.issuedBy], ['Issued Date', selected.issuedDate], ['Compliance Deadline', selected.complianceDate]].map(([l, v]) => (
                    <Grid item xs={6} key={l}>
                      <Typography variant="caption" color="text.secondary">{l}</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{v}</Typography>
                    </Grid>
                  ))}
                </Grid>
                <Box>
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Compliance Actions</Typography>
                  {selected.complianceActions.map((a, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'flex-start' }}>
                      {a.done ? <CheckCircle sx={{ color: '#22C55E', fontSize: 18, mt: 0.2 }} /> : <AccessTime sx={{ color: '#F59E0B', fontSize: 18, mt: 0.2 }} />}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.action}</Typography>
                        <Typography variant="caption" color="text.secondary">Responsible: {a.responsible}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setSelected(null)}>Close</Button>
              <Button variant="contained" sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>Mark Actions Done</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
