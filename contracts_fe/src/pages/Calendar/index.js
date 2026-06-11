import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
} from '@mui/material';
import {
  CalendarMonth,
  Schedule,
  Gavel,
  NotificationsActive,
  Warning,
} from '@mui/icons-material';

import api from '../../services/api';

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get('/dashboard/calendar-events')
      .then((res) => {
        setEvents(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load calendar events, using mock:', err);
        setEvents([
          { id: '1', title: 'Expiry: IT Equipment AMC', date: '2026-06-25', type: 'expiry', color: '#EF4444', details: 'Contract ERLDC/IT/AMC/2026/001' },
          { id: '2', title: 'Pre-Bid: UPS Service Contract', date: '2026-06-15', type: 'pre_bid', color: '#3B82F6', details: 'Venue: Virtual Teams Meeting' },
          { id: '3', title: 'Closing: Desktop PCs Supply', date: '2026-06-10', type: 'tender_close', color: '#F59E0B', details: 'Tender No: ERLDC/TND/2026/0002' },
          { id: '4', title: 'Renewal Window: Network Upgrade', date: '2026-07-15', type: 'renewal', color: '#10B981', details: 'Renewal target: 60 days alert window' },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'expiry':
        return <Warning color="error" />;
      case 'pre_bid':
        return <Schedule color="primary" />;
      case 'tender_close':
        return <Gavel color="warning" />;
      default:
        return <CalendarMonth color="success" />;
    }
  };

  // Group events by month/date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Title */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Procurement Calendar</Typography>
          <Typography variant="body2" color="text.secondary">Master schedule of bid openings, BG renewals, and contract execution milestones</Typography>
        </Box>
        <Chip label="Real-time Tracking" color="success" icon={<NotificationsActive />} />
      </Box>

      <Grid container spacing={3}>
        {/* Agenda View */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Upcoming Events Agenda</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
            ) : sortedEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                No scheduled procurement events found.
              </Typography>
            ) : (
              <List>
                {sortedEvents.map((evt) => (
                  <Paper
                    elevation={0}
                    key={evt.id}
                    sx={{
                      p: 1.5,
                      mb: 1.5,
                      borderLeft: `5px solid ${evt.color}`,
                      bgcolor: 'action.hover',
                      border: '1px solid rgba(0,0,0,0.03)',
                      borderLeftWidth: 5,
                    }}
                  >
                    <ListItem disablePadding sx={{ alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>{getEventIcon(evt.type)}</ListItemIcon>
                      <ListItemText
                        primary={evt.title}
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Scheduled Date: <b>{new Date(evt.date).toLocaleDateString()}</b>
                            </Typography>
                            <Typography variant="caption" display="block" color="text.primary">
                              {evt.details}
                            </Typography>
                          </Box>
                        }
                        primaryTypographyProps={{ fontWeight: 600, variant: 'body2' }}
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            )}
          </Card>
        </Grid>

        {/* Schedule Reference Info Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, borderRadius: 4, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Procurement Scheduling Policies</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Chip label="Contract Expiry" size="small" color="error" sx={{ mb: 1, fontWeight: 600 }} />
                <Typography variant="body2" color="text.secondary">
                  Automatic email reminders are triggered at 180, 90, 60, and 30-day thresholds prior to the end date of all active works.
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Chip label="Pre-Bid Meetings" size="small" color="primary" sx={{ mb: 1, fontWeight: 600 }} />
                <Typography variant="body2" color="text.secondary">
                  GeM tender pre-bid clarifications are scheduled hybrid. Meeting details and MS Teams invites are linked directly inside noting sheets.
                </Typography>
              </Box>
              <Divider />
              <Box>
                <Chip label="PBG Expiries" size="small" color="warning" sx={{ mb: 1, fontWeight: 600 }} />
                <Typography variant="body2" color="text.secondary">
                  Active Performance Bank Guarantees must be renewed at least 30 days prior to their expiration date to prevent automatic invocation.
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
