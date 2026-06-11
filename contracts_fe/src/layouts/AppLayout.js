import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  InputBase,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContractIcon from '@mui/icons-material/Description';
import TenderIcon from '@mui/icons-material/Gavel';
import VendorIcon from '@mui/icons-material/People';
import InvoiceIcon from '@mui/icons-material/Receipt';
import SlaIcon from '@mui/icons-material/MonitorHeart';
import NoteIcon from '@mui/icons-material/EditNote';
import DocIcon from '@mui/icons-material/FolderOpen';
import NotificationIcon from '@mui/icons-material/NotificationsActive';
import DarkIcon from '@mui/icons-material/Brightness4';
import LightIcon from '@mui/icons-material/Brightness7';
import AdminIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CalendarIcon from '@mui/icons-material/CalendarMonth';
import GridIcon from '@mui/icons-material/ElectricBolt';
import VigilanceIcon from '@mui/icons-material/VerifiedUser';
import FinanceIcon from '@mui/icons-material/AccountBalance';
import RenewalIcon from '@mui/icons-material/Autorenew';
import MouIcon from '@mui/icons-material/Handshake';
import DirectivesIcon from '@mui/icons-material/Policy';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useAuthStore, useUIStore, useNotificationStore } from '../store';
import { notificationService } from '../services/contractService';

const drawerWidth = 268;
const collapsedWidth = 72;

const NAV_SECTIONS = [
  {
    label: 'Core Modules',
    items: [
      { text: 'Command Center', icon: <DashboardIcon />, path: '/' },
      { text: 'Contracts', icon: <ContractIcon />, path: '/contracts', permission: ['contracts', 'read'] },
      { text: 'Tenders / GeM', icon: <TenderIcon />, path: '/tenders', permission: ['tenders', 'read'] },
      { text: 'Vendors', icon: <VendorIcon />, path: '/vendors', permission: ['vendors', 'read'] },
      { text: 'Invoices & Bills', icon: <InvoiceIcon />, path: '/invoices', permission: ['invoices', 'read'] },
      { text: 'SLA Monitoring', icon: <SlaIcon />, path: '/sla', permission: ['sla', 'read'] },
    ],
  },
  {
    label: 'ERLDC Operations',
    items: [
      { text: 'Grid Availability', icon: <GridIcon />, path: '/grid-availability', badge: 'NEW', badgeColor: 'gold' },
      { text: 'Renewals & AMC', icon: <RenewalIcon />, path: '/renewals', badge: '5', badgeColor: 'error' },
      { text: 'MoU & LoA Registry', icon: <MouIcon />, path: '/mou-registry', badge: 'NEW', badgeColor: 'gold' },
      { text: 'Ministry Directives', icon: <DirectivesIcon />, path: '/ministry-directives', badge: '3', badgeColor: 'warning' },
    ],
  },
  {
    label: 'Compliance & Finance',
    items: [
      { text: 'Compliance & Vigilance', icon: <VigilanceIcon />, path: '/compliance', badge: 'NEW', badgeColor: 'gold' },
      { text: 'Financial Reports', icon: <FinanceIcon />, path: '/financial-reports', badge: 'NEW', badgeColor: 'gold' },
      { text: 'AI Clause Auditor', icon: <PsychologyIcon />, path: '/ai-clause' },
    ],
  },
  {
    label: 'Documents & Admin',
    items: [
      { text: 'eOffice Noting', icon: <NoteIcon />, path: '/notes', permission: ['notes', 'read'] },
      { text: 'Documents', icon: <DocIcon />, path: '/documents', permission: ['documents', 'read'] },
      { text: 'Proc. Calendar', icon: <CalendarIcon />, path: '/calendar' },
      { text: 'Admin Panel', icon: <AdminIcon />, path: '/admin', permission: ['admin', 'read'] },
    ],
  },
];

