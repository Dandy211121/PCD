import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 60000, // 60s for AI processing
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('crack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for token expiration or errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired
      // localStorage.removeItem('crack_token');
    }
    return Promise.reject(error);
  }
);

export const mediaUrl = (relativePath, subfolder = 'uploads') => {
  if (!relativePath) return '';
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // Check if it already has folder prefix
  if (relativePath.startsWith('storage/')) {
    return `${API_BASE_URL}/${relativePath}`;
  }
  return `${API_BASE_URL}/storage/${subfolder}/${relativePath}`;
};

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    if (res.data.access_token) {
      localStorage.setItem('crack_token', res.data.access_token);
      localStorage.setItem('crack_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.access_token) {
      localStorage.setItem('crack_token', res.data.access_token);
      localStorage.setItem('crack_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('crack_token');
    localStorage.removeItem('crack_user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('crack_user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
};

export const locationService = {
  getAll: async (params = {}) => {
    const res = await api.get('/locations/', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/locations/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/locations/', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/locations/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/locations/${id}`);
    return res.data;
  }
};

export const inspectionService = {
  getAll: async (params = {}) => {
    const res = await api.get('/inspections/', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/inspections/${id}`);
    return res.data;
  },
  getStats: async () => {
    const res = await api.get('/inspections/stats/summary');
    return res.data;
  },
  scan: async (formData, onProgress) => {
    const res = await api.post('/inspections/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      }
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/inspections/${id}`);
    return res.data;
  },
  getPdfDownloadUrl: (id) => {
    return `${API_BASE_URL}/api/inspections/${id}/pdf`;
  }
};

export default api;
