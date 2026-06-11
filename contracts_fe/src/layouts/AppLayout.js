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
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ContractIcon from '@mui/icons-material/Description';
import TenderIcon from '@mui/icons-material/Gavel';
import VendorIcon from '@mui/icons-material/People';
import InvoiceIcon from '@mui/icons-material/Receipt';
import SlaIcon from '@mui/icons-material/Warning';
import NoteIcon from '@mui/icons-material/DescriptionOutlined';
import DocIcon from '@mui/icons-material/Folder';
import NotificationIcon from '@mui/icons-material/Notifications';
import DarkIcon from '@mui/icons-material/Brightness4';
import LightIcon from '@mui/icons-material/Brightness7';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AdminIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { useAuthStore, useUIStore, useNotificationStore } from '../store';
import { notificationService } from '../services/contractService';

const drawerWidth = 260;

export default function AppLayout({ children }) {
  const { user, logout, hasPermission } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, theme, toggleTheme } = useUIStore();
  const { unreadCount, notifications, setNotifications, setUnreadCount, markRead } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotif, setAnchorElNotif] = useState(null);

  // Load notifications
  useEffect(() => {
    if (user) {
      notificationService.list().then((res) => {
        const list = res.data || [];
        setNotifications(list);
        setUnreadCount(list.filter((n) => !n.is_read).length);
      }).catch((err) => console.error(err));
    }
  }, [user, setNotifications, setUnreadCount]);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenNotifMenu = (event) => setAnchorElNotif(event.currentTarget);
  const handleCloseNotifMenu = () => setAnchorElNotif(null);

  const handleNotificationClick = (n) => {
    if (!n.is_read) {
      notificationService.markRead(n.id).then(() => {
        markRead(n.id);
      });
    }
    handleCloseNotifMenu();
    if (n.link_to) {
      navigate(n.link_to);
    }
  };

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Contracts', icon: <ContractIcon />, path: '/contracts', permission: ['contracts', 'read'] },
    { text: 'Tenders (GeM)', icon: <TenderIcon />, path: '/tenders', permission: ['tenders', 'read'] },
    { text: 'Vendors', icon: <VendorIcon />, path: '/vendors', permission: ['vendors', 'read'] },
    { text: 'Invoices & Bills', icon: <InvoiceIcon />, path: '/invoices', permission: ['invoices', 'read'] },
    { text: 'SLA Monitoring', icon: <SlaIcon />, path: '/sla', permission: ['sla', 'read'] },
    { text: 'eOffice Noting', icon: <NoteIcon />, path: '/notes', permission: ['notes', 'read'] },
    { text: 'Documents', icon: <DocIcon />, path: '/documents', permission: ['documents', 'read'] },
    { text: 'AI Clause Auditor', icon: <PsychologyIcon />, path: '/ai-clause' },
    { text: 'Procurement Calendar', icon: <CalendarTodayIcon />, path: '/calendar' },
    { text: 'Admin Panel', icon: <AdminIcon />, path: '/admin', permission: ['admin', 'read'] },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.permission || hasPermission(item.permission[0], item.permission[1])
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', transition: 'background-color 0.3s ease' }}>
      {/* Top Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(8px)',
          bgcolor: theme === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={toggleSidebar} edge="start" sx={{ mr: 1, color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" component="div" sx={{ fontWeight: 800, letterSpacing: -0.5, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box component="span" sx={{ fontSize: '1.4rem' }}>⚡</Box>
              GRID-INDIA CLM
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Toggle */}
            <Tooltip title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}>
              <IconButton onClick={toggleTheme} color="inherit">
                {theme === 'dark' ? <LightIcon /> : <DarkIcon />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <IconButton onClick={handleOpenNotifMenu} color="inherit">
              <Badge badgeContent={unreadCount} color="error">
                <NotificationIcon />
              </Badge>
            </IconButton>

            {/* Notification Menu */}
            <Menu
              anchorEl={anchorElNotif}
              open={Boolean(anchorElNotif)}
              onClose={handleCloseNotifMenu}
              PaperProps={{
                sx: { width: 340, maxHeight: 400, mt: 1.5, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' },
              }}
            >
              <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Notifications</Typography>
                {unreadCount > 0 && (
                  <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>
                    Mark all read
                  </Typography>
                )}
              </Box>
              <Divider />
              {notifications.length === 0 ? (
                <MenuItem disabled sx={{ py: 2, justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((n) => (
                  <MenuItem
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    sx={{
                      py: 1.5,
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                      bgcolor: n.is_read ? 'transparent' : 'action.hover',
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, whiteSpace: 'normal' }}>
                      <Typography variant="body2" sx={{ fontWeight: n.is_read ? 400 : 600 }}>
                        {n.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {n.message}
                      </Typography>
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.6 }}>
                        {new Date(n.created_at).toLocaleString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* User Details & Profile */}
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                    {user.role?.display_name || user.department}
                  </Typography>
                </Box>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 600 }}>
                    {user.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  sx={{ mt: 1.5 }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Emp ID: {user.emp_id}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                    <ListItemIcon><AccountCircle fontSize="small" /></ListItemIcon>
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseUserMenu(); logout(); }}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarCollapsed ? 72 : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: sidebarCollapsed ? 72 : drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
            bgcolor: theme === 'dark' ? '#0F172A' : '#ffffff',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <List>
            {filteredNavItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding sx={{ display: 'block', px: 1, py: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 48,
                      justifyContent: sidebarCollapsed ? 'center' : 'initial',
                      px: 2.5,
                      borderRadius: 2,
                      bgcolor: active ? 'primary.main' : 'transparent',
                      color: active ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        bgcolor: active ? 'primary.main' : 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarCollapsed ? 'auto' : 3,
                        justifyContent: 'center',
                        color: 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!sidebarCollapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 600 : 500, fontSize: '0.9rem' }} />}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
