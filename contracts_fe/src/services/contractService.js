/**
 * Contract API hooks and service functions
 */
import api from './api';

export const contractService = {
  // List contracts
  list: (params = {}) => api.get('/contracts', { params }),

  // Get single contract
  get: (id) => api.get(`/contracts/${id}`),

  // Create contract
  create: (data) => api.post('/contracts', data),

  // Update contract
  update: (id, data) => api.put(`/contracts/${id}`, data),

  // Delete (terminate) contract
  delete: (id) => api.delete(`/contracts/${id}`),
  getPbgEmdAlerts: () => api.get('/contracts/pbg-emd-alerts'),

  // Milestones
  getMilestones: (id) => api.get(`/contracts/${id}/milestones`),
  addMilestone: (id, data) => api.post(`/contracts/${id}/milestones`, data),
  updateMilestone: (id, milestoneId, data) => api.put(`/contracts/${id}/milestones/${milestoneId}`, data),

  // Obligations
  getObligations: (id) => api.get(`/contracts/${id}/obligations`),
  addObligation: (id, data) => api.post(`/contracts/${id}/obligations`, data),
  updateObligation: (id, obligationId, data) => api.put(`/contracts/${id}/obligations/${obligationId}`, data),
  deleteObligation: (id, obligationId) => api.delete(`/contracts/${id}/obligations/${obligationId}`),

  // Amendments
  getAmendments: (id) => api.get(`/contracts/${id}/amendments`),
  createAmendment: (id, data) => api.post(`/contracts/${id}/amendments`, data),

  // Renewals
  getRenewals: (id) => api.get(`/contracts/${id}/renewals`),
  initiateRenewal: (id, data) => api.post(`/contracts/${id}/renewals`, data),
};

export const tenderService = {
  list: (params = {}) => api.get('/tenders', { params }),
  get: (id) => api.get(`/tenders/${id}`),
  create: (data) => api.post('/tenders', data),
  update: (id, data) => api.put(`/tenders/${id}`, data),
  addPreBid: (id, data) => api.post(`/tenders/${id}/pre-bid`, data),
  addCorrigendum: (id, data) => api.post(`/tenders/${id}/corrigendum`, data),
  addBidVendor: (id, data) => api.post(`/tenders/${id}/bid-vendors`, data),
};

export const vendorService = {
  list: (params = {}) => api.get('/vendors', { params }),
  get: (id) => api.get(`/vendors/${id}`),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  addScore: (id, data) => api.post(`/vendors/${id}/score`, data),
};

export const invoiceService = {
  list: (params = {}) => api.get('/invoices', { params }),
  get: (id) => api.get(`/invoices/${id}`),
  submit: (data) => api.post('/invoices', data),
  verify: (id, data) => api.post(`/invoices/${id}/verify`, data),
  processSdac: (id, data) => api.post(`/invoices/${id}/sdac`, data),
  financeApprove: (id, data) => api.post(`/invoices/${id}/finance-approve`, data),
};

export const paymentService = {
  list: (params = {}) => api.get('/payments', { params }),
  create: (data) => api.post('/payments', data),
  markPaid: (id, data) => api.post(`/payments/${id}/mark-paid`, data),
};

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getByDepartment: () => api.get('/dashboard/by-department'),
  getByRegion: () => api.get('/dashboard/by-region'),
  getContractValueTrend: () => api.get('/dashboard/contract-value-trend'),
  getExpiryForecast: () => api.get('/dashboard/expiry-forecast'),
  getProcurementPipeline: () => api.get('/dashboard/procurement-pipeline'),
  getVendorPerformance: () => api.get('/dashboard/vendor-performance'),
};

export const searchService = {
  search: (q) => api.get('/search', { params: { q } }),
};

export const notificationService = {
  list: (params = {}) => api.get('/notifications', { params }),
  markRead: (id) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/mark-all-read'),
};

export const workflowService = {
  create: (data) => api.post('/workflows', data),
  get: (id) => api.get(`/workflows/${id}`),
  approve: (id, data) => api.post(`/workflows/${id}/approve`, data),
  myPending: () => api.get('/workflows/pending'),
};

export const documentService = {
  list: (refType, refId) => api.get(`/documents/${refType}/${refId}`),
  upload: (formData, onProgress) => api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress,
  }),
  download: (id) => api.get(`/documents/${id}/download`, { responseType: 'blob' }),
};

export const slaService = {
  getMatrix: (contractId) => api.get(`/sla/${contractId}`),
  create: (data) => api.post('/sla', data),
  listBreaches: (params = {}) => api.get('/sla/breaches', { params }),
  reportBreach: (data) => api.post('/sla/breaches', data),
  resolveBreach: (id, data) => api.post(`/sla/breaches/${id}/resolve`, data),
};

export const noteService = {
  list: (params = {}) => api.get('/notes', { params }),
  get: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  addEntry: (id, data) => api.post(`/notes/${id}/entries`, data),
};

export const reportService = {
  contractRegister: () => api.get('/reports/contract-register'),
  expiryRegister: () => api.get('/reports/expiry-register'),
  auditTrail: (params = {}) => api.get('/reports/audit-trail', { params }),
};

export const adminService = {
  getRoles: () => api.get('/admin/roles'),
  getUsers: () => api.get('/admin/users'),
  assignRole: (userId, roleName) => api.put(`/admin/users/${userId}/role`, { role_name: roleName }),
};

export const authService = {
  ssoLogin: (ssoToken) => api.post('/auth/sso-login', { sso_token: ssoToken }),
  devLogin: (empId) => api.post('/auth/dev-login', { emp_id: empId }),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
};

export const awardService = {
  list: () => api.get('/awards'),
  create: (data) => api.post('/awards', data),
};
