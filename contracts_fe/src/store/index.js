/**
 * Zustand Global State Store
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, access_token, refresh_token }) => {
        localStorage.setItem('clm_access_token', access_token);
        localStorage.setItem('clm_refresh_token', refresh_token);
        set({ user, accessToken: access_token, refreshToken: refresh_token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('clm_access_token');
        localStorage.removeItem('clm_refresh_token');
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        window.location.href = process.env.REACT_APP_SSO_URL || 'https://sso.erldc.in:3000';
      },

      hasPermission: (module, action) => {
        const { user } = get();
        if (!user?.role?.permissions) return false;
        return user.role.permissions.some(
          p => p.module === module && p.action === action
        );
      },

      isRole: (...roleNames) => {
        const { user } = get();
        return roleNames.includes(user?.role?.name);
      },
    }),
    { name: 'clm-auth' }
  )
);

// ── UI Store ────────────────────────────────────────────────────────────────
export const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  theme: 'dark',
  notifications: [],
  unreadCount: 0,
  globalLoading: false,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileSidebar: () => set((s) => ({ mobileSidebarOpen: !s.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    return { theme: next };
  }),
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
}));

// ── Dashboard Store ─────────────────────────────────────────────────────────
export const useDashboardStore = create((set) => ({
  summary: null,
  byDepartment: [],
  byRegion: [],
  contractValueTrend: [],
  expiryForecast: [],
  procurementPipeline: [],
  vendorPerformance: [],
  loading: false,
  error: null,
  lastFetched: null,

  setSummary: (summary) => set({ summary }),
  setByDepartment: (data) => set({ byDepartment: data }),
  setByRegion: (data) => set({ byRegion: data }),
  setContractValueTrend: (data) => set({ contractValueTrend: data }),
  setExpiryForecast: (data) => set({ expiryForecast: data }),
  setProcurementPipeline: (data) => set({ procurementPipeline: data }),
  setVendorPerformance: (data) => set({ vendorPerformance: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setLastFetched: (ts) => set({ lastFetched: ts }),
}));

// ── Contract Store ──────────────────────────────────────────────────────────
export const useContractStore = create((set) => ({
  contracts: [],
  selectedContract: null,
  pagination: { page: 1, per_page: 20, total: 0, pages: 0 },
  filters: { status: '', department: '', type: '', search: '', region: '' },
  loading: false,
  error: null,

  setContracts: (contracts, pagination) => set({ contracts, pagination }),
  setSelectedContract: (contract) => set({ selectedContract: contract }),
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: { status: '', department: '', type: '', search: '', region: '' } }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

// ── Notifications Store ─────────────────────────────────────────────────────
export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  markRead: (id) => set((s) => ({
    notifications: s.notifications.map(n => n.id === id ? { ...n, is_read: true } : n),
    unreadCount: Math.max(0, s.unreadCount - 1),
  })),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map(n => ({ ...n, is_read: true })),
    unreadCount: 0,
  })),
}));
