import React, { useState } from 'react';
import {
  Box, Card, Typography, Grid, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Button,
  LinearProgress, Tabs, Tab, Paper, Divider, Avatar,
} from '@mui/material';
import {
  AccountBalance, Download, TrendingUp, TrendingDown,
  AttachMoney, Receipt, Warning, CheckCircle,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useTheme } from '@mui/material/styles';

const DEPT_BUDGETS = [
  { dept: 'Information Technology', allocated: 9500, spent: 6480, pbg: 1200, tds: 245, advances: 500, advancesRecovered: 350 },
  { dept: 'System Operation', allocated: 7200, spent: 5120, pbg: 800, tds: 188, advances: 300, advancesRecovered: 300 },
  { dept: 'SCADA & Communication', allocated: 5000, spent: 4180, pbg: 650, tds: 156, advances: 200, advancesRecovered: 180 },
  { dept: 'Finance & Accounts', allocated: 2800, spent: 1820, pbg: 0, tds: 68, advances: 100, advancesRecovered: 100 },
  { dept: 'Contracts & Services', allocated: 2200, spent: 2190, pbg: 300, tds: 82, advances: 150, advancesRecovered: 120 },
  { dept: 'Technical Services', allocated: 1950, spent: 1640, pbg: 220, tds: 61, advances: 80, advancesRecovered: 80 },
  { dept: 'HR & Admin', allocated: 1350, spent: 980, pbg: 0, tds: 36, advances: 50, advancesRecovered: 50 },
];

const MONTHLY_SPEND = [
  { month: 'Apr', spend: 2480, payments: 12 },
  { month: 'May', spend: 3120, payments: 18 },
  { month: 'Jun', spend: 2890, payments: 15 },
  { month: 'Jul', spend: 3540, payments: 22 },
  { month: 'Aug', spend: 2980, payments: 16 },
  { month: 'Sep', spend: 4120, payments: 28 },
  { month: 'Oct', spend: 3680, payments: 21 },
  { month: 'Nov', spend: 4250, payments: 24 },
  { month: 'Dec', spend: 3180, payments: 19 },
  { month: 'Jan', spend: 3890, payments: 23 },
  { month: 'Feb', spend: 3450, payments: 20 },
  { month: 'Mar', spend: 5120, payments: 32 },
];

const PBG_STATUS = [
  { id: 'PBG-001', contract: 'SCADA AMC — Siemens', vendor: 'Siemens India', amount: 4250000, bank: 'SBI', validUpto: '2026-03-31', daysLeft: 294 },
  { id: 'PBG-002', contract: 'IT Services — TCS', vendor: 'TCS Ltd', amount: 6000000, bank: 'HDFC', validUpto: '2025-09-30', daysLeft: 111 },
  { id: 'PBG-003', contract: 'Server Procurement — HPE', vendor: 'HPE India', amount: 2750000, bank: 'PNB', validUpto: '2025-07-15', daysLeft: 34 },
  { id: 'PBG-004', contract: 'UPS Maintenance', vendor: 'Emerson NP', amount: 600000, bank: 'SBI', validUpto: '2025-06-30', daysLeft: 19 },
  { id: 'PBG-005', contract: 'Network AMC — BSNL', vendor: 'BSNL', amount: 475000, bank: 'BOI', validUpto: '2026-01-31', daysLeft: 234 },
];

const OUTSTANDING = [
  { invoiceId: 'INV-2025-081', contract: 'IT Services — TCS', vendor: 'TCS Ltd', amount: 4850000, dueDate: '2025-05-31', overdueDays: 11, status: 'overdue' },
  { invoiceId: 'INV-2025-074', contract: 'SCADA AMC', vendor: 'Siemens India', amount: 2125000, dueDate: '2025-06-15', overdueDays: 0, status: 'pending' },
  { invoiceId: 'INV-2025-069', contract: 'Network Services', vendor: 'BSNL', amount: 792000, dueDate: '2025-06-30', overdueDays: 0, status: 'pending' },
  { invoiceId: 'INV-2025-062', contract: 'Technical Services', vendor: 'PWC India', amount: 1250000, dueDate: '2025-05-20', overdueDays: 22, status: 'overdue' },
];

