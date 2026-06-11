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
} from '@mui/material';
import { LockOpen, Login as LoginIcon } from '@mui/icons-material';

import { authService } from '../../services/contractService';
import { useAuthStore } from '../../store';

const DEMO_USERS = [
  { emp_id: '00001', label: 'System Administrator (IT)', role: 'admin' },
  { emp_id: '00010', label: 'Section Officer (Initiator)', role: 'initiator' },
  { emp_id: '00020', label: 'Finance Officer (F&A)', role: 'finance' },
  { emp_id: '00030', label: 'Purchase Manager (C&S)', role: 'purchase' },
  { emp_id: '00040', label: 'General Manager (CA)', role: 'gm' },
  { emp_id: '00050', label: 'Executive Director (ED)', role: 'executive_director' },
];

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState('00001');

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
          setError('SSO Token verification failed. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
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
        setError('Development login failed.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#0F172A', // Dark mode background
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(79, 70, 229, 0.15) 0%, transparent 40%)',
      }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 6,
          backdropFilter: 'blur(20px)',
          bgcolor: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
          p: 2,
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              borderRadius: 4,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              mb: 3,
            }}
          >
            <LockOpen fontSize="large" />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8FAFC', mb: 1 }}>
            GRID-INDIA CLM
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 4 }}>
            Contract Lifecycle Management Platform
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ py: 4 }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ color: '#94A3B8', mt: 2 }}>
                Authenticating...
              </Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleDevLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                select
                fullWidth
                label="Select Role (Dev Mode)"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#F1F5F9',
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&:hover fieldset': { borderColor: 'primary.main' },
                  },
                  '& .MuiInputLabel-root': { color: '#94A3B8' },
                }}
              >
                {DEMO_USERS.map((u) => (
                  <MenuItem key={u.emp_id} value={u.emp_id}>
                    {u.label} ({u.role})
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<LoginIcon />}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.4)',
                }}
              >
                Sign In
              </Button>

              <Typography variant="caption" sx={{ color: '#64748B', mt: 1 }}>
                In production, you will be redirected to the ERLDC SSO login.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
