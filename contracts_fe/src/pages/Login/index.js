import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { LockOutlined, Login as LoginIcon, ElectricBolt } from '@mui/icons-material';

import { authService } from '../../services/contractService';
import { useAuthStore, useUIStore } from '../../store';

const ERLDC_ROLES = [
  { emp_id: '00001', label: 'IT Administrator', role: 'admin', dept: 'Information Technology' },
  { emp_id: '00010', label: 'Section Officer', role: 'initiator', dept: 'Contracts & Services' },
  { emp_id: '00020', label: 'Finance Officer', role: 'finance', dept: 'Finance & Accounts' },
  { emp_id: '00030', label: 'Purchase Manager', role: 'purchase', dept: 'Contracts & Services' },
  { emp_id: '00040', label: 'General Manager (SO)', role: 'gm', dept: 'System Operation' },
  { emp_id: '00050', label: 'Executive Director', role: 'executive_director', dept: 'ERLDC HQ' },
  { emp_id: '00060', label: 'Vigilance Officer', role: 'finance', dept: 'Vigilance' },
];

const ERLDC_STATS = [
  { label: 'Active Contracts', value: '92', icon: '📋' },
  { label: 'Expiring in 90d', value: '18', icon: '⏰' },
  { label: 'Pending Approvals', value: '7', icon: '🔄' },
];

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState('00001');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle SSO token callback in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setLoading(true);
      authService
        .ssoLogin(token)
        .then((res) => {
          setAuth(res.data);
          navigate('/');
        })
        .catch((err) => {
          console.error(err);
          setError('SSO Token verification failed. Please contact IT Support.');
        })
        .finally(() => setLoading(false));
    }
  }, [location, setAuth, navigate]);

  const handleDevLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    authService
      .devLogin(selectedUser)
      .then((res) => {
        setAuth(res.data);
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        setError('Login failed. Please try again or contact IT Support.');
      })
      .finally(() => setLoading(false));
  };

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const selectedRole = ERLDC_ROLES.find(r => r.emp_id === selectedUser);

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background var(--transition-slow)',
      }}
    >
      {/* Animated Background Blobs */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 0,
        '&::before': {
          content: '""', position: 'absolute',
          width: '55vw', height: '55vw',
          top: '-15vw', left: '-10vw',
          background: isDark
            ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%)',
          animation: 'float1 20s ease-in-out infinite',
          filter: 'blur(40px)',
        },
        '&::after': {
          content: '""', position: 'absolute',
          width: '45vw', height: '45vw',
          bottom: '-12vw', right: '-8vw',
          background: isDark
            ? 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 65%)'
            : 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 65%)',
          animation: 'float2 25s ease-in-out infinite',
          filter: 'blur(40px)',
        },
        '@keyframes float1': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(4vw,4vw) scale(1.1)' },
        },
        '@keyframes float2': {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(-4vw,-4vw) scale(1.1)' },
        },
      }} />

      {/* Left Panel — Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          position: 'relative',
          zIndex: 1,
          borderRight: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          bgcolor: isDark ? 'rgba(11, 15, 25, 0.4)' : 'rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Top: Logo Area */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
            <Box sx={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
              borderRadius: 2.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)',
            }}>
              <ElectricBolt sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: 'text.primary', letterSpacing: 0.5 }}>
                ERLDC
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 600 }}>
                POWERGRID CORPORATION OF INDIA LTD
              </Typography>
            </Box>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 2, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Eastern Regional<br />
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #D946EF 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', textFillColor: 'transparent',
            }}>
              Contracts Portal
            </Box>
          </Typography>

          <Typography sx={{ color: 'text.secondary', fontSize: '0.95rem', mb: 4, lineHeight: 1.7, fontWeight: 500 }}>
            Centralised Contract Lifecycle Management for ERLDC, Kolkata — managing procurement, 
            vendor performance, SLA monitoring, and financial compliance for reliable grid operations.
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
            {ERLDC_STATS.map((s) => (
              <Box key={s.label} sx={{
                background: isDark ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.7)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(79,70,229,0.15)',
                borderRadius: 3,
                px: 2.5, py: 1.5,
                minWidth: 130,
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-md)',
                }
              }}>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: 'text.primary' }}>
                  {s.icon} {s.value}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', fontWeight: 600, mt: 0.3 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Bottom: Office Details */}
        <Box>
          <Divider sx={{ mb: 3 }} />
          <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500, mb: 0.5 }}>
            🏛 ERLDC, New Town, Kolkata — 700156, West Bengal
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 500, mb: 0.5 }}>
            📞 +91-33-2324-XXXX &nbsp;|&nbsp; ✉ clm@erldc.in
          </Typography>
          <Typography sx={{ color: 'text.muted', fontSize: '0.72rem', fontWeight: 500 }}>
            Under Ministry of Power, Government of India
          </Typography>
        </Box>
      </Box>

      {/* Right Panel — Login Card */}
      <Box
        sx={{
          width: { xs: '100%', md: 460 },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 5 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Clock */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 600, mb: 0.5 }}>
            {currentTime.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
          <Typography sx={{ color: 'text.primary', fontSize: '1.8rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </Typography>
        </Box>

        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 5,
            backdropFilter: 'blur(20px)',
            bgcolor: 'background.glass',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(79, 70, 229, 0.15)',
            boxShadow: 'var(--shadow-lg)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 20px 40px rgba(79, 70, 229, 0.12)',
            }
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{
                display: 'inline-flex', p: 1.5, borderRadius: 3, mb: 2,
                background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
              }}>
                <LockOutlined sx={{ fontSize: 32, color: '#fff' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                Secure Access
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                ERLDC Contracts Portal
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: '0.8rem' }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <CircularProgress size={40} />
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
                  Authenticating with SSO...
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleDevLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  select
                  fullWidth
                  label="Select Role (Development Mode)"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  size="small"
                >
                  {ERLDC_ROLES.map((u) => (
                    <MenuItem key={u.emp_id} value={u.emp_id}>
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700 }}>{u.label}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary' }}>{u.dept}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                {selectedRole && (
                  <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    background: isDark ? 'rgba(79,70,229,0.1)' : 'rgba(79,70,229,0.06)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(79,70,229,0.25)' : 'rgba(79,70,229,0.15)',
                    borderRadius: 2.5, px: 2, py: 1,
                  }}>
                    <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                      {selectedRole.label[0]}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'text.primary' }}>{selectedRole.label}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>EMP-{selectedRole.emp_id} · {selectedRole.dept}</Typography>
                    </Box>
                    <Chip label={selectedRole.role} size="small" color="primary" variant="outlined" sx={{ ml: 'auto', fontSize: '0.65rem', fontWeight: 700 }} />
                  </Box>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  fullWidth
                  sx={{
                    mt: 0.5,
                    borderRadius: 2.5,
                    py: 1.4,
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    background: 'linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)',
                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4338CA 0%, #0284C7 100%)',
                      boxShadow: '0 8px 28px rgba(79, 70, 229, 0.45)',
                    },
                  }}
                >
                  Sign In to Portal
                </Button>

                <Divider sx={{ my: 0.5 }}>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', px: 1, fontWeight: 600 }}>OR</Typography>
                </Divider>

                <Button
                  variant="outlined"
                  fullWidth
                  size="medium"
                  onClick={() => { window.location.href = 'https://sso.erldc.in:3000'; }}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 700,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    },
                  }}
                >
                  🔐 Login via ERLDC SSO
                </Button>

                <Typography variant="caption" sx={{ color: 'text.muted', textAlign: 'center', display: 'block', fontSize: '0.72rem', fontWeight: 500 }}>
                  Authorised users only · ERLDC IT Policy applies · All access is logged
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem', mt: 3, textAlign: 'center', fontWeight: 500 }}>
          © 2025 Eastern Regional Load Despatch Centre · POWERGRID<br />
          Ministry of Power, Government of India
        </Typography>
      </Box>
    </Box>
  );
}