const COLORS = ['#1A3C6B', '#0F5DA3', '#C9A227', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

const SUMMARY_KPIS = [
  { label: 'Total Budget (FY26)', value: '₹302 L', icon: <AccountBalance />, color: '#1A3C6B' },
  { label: 'Spent to Date', value: '₹224 L', icon: <TrendingUp />, color: '#22C55E' },
  { label: 'Balance Available', value: '₹78 L', icon: <AttachMoney />, color: '#C9A227' },
  { label: 'Outstanding Payments', value: '₹61 L', icon: <Receipt />, color: '#F59E0B' },
  { label: 'PBG Expiring (60d)', value: '2', icon: <Warning />, color: '#EF4444' },
  { label: 'Advances Outstanding', value: '₹18 L', icon: <TrendingDown />, color: '#8B5CF6' },
];

export default function FinancialReports() {
  const [tab, setTab] = useState(0);
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const gridColor = isDark ? '#1E3450' : '#E8EFF7';
  const axisColor = isDark ? '#8AAAC8' : '#3D5A7A';
  const tooltipBg = isDark ? '#0F1E30' : '#ffffff';

  const totalAllocated = DEPT_BUDGETS.reduce((s, d) => s + d.allocated, 0);
  const totalSpent = DEPT_BUDGETS.reduce((s, d) => s + d.spent, 0);
  const utilPct = Math.round((totalSpent / totalAllocated) * 100);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalance sx={{ color: '#C9A227' }} /> Financial Reports & Budget Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Department-wise budget utilization, PBG/EMD alerts, outstanding payments — FY 2025-26
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Download />} sx={{ borderColor: 'divider' }}>Export Excel</Button>
          <Button variant="contained" startIcon={<Download />} sx={{ background: 'linear-gradient(135deg,#1A3C6B,#0F5DA3)' }}>CAG Format PDF</Button>
        </Box>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2}>
        {SUMMARY_KPIS.map((k) => (
          <Grid item xs={12} sm={6} md={2} key={k.label}>
            <Card sx={{ p: 2, borderTop: `4px solid ${k.color}`, textAlign: 'center', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
              <Avatar sx={{ bgcolor: `${k.color}18`, color: k.color, mx: 'auto', mb: 1 }}>{k.icon}</Avatar>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 800, color: k.color }}>{k.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{k.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Overall Budget Bar */}
      <Card sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography sx={{ fontWeight: 700 }}>FY 2025-26 Overall Budget Utilization</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">Allocated: <b>₹{totalAllocated} L</b></Typography>
            <Typography variant="body2" color="text.secondary">Spent: <b>₹{totalSpent} L</b></Typography>
            <Typography sx={{ fontWeight: 800, color: utilPct > 85 ? '#EF4444' : utilPct > 70 ? '#F59E0B' : '#22C55E' }}>{utilPct}%</Typography>
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={utilPct} sx={{ height: 12, borderRadius: 6, bgcolor: 'rgba(255,255,255,0.06)', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #1A3C6B, #0F5DA3)', borderRadius: 6 } }} />
      </Card>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider', '& .MuiTab-root': { fontWeight: 600, fontSize: '0.82rem' } }}>
          <Tab label="Dept. Budget Breakdown" />
          <Tab label="Monthly Spend Trend" />
          <Tab label="PBG / EMD Status" />
          <Tab label="Outstanding Payments" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Box sx={{ height: 320 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DEPT_BUDGETS} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                      <XAxis type="number" stroke={axisColor} fontSize={11} tickFormatter={v => `₹${v}L`} />
                      <YAxis type="category" dataKey="dept" stroke={axisColor} fontSize={10} width={120} tickFormatter={v => v.split(' ')[0]} />
                      <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: 8 }} formatter={(v) => [`₹${v} L`]} />
                      <Bar dataKey="allocated" fill="#1A3C6B" opacity={0.3} name="Allocated" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="spent" fill="#0F5DA3" name="Spent" radius={[0, 4, 4, 0]} />
                      <Legend />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {['Department', 'Alloc. (L)', 'Spent (L)', 'Util %', 'TDS (L)'].map(h => (
                          <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase' }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {DEPT_BUDGETS.map((d) => {
                        const u = Math.round((d.spent / d.allocated) * 100);
                        return (
                          <TableRow key={d.dept}>
                            <TableCell><Typography sx={{ fontSize: '0.78rem', fontWeight: 600 }}>{d.dept.split(' ').slice(0, 2).join(' ')}</Typography></TableCell>
                            <TableCell><Typography sx={{ fontSize: '0.78rem' }}>₹{d.allocated}</Typography></TableCell>
                            <TableCell><Typography sx={{ fontSize: '0.78rem' }}>₹{d.spent}</Typography></TableCell>
                            <TableCell>
                              <Chip label={`${u}%`} size="small" sx={{ bgcolor: u > 95 ? 'rgba(239,68,68,0.12)' : u > 80 ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.1)', color: u > 95 ? '#F87171' : u > 80 ? '#FCD34D' : '#4ADE80', fontWeight: 700, fontSize: '0.68rem' }} />
                            </TableCell>
                            <TableCell><Typography sx={{ fontSize: '0.78rem' }}>₹{d.tds}</Typography></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ p: 2.5, height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_SPEND}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} tickFormatter={v => `₹${v}L`} />
                <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: 8 }} formatter={(v, n) => [n === 'spend' ? `₹${v} L` : v, n === 'spend' ? 'Expenditure' : 'Payments Processed']} />
                <Legend />
                <Line type="monotone" dataKey="spend" stroke="#1A3C6B" strokeWidth={3} dot={{ r: 5 }} name="Expenditure (₹L)" />
                <Line type="monotone" dataKey="payments" stroke="#C9A227" strokeWidth={2} strokeDasharray="5 5" name="No. of Payments" />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ p: 2.5 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['PBG ID', 'Contract', 'Vendor', 'PBG Amount', 'Bank', 'Valid Upto', 'Days Left'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {PBG_STATUS.map((p) => (
                    <TableRow key={p.id} sx={{ bgcolor: p.daysLeft <= 30 ? 'rgba(239,68,68,0.05)' : p.daysLeft <= 90 ? 'rgba(245,158,11,0.04)' : 'transparent' }}>
                      <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#C9A227' }}>{p.id}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{p.contract}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.78rem' }} color="text.secondary">{p.vendor}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{(p.amount / 100000).toFixed(2)} L</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.78rem' }} color="text.secondary">{p.bank}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.78rem' }}>{p.validUpto}</Typography></TableCell>
                      <TableCell>
                        <Chip label={p.daysLeft <= 30 ? `${p.daysLeft}d ⚠️` : `${p.daysLeft}d`} size="small" sx={{ bgcolor: p.daysLeft <= 30 ? 'rgba(239,68,68,0.12)' : p.daysLeft <= 90 ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.1)', color: p.daysLeft <= 30 ? '#F87171' : p.daysLeft <= 90 ? '#FCD34D' : '#4ADE80', fontWeight: 700, fontSize: '0.7rem' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tab === 3 && (
          <Box sx={{ p: 2.5 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Invoice ID', 'Contract', 'Vendor', 'Amount', 'Due Date', 'Overdue', 'Status'].map(h => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {OUTSTANDING.map((o) => (
                    <TableRow key={o.invoiceId} sx={{ bgcolor: o.status === 'overdue' ? 'rgba(239,68,68,0.05)' : 'transparent' }}>
                      <TableCell><Typography sx={{ fontWeight: 700, fontSize: '0.78rem', color: '#C9A227' }}>{o.invoiceId}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{o.contract}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.78rem' }} color="text.secondary">{o.vendor}</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{(o.amount / 100000).toFixed(2)} L</Typography></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.78rem' }}>{o.dueDate}</Typography></TableCell>
                      <TableCell>
                        {o.overdueDays > 0 ? <Chip label={`${o.overdueDays}d overdue`} size="small" sx={{ bgcolor: 'rgba(239,68,68,0.12)', color: '#F87171', fontWeight: 700, fontSize: '0.68rem' }} /> : <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>—</Typography>}
                      </TableCell>
                      <TableCell>
                        <Chip label={o.status === 'overdue' ? 'OVERDUE' : 'Pending'} size="small" sx={{ bgcolor: o.status === 'overdue' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: o.status === 'overdue' ? '#F87171' : '#FCD34D', fontWeight: 700, fontSize: '0.68rem' }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Card>
    </Box>
  );
}