export default function AppLayout({ children }) {
  const { user, logout, hasPermission } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useUIStore();
  const { unreadCount, notifications, setNotifications, setUnreadCount, markRead } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);
  const [searchVal, setSearchVal] = useState('');

  const currentWidth = sidebarCollapsed ? collapsedWidth : drawerWidth;

  useEffect(() => {
    if (user) {
      notificationService.list().then((res) => {
        const list = Array.isArray(res.data) ? res.data : (res.data?.notifications || []);
        const count = typeof res.data?.unread_count === 'number'
          ? res.data.unread_count
          : list.filter((n) => !n.is_read).length;
        setNotifications(list);
        setUnreadCount(count);
      }).catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
    }
  }, [user, setNotifications, setUnreadCount]);

  const handleNotificationClick = (n) => {
    if (!n.is_read) {
      notificationService.markRead(n.id).then(() => markRead(n.id));
    }
    setAnchorElNotif(null);
    if (n.link_to) navigate(n.link_to);
  };

  const filteredSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.permission || hasPermission(item.permission[0], item.permission[1])
    ),
  })).filter((s) => s.items.length > 0);

  const isDark = theme === 'dark';

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
      <div className="animated-bg" />
      {/* ── Top App Bar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          backdropFilter: 'blur(12px)',
          bgcolor: isDark ? 'rgba(7, 17, 31, 0.88)' : 'rgba(240, 244, 248, 0.9)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(201,162,39,0.12)' : 'rgba(26,60,107,0.1)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, minHeight: '64px !important' }}>
          {/* Left: Hamburger + Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleSidebar} edge="start" sx={{ color: 'text.primary', mr: 0.5 }}>
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 32, height: 32,
                background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
                borderRadius: 1.2,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 12px rgba(79,70,229,0.3)',
                flexShrink: 0,
              }}>
                <GridIcon sx={{ color: '#ffffff', fontSize: 20 }} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: isDark ? '#E8EFF7' : '#0F1E30', lineHeight: 1.2 }}>
                  ERLDC Contracts Portal
                </Typography>
                <Typography sx={{ fontSize: '0.62rem', color: isDark ? 'rgba(201,162,39,0.75)' : '#3D5A7A', lineHeight: 1 }}>
                  Eastern Region · POWERGRID
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Center: Search */}
          <Box sx={{
            flex: 1, maxWidth: 520,
            background: isDark ? 'rgba(22,38,56,0.7)' : 'rgba(255,255,255,0.8)',
            border: '1px solid',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,60,107,0.12)',
            borderRadius: 50,
            display: 'flex', alignItems: 'center', px: 2, py: 0.5,
            transition: 'border-color 0.2s',
            '&:focus-within': { borderColor: '#0F5DA3', boxShadow: '0 0 0 3px rgba(15,93,163,0.12)' },
          }}>
            <SearchIcon sx={{ color: '#5A7A9A', mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="Search contracts, vendors, tenders... (Ctrl+K)"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              sx={{ flex: 1, color: 'text.primary', fontSize: '0.85rem', '& input::placeholder': { color: '#5A7A9A' } }}
            />
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
              <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
                {isDark ? <LightIcon fontSize="small" /> : <DarkIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={(e) => setAnchorElNotif(e.currentTarget)} size="small" sx={{ color: 'text.secondary' }}>
                <Badge badgeContent={unreadCount} color="error" max={99}>
                  <NotificationIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notification Menu */}
            <Menu
              anchorEl={anchorElNotif}
              open={Boolean(anchorElNotif)}
              onClose={() => setAnchorElNotif(null)}
              PaperProps={{
                sx: {
                  width: 360, maxHeight: 440, mt: 1.5,
                  borderRadius: 3,
                  border: '1px solid rgba(201,162,39,0.15)',
                  backgroundImage: 'none',
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Notifications</Typography>
                {unreadCount > 0 && (
                  <Typography variant="caption" sx={{ color: '#C9A227', cursor: 'pointer', fontWeight: 600 }}>
                    Mark all read
                  </Typography>
                )}
              </Box>
              <Divider />
              {!Array.isArray(notifications) || notifications.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '1.8rem', mb: 1 }}>🔔</Typography>
                  <Typography variant="body2" color="text.secondary">No new notifications</Typography>
                </Box>
              ) : (
                notifications.slice(0, 8).map((n) => (
                  <MenuItem
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    sx={{
                      py: 1.5, px: 2,
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                      bgcolor: n.is_read ? 'transparent' : 'rgba(26,60,107,0.06)',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, whiteSpace: 'normal' }}>
                      <Typography variant="body2" sx={{ fontWeight: n.is_read ? 400 : 700, fontSize: '0.83rem' }}>
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {n.message}
                      </Typography>
                      <Typography sx={{ fontSize: '0.68rem', opacity: 0.55 }}>
                        {new Date(n.created_at).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* User Menu */}
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3 }}>{user.name}</Typography>
                  <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>
                    {user.role?.display_name || user.department}
                  </Typography>
                </Box>
                <Tooltip title="Account">
                  <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} sx={{ p: 0.3 }}>
                    <Avatar sx={{ bgcolor: '#1A3C6B', width: 34, height: 34, fontWeight: 700, fontSize: '0.85rem', border: '2px solid rgba(201,162,39,0.4)' }}>
                      {user.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={() => setAnchorElUser(null)}
                  sx={{ mt: 1.5 }}
                  PaperProps={{ sx: { borderRadius: 3, minWidth: 220 } }}
                >
                  <Box sx={{ px: 2.5, py: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">Emp ID: {user.emp_id}</Typography>
                    <Chip label={user.role?.display_name || 'Staff'} size="small" sx={{ mt: 0.5, fontSize: '0.65rem', bgcolor: 'rgba(26,60,107,0.12)', color: '#0F5DA3' }} />
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { setAnchorElUser(null); navigate('/profile'); }}>
                    <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                    My Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => { setAnchorElUser(null); logout(); }} sx={{ color: 'error.main' }}>
                    <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Sidebar Drawer ── */}
      <Drawer
        variant="permanent"
        sx={{
          width: currentWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: currentWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: isDark ? 'rgba(201,162,39,0.1)' : 'rgba(26,60,107,0.1)',
            bgcolor: isDark ? '#0B1827' : '#ffffff',
            overflowX: 'hidden',
            transition: (t) => t.transitions.create('width', {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        {/* Logo */}
        <Box sx={{
          height: 64,
          display: 'flex', alignItems: 'center',
          px: sidebarCollapsed ? 1.5 : 2,
          background: 'linear-gradient(135deg, #0F2544 0%, #1A3C6B 100%)',
          borderBottom: '1px solid rgba(201,162,39,0.2)',
          gap: 1.5,
          flexShrink: 0,
        }}>
          <Box sx={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #4F46E5 0%, #EC4899 100%)',
            borderRadius: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 14px rgba(79,70,229,0.4)',
          }}>
            <GridIcon sx={{ color: '#ffffff', fontSize: 22 }} />
          </Box>
          {!sidebarCollapsed && (
            <Box sx={{ overflow: 'hidden' }}>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFFFFF', whiteSpace: 'nowrap', letterSpacing: 0.3 }}>
                ERLDC Contracts Portal
              </Typography>
              <Typography sx={{ fontSize: '0.6rem', color: 'rgba(201,162,39,0.8)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                Eastern Region · POWERGRID
              </Typography>
            </Box>
          )}
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
          {filteredSections.map((section, si) => (
            <Box key={section.label}>
              {!sidebarCollapsed && (
                <Typography sx={{
                  fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.12em', color: '#C9A227', opacity: 0.7,
                  px: 2, pt: si === 0 ? 1.5 : 2, pb: 0.5,
                }}>
                  {section.label}
                </Typography>
              )}
              <List dense disablePadding sx={{ px: 0.75 }}>
                {section.items.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.25 }}>
                      <Tooltip title={sidebarCollapsed ? item.text : ''} placement="right">
                        <ListItemButton
                          onClick={() => navigate(item.path)}
                          sx={{
                            minHeight: 42,
                            justifyContent: sidebarCollapsed ? 'center' : 'initial',
                            px: sidebarCollapsed ? 1.5 : 1.5,
                            borderRadius: 1.5,
                            position: 'relative',
                            color: active ? '#7FB3E8' : 'text.secondary',
                            bgcolor: active ? 'rgba(26,60,107,0.2)' : 'transparent',
                            '&::before': active ? {
                              content: '""',
                              position: 'absolute', left: 0, top: '20%', bottom: '20%',
                              width: 3,
                              background: '#C9A227',
                              borderRadius: '0 3px 3px 0',
                            } : {},
                            '&:hover': {
                              bgcolor: 'rgba(26,60,107,0.12)',
                              color: 'text.primary',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 0, mr: sidebarCollapsed ? 'auto' : 1.5, justifyContent: 'center', color: 'inherit', fontSize: 20 }}>
                            {item.icon}
                          </ListItemIcon>
                          {!sidebarCollapsed && (
                            <>
                              <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: active ? 700 : 500 }}
                              />
                              {item.badge && (
                                <Box sx={{
                                  ml: 0.5, px: 0.8, py: 0.2,
                                  borderRadius: 999,
                                  fontSize: '0.6rem', fontWeight: 700,
                                  bgcolor: item.badgeColor === 'gold'
                                    ? 'rgba(201,162,39,0.18)'
                                    : item.badgeColor === 'error'
                                    ? 'rgba(239,68,68,0.15)'
                                    : 'rgba(245,158,11,0.15)',
                                  color: item.badgeColor === 'gold' ? '#C9A227'
                                    : item.badgeColor === 'error' ? '#F87171'
                                    : '#FCD34D',
                                  border: '1px solid',
                                  borderColor: item.badgeColor === 'gold' ? 'rgba(201,162,39,0.35)'
                                    : item.badgeColor === 'error' ? 'rgba(239,68,68,0.3)'
                                    : 'rgba(245,158,11,0.3)',
                                }}>
                                  {item.badge}
                                </Box>
                              )}
                            </>
                          )}
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          ))}
        </Box>

        {/* Footer */}
        {!sidebarCollapsed && (
          <Box sx={{
            px: 2, py: 1.5,
            borderTop: '1px solid rgba(201,162,39,0.1)',
            background: isDark ? 'rgba(7,17,31,0.5)' : 'rgba(240,244,248,0.5)',
          }}>
            <Typography sx={{ fontSize: '0.6rem', color: '#3D5A7A', textAlign: 'center' }}>
              ERLDC CLM v2.0 · FY 2025-26 · POWERGRID
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* ── Main Content ── */}
      <Box
        component="main"
        key={location.pathname}
        className="animate-fade-in-up"
        sx={{ flexGrow: 1, p: 3, mt: 8, minHeight: '100vh', width: 0, position: 'relative', zIndex: 1 }}
      >
        {children}
      </Box>
    </Box>
  );
}
