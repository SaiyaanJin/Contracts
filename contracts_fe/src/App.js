import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography } from '@mui/material';

import { getTheme } from './styles/theme';
import { useAuthStore, useUIStore } from './store';
import { authService } from './services/contractService';

// Layouts
import AppLayout from './layouts/AppLayout';

// Pages — Core
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Contracts from './pages/Contracts';
import Tenders from './pages/Tender';
import Vendors from './pages/Vendor';
import Invoices from './pages/Invoice';
import SLA from './pages/SLA';
import NoteSheets from './pages/NoteSheet';
import Documents from './pages/Documents';
import Admin from './pages/Admin';
import ClauseComparison from './pages/ClauseComparison';
import CalendarView from './pages/Calendar';

// Pages — ERLDC New
import GridAvailability from './pages/GridAvailability';
import Compliance from './pages/Compliance';
import FinancialReports from './pages/FinancialReports';
import Renewals from './pages/Renewals';
import MouRegistry from './pages/MouRegistry';
import MinistryDirectives from './pages/MinistryDirectives';

// Route Guards
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated
    ? <AppLayout>{children}</AppLayout>
    : <Navigate to="/login" replace />;
}

export default function App() {
  const { theme } = useUIStore();
  const { setAuth, logout, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  // Sync theme attribute with DOM root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Restore session & check for automatic login via SSO token query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get('token');

    if (ssoToken) {
      authService.ssoLogin(ssoToken)
        .then((res) => {
          setAuth(res.data);
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, document.title, url.pathname + url.search);
        })
        .catch((err) => {
          console.error('SSO login failed:', err);
        })
        .finally(() => setLoading(false));
    } else {
      const token = localStorage.getItem('clm_access_token');
      const refresh = localStorage.getItem('clm_refresh_token');

      if (token) {
        authService.me()
          .then((res) => {
            setAuth({ user: res.data, access_token: token, refresh_token: refresh });
          })
          .catch((err) => {
            console.error('Session restore failed:', err);
            logout();
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }
  }, [setAuth, logout]);

  const muiTheme = getTheme(theme);

  if (loading) {
    return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Box sx={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          minHeight: '100vh', bgcolor: 'background.default', gap: 2,
        }}>
          <Box sx={{
            width: 56, height: 56,
            background: 'linear-gradient(135deg, #9B7A0F 0%, #C9A227 100%)',
            borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 28px rgba(201,162,39,0.4)',
            fontSize: '2rem', mb: 1,
          }}>
            ⚡
          </Box>
          <CircularProgress size={48} sx={{ color: '#C9A227' }} />
          <Typography color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            Loading ERLDC Contracts Portal...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected — Core Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/contracts" element={<ProtectedRoute><Contracts /></ProtectedRoute>} />
          <Route path="/tenders" element={<ProtectedRoute><Tenders /></ProtectedRoute>} />
          <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/sla" element={<ProtectedRoute><SLA /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><NoteSheets /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/ai-clause" element={<ProtectedRoute><ClauseComparison /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

          {/* Protected — ERLDC-Specific Routes */}
          <Route path="/grid-availability" element={<ProtectedRoute><GridAvailability /></ProtectedRoute>} />
          <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
          <Route path="/financial-reports" element={<ProtectedRoute><FinancialReports /></ProtectedRoute>} />
          <Route path="/renewals" element={<ProtectedRoute><Renewals /></ProtectedRoute>} />
          <Route path="/mou-registry" element={<ProtectedRoute><MouRegistry /></ProtectedRoute>} />
          <Route path="/ministry-directives" element={<ProtectedRoute><MinistryDirectives /></ProtectedRoute>} />

          {/* Wildcard */}
          <Route path="*" element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
