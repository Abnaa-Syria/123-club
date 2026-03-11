import api from './axios';

// ============================================
// Auth APIs
// ============================================
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  changePassword: (data) => api.post('/auth/change-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// ============================================
// Dashboard APIs
// ============================================
export const dashboardAPI = {
  getOverview: () => api.get('/dashboard/overview'),
  getRecentRegistrations: (limit = 10) => api.get(`/dashboard/recent-registrations?limit=${limit}`),
  getRecentOrders: (limit = 10) => api.get(`/dashboard/recent-orders?limit=${limit}`),
  getRecentActivities: (limit = 20) => api.get(`/dashboard/recent-activities?limit=${limit}`),
};

// ============================================
// Users APIs
// ============================================
export const usersAPI = {
  list: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  suspend: (id) => api.patch(`/users/${id}/suspend`),
  activate: (id) => api.patch(`/users/${id}/activate`),
  delete: (id) => api.delete(`/users/${id}`),
};

// ============================================
// Membership APIs
// NOTE: Expose generic CRUD shape (list/getById/create/update/delete)
// so it works seamlessly with GenericCrudPage.
// ============================================
export const membershipAPI = {
  // GenericCrudPage expects `list`
  list: (params) => api.get('/membership/plans', { params }),
  // Aliases for clarity
  listPlans: (params) => api.get('/membership/plans', { params }),
  getById: (id) => api.get(`/membership/plans/${id}`),
  getPlan: (id) => api.get(`/membership/plans/${id}`),
  create: (data) => api.post('/membership/plans', data),
  createPlan: (data) => api.post('/membership/plans', data),
  update: (id, data) => api.put(`/membership/plans/${id}`, data),
  updatePlan: (id, data) => api.put(`/membership/plans/${id}`, data),
  delete: (id) => api.delete(`/membership/plans/${id}`),
  deletePlan: (id) => api.delete(`/membership/plans/${id}`),
  assignMembership: (userId, planId) => api.post(`/membership/assign/${userId}`, { planId }),
};

// ============================================
// Avatars APIs
// ============================================
export const avatarsAPI = {
  list: (params) => api.get('/avatars', { params }),
  getById: (id) => api.get(`/avatars/${id}`),
  create: (data) => api.post('/avatars', data),
  update: (id, data) => api.put(`/avatars/${id}`, data),
  delete: (id) => api.delete(`/avatars/${id}`),
};

// ============================================
// Content Categories APIs
// ============================================
export const contentCategoriesAPI = {
  list: (params) => api.get('/content-categories', { params }),
  getById: (id) => api.get(`/content-categories/${id}`),
  create: (data) => api.post('/content-categories', data),
  update: (id, data) => api.put(`/content-categories/${id}`, data),
  delete: (id) => api.delete(`/content-categories/${id}`),
};

// ============================================
// Content APIs
// ============================================
export const contentAPI = {
  list: (params) => api.get('/content/admin', { params }),
  getById: (id) => api.get(`/content/${id}`),
  create: (data) => api.post('/content', data),
  update: (id, data) => api.put(`/content/${id}`, data),
  delete: (id) => api.delete(`/content/${id}`),
};

// ============================================
// Banners APIs
// ============================================
export const bannersAPI = {
  list: (params) => api.get('/banners/admin', { params }),
  getAll: (params) => api.get('/banners/admin', { params }),
  getById: (id) => api.get(`/banners/${id}`),
  create: (data) => api.post('/banners', data),
  update: (id, data) => api.put(`/banners/${id}`, data),
  delete: (id) => api.delete(`/banners/${id}`),
};

// ============================================
// Product Categories APIs
// ============================================
export const productCategoriesAPI = {
  list: (params) => api.get('/product-categories', { params }),
  getById: (id) => api.get(`/product-categories/${id}`),
  create: (data) => api.post('/product-categories', data),
  update: (id, data) => api.put(`/product-categories/${id}`, data),
  delete: (id) => api.delete(`/product-categories/${id}`),
};

// ============================================
// Products APIs
// ============================================
export const productsAPI = {
  list: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

// ============================================
// Orders APIs
// ============================================
export const ordersAPI = {
  list: (params) => api.get('/orders/admin', { params }),
  getAll: (params) => api.get('/orders/admin', { params }),
  getById: (id) => api.get(`/orders/admin/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/admin/${id}/status`, { status }),
};

// ============================================
// Wallet APIs
// ============================================
export const walletAPI = {
  getUserWallet: (id) => {
    if (typeof id === 'string' && id.startsWith('CLB-')) {
      return api.get(`/wallet/admin/by-member/${id}`);
    }
    return api.get(`/wallet/admin/${id}`);
  },
  getUserTransactions: (id, params) => {
    if (typeof id === 'string' && id.startsWith('CLB-')) {
      return api.get(`/wallet/admin/by-member/${id}/transactions`, { params });
    }
    return api.get(`/wallet/admin/${id}/transactions`, { params });
  },
  addPoints: (userId, data) => api.post(`/wallet/admin/${userId}/add`, data),
  deductPoints: (userId, data) => api.post(`/wallet/admin/${userId}/deduct`, data),
};

// ============================================
// Notifications APIs
// ============================================
export const notificationsAPI = {
  sendToUser: (data) => api.post('/notifications/admin/send', data),
  sendToAll: (data) => api.post('/notifications/admin/send-all', data),
};

// ============================================
// Referrals APIs
// ============================================
export const referralsAPI = {
  getAll: (params) => api.get('/referrals/admin', { params }),
  list: (params) => api.get('/referrals/admin', { params }),
};

// ============================================
// Upload APIs
// ============================================
export const uploadAPI = {
  upload: (type, formData) => api.post(`/upload/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ============================================
// Static Pages APIs
// ============================================
export const pagesAPI = {
  getAll: (params) => api.get('/pages', { params }),
  list: (params) => api.get('/pages', { params }),
  getById: (id) => api.get(`/pages/${id}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
  delete: (id) => api.delete(`/pages/${id}`),
};

// ============================================
// FAQ APIs
// ============================================
export const faqAPI = {
  getAll: (params) => api.get('/faqs', { params }),
  list: (params) => api.get('/faqs', { params }),
  getById: (id) => api.get(`/faqs/${id}`),
  create: (data) => api.post('/faqs', data),
  update: (id, data) => api.put(`/faqs/${id}`, data),
  delete: (id) => api.delete(`/faqs/${id}`),
};

// Also export as faqsAPI for backward compat
export const faqsAPI = faqAPI;

// ============================================
// Settings APIs
// ============================================
export const settingsAPI = {
  getAll: (params) => api.get('/settings', { params }),
  getByKey: (key) => api.get(`/settings/${key}`),
  create: (data) => api.post('/settings', data),
  update: (key, data) => api.put(`/settings/${key}`, data),
  upsert: (data) => api.post('/settings', data),
  bulkUpdate: (settings) => api.put('/settings/bulk', { settings }),
  delete: (key) => api.delete(`/settings/${key}`),
};
