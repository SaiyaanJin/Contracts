import React, { useEffect, useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, CircularProgress,
  Button, useTheme, Avatar, Chip, Divider, LinearProgress, Paper,
} from '@mui/material';
import {
  TrendingUp, Assignment, Schedule, AttachMoney,
  Warning, Security, Speed, WorkspacePremium, AccountBalance,
  OpenInNew, Add, ElectricBolt, Autorenew, GppGood,
} from '@mui/icons-material';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

import { useDashboardStore } from '../../store';
import { dashboardService } from '../../services/contractService';
import api from '../../services/api';

const COLORS = ['#4F46E5', '#EC4899', '#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

const ERLDC_DEPARTMENTS = [
  { department: 'Information Technology', total: 28, active: 20, expired: 5, expiring_soon: 3, total_value: 95000000 },
  { department: 'System Operation', total: 22, active: 16, expired: 4, expiring_soon: 2, total_value: 72000000 },
  { department: 'SCADA & Comm.', total: 15, active: 11, expired: 3, expiring_soon: 1, total_value: 48000000 },
  { department: 'Finance & Accounts', total: 10, active: 7, expired: 2, expiring_soon: 1, total_value: 28000000 },
  { department: 'Contracts & Services', total: 8, active: 6, expired: 1, expiring_soon: 1, total_value: 22000000 },
  { department: 'Technical Services', total: 9, active: 7, expired: 1, expiring_soon: 1, total_value: 19500000 },
];

const BUDGET_DATA = [
  { dept: 'IT', allocated: 100, spent: 68, color: '#1A3C6B' },
  { dept: 'SO', allocated: 80, spent: 55, color: '#0F5DA3' },
  { dept: 'SCADA', allocated: 50, spent: 42, color: '#C9A227' },
  { dept: 'F&A', allocated: 30, spent: 18, color: '#22C55E' },
  { dept: 'C&S', allocated: 25, spent: 22, color: '#F59E0B' },
  { dept: 'TS', allocated: 20, spent: 16, color: '#EF4444' },
];

const QUICK_ACTIONS = [
  { label: 'New Note Sheet', icon: '📝', path: '/notes', color: '#4F46E5' },
  { label: 'Raise Invoice', icon: '🧾', path: '/invoices', color: '#EC4899' },
  { label: 'New Tender', icon: '⚖️', path: '/tenders', color: '#0EA5E9' },
  { label: 'AMC Renewal', icon: '🔁', path: '/renewals', color: '#10B981' },
  { label: 'Grid Status', icon: '⚡', path: '/grid-availability', color: '#F59E0B' },
  { label: 'Compliance Check', icon: '🛡️', path: '/compliance', color: '#8B5CF6' },
];

const DepartmentTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid var(--border-default)',
        background: 'var(--glass-bg)',
        backdropFilter: 'var(--glass-blur)',
        boxShadow: 'var(--shadow-md)',
        minWidth: 170,
        zIndex: 9999,
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          🏢 {data.department}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">Total Contracts:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{data.total}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">Active:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#22C55E' }}>{data.active ?? 0}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">Expiring (30d):</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#F59E0B' }}>{data.expiring_soon ?? 0}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">Expired:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#EF4444' }}>{data.expired ?? 0}</Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">Portfolio Value:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 800 }}>₹{((data.total_value ?? 0) / 10000000).toFixed(2)} Cr</Typography>
          </Box>
        </Box>
      </Paper>
    );
  }
  return null;
};

export default function Dashboard() {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === 'dark';
  const navigate = useNavigate();

  const {
    summary, byDepartment, contractValueTrend, expiryForecast,
    vendorPerformance, loading,
    setSummary, setByDepartment, setContractValueTrend,
    setExpiryForecast, setVendorPerformance, setLoading,
  } = useDashboardStore();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.getSummary(),
      dashboardService.getByDepartment(),
      dashboardService.getContractValueTrend(),
      dashboardService.getExpiryForecast(),
      dashboardService.getVendorPerformance(),
    ])
      .then(([sumRes, deptRes, trendRes, expRes, vendRes]) => {
        setSummary(sumRes.data);
        setByDepartment(deptRes.data || []);
        setContractValueTrend(trendRes.data || []);
        setExpiryForecast(expRes.data || []);
        setVendorPerformance(vendRes.data || []);
      })
      .catch(() => {
        setSummary({ total_contracts: 92, active_contracts: 68, expiring_soon: 14, expired_contracts: 10, total_value: 284500000, pending_approvals: 5 });
        setByDepartment(ERLDC_DEPARTMENTS);
        setContractValueTrend([
          { month: 'Jan', value: 220 }, { month: 'Feb', value: 248 }, { month: 'Mar', value: 270 },
          { month: 'Apr', value: 255 }, { month: 'May', value: 280 }, { month: 'Jun', value: 284 },
        ]);
        setExpiryForecast([
          { month: 'Jul', expired: 2, expiring: 4 }, { month: 'Aug', expired: 1, expiring: 6 },
          { month: 'Sep', expired: 3, expiring: 9 }, { month: 'Oct', expired: 1, expiring: 5 },
          { month: 'Nov', expired: 2, expiring: 7 }, { month: 'Dec', expired: 0, expiring: 11 },
        ]);
        setVendorPerformance([
          { name: 'TCS', score: 91 }, { name: 'Wipro', score: 85 },
          { name: 'Siemens', score: 88 }, { name: 'ABB India', score: 79 }, { name: 'BSNL', score: 65 },
        ]);
      })
      .finally(() => setLoading(false));
  }, [setSummary, setByDepartment, setContractValueTrend, setExpiryForecast, setVendorPerformance, setLoading]);

  if (loading && !summary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress size={56} sx={{ color: '#C9A227' }} />
        <Typography color="text.secondary">Loading ERLDC Command Center...</Typography>
      </Box>
    );
  }

  const kpis = [
    { title: 'Total Contracts', val: summary?.total_contracts ?? 92, icon: <Assignment fontSize="large" />, color: '#1A3C6B', sub: 'FY 2025-26' },
    { title: 'Active Contracts', val: summary?.active_contracts ?? 68, icon: <TrendingUp fontSize="large" />, color: '#22C55E', sub: `${Math.round(((summary?.active_contracts ?? 68) / (summary?.total_contracts ?? 92)) * 100)}% of portfolio` },
    { title: 'Expiring (90 days)', val: summary?.expiring_soon ?? 14, icon: <Schedule fontSize="large" />, color: '#F59E0B', sub: 'Action required' },
    { title: 'Portfolio Value', val: `₹${((summary?.total_value ?? 284500000) / 10000000).toFixed(1)} Cr`, icon: <AttachMoney fontSize="large" />, color: '#C9A227', sub: 'Total contracted amount' },
    { title: 'Pending Approvals', val: summary?.pending_approvals ?? 5, icon: <Warning fontSize="large" />, color: '#EF4444', sub: 'Awaiting action' },
    { title: 'CVC Compliance', val: '100%', icon: <Security fontSize="large" />, color: '#0F5DA3', sub: 'Zero open findings' },
    { title: 'Avg. Cycle Time', val: '38.5d', icon: <Speed fontSize="large" />, color: '#8B5CF6', sub: 'Benchmark: 45 days' },
    { title: 'Cost Savings', val: '₹1.42 Cr', icon: <WorkspacePremium fontSize="large" />, color: '#10B981', sub: '5.0% below estimate' },
  ];

  const gridColor = isDark ? '#1E3450' : '#E8EFF7';
  const axisColor = isDark ? '#8AAAC8' : '#3D5A7A';
  const tooltipBg = isDark ? '#0F1E30' : '#ffffff';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>
            ⚡ ERLDC Command Center
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Eastern Regional Load Despatch Centre — Contract & Procurement Intelligence Dashboard · FY 2025-26
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="● LIVE"
            size="small"
            sx={{ bgcolor: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.3)', fontWeight: 700, animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } } }}
          />
          <Chip label="ERLDC · Kolkata HQ" variant="outlined" size="small" sx={{ borderColor: 'rgba(201,162,39,0.4)', color: '#C9A227', fontWeight: 600 }} />
          <Button variant="contained" size="small" startIcon={<Add />} onClick={() => navigate('/contracts')}>
            New Contract
          </Button>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Card sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#C9A227', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Quick Actions
        </Typography>
        <Grid container spacing={1.5}>
          {QUICK_ACTIONS.map((qa) => (
            <Grid item xs={6} sm={4} md={2} key={qa.label}>
              <Box
                onClick={() => navigate(qa.path)}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 1, py: 2, px: 1,
                  borderRadius: 2, cursor: 'pointer',
                  border: '1px solid', borderColor: 'divider',
                  transition: 'all 0.2s',
                  '&:hover': { borderColor: qa.color, bgcolor: `${qa.color}12`, transform: 'translateY(-2px)' },
                }}
              >
                <Typography sx={{ fontSize: '1.8rem' }}>{qa.icon}</Typography>
                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, textAlign: 'center', color: 'text.secondary' }}>
                  {qa.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* KPI Grid */}
      <Grid container spacing={2}>
        {kpis.map((kpi, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ position: 'relative', overflow: 'hidden', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-3px)' } }}>
              <Box sx={{ height: 4, background: kpi.color, width: '100%' }} />
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, pb: '20px !important' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.68rem' }}>
                    {kpi.title}
                  </Typography>
                  <Typography sx={{ fontSize: '1.7rem', fontWeight: 800, my: 0.3, lineHeight: 1.1 }}>{kpi.val}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{kpi.sub}</Typography>
                </Box>
                <Avatar sx={{ bgcolor: `${kpi.color}18`, color: kpi.color, width: 52, height: 52 }}>
                  {kpi.icon}
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Row 1: Main Charts (Growth Trend Area & Department Doughnut) */}
      <Grid container spacing={3}>
        {/* Value Growth Area Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Contract Portfolio Value Growth (₹ Millions) — FY 2025-26
            </Typography>
            <Box sx={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={contractValueTrend}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                  <YAxis stroke={axisColor} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: '#4F46E5', borderRadius: 8 }} />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>

        {/* ERLDC Departmental Contract Status Doughnut Chart */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              🏢 ERLDC Dept Contract Status
            </Typography>
            <Box sx={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byDepartment}
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="total"
                  >
                    {byDepartment.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<DepartmentTooltip />} />
                  <Legend verticalAlign="bottom" height={36} formatter={(val) => val ? String(val).substring(0, 12) : ''} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Row 2: Metrics Lists (Budget Utilization & Vendor Performance) */}
      <Grid container spacing={3}>
        {/* Department Budget Utilization */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              <AccountBalance sx={{ mr: 1, verticalAlign: 'middle', color: '#C9A227' }} />
              FY 2025-26 Department Budget Utilization (₹ Lakhs)
            </Typography>
            <Grid container spacing={2}>
              {BUDGET_DATA.map((b) => (
                <Grid item xs={12} sm={6} key={b.dept}>
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.dept}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        ₹{b.spent}L / ₹{b.allocated}L
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Number.isFinite((b.spent / b.allocated) * 100) ? (b.spent / b.allocated) * 100 : 0}
                      sx={{
                        height: 8, borderRadius: 4,
                        bgcolor: 'rgba(255,255,255,0.06)',
                        '& .MuiLinearProgress-bar': { background: b.color, borderRadius: 4 },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((b.spent / b.allocated) * 100)}% utilized
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>

        {/* Top Vendor Performance Scores */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2.5, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
              Top Vendor Performance Scores
            </Typography>
            {vendorPerformance.slice(0, 4).map((v, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{v.name}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: v.score >= 85 ? '#22C55E' : v.score >= 70 ? '#F59E0B' : '#EF4444' }}>
                    {v.score}/100
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={v.score ?? 0}
                  sx={{
                    height: 6, borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': {
                      background: (v.score ?? 0) >= 85 ? 'linear-gradient(90deg,#16A34A,#22C55E)'
                        : (v.score ?? 0) >= 70 ? 'linear-gradient(90deg,#D97706,#F59E0B)'
                        : 'linear-gradient(90deg,#DC2626,#EF4444)',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
            <Button variant="outlined" size="small" fullWidth sx={{ mt: 1, borderColor: 'divider' }} onClick={() => navigate('/vendors')}>
              View All Vendors
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Row 3: Forecast Line Chart (Full Width) */}
      <Card sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Contract Expiration Forecast</Typography>
        <Box sx={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={expiryForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
              <YAxis stroke={axisColor} fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="expiring" stroke="#F59E0B" strokeWidth={3} dot={{ r: 5 }} name="Expiring Soon" />
              <Line type="monotone" dataKey="expired" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" name="Expired" />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>
    </Box>
  );
}
