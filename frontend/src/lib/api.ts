// src/lib/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach token to every request
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh`, {}, { withCredentials: true })
        localStorage.setItem('accessToken', data.data.accessToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return api(original)
      } catch {
        localStorage.removeItem('accessToken')
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── API methods ──────────────────────────────

// Auth
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
}

// Universities
export const universitiesApi = {
  getAll: (params?: Record<string, any>) => api.get('/universities', { params }),
  getOne: (slug: string) => api.get(`/universities/${slug}`),
  getStates: () => api.get('/universities/states'),
  create: (data: any) => api.post('/universities', data),
  update: (id: string, data: any) => api.put(`/universities/${id}`, data),
  delete: (id: string) => api.delete(`/universities/${id}`),
}

// Programs
export const programsApi = {
  getAll: (params?: Record<string, any>) => api.get('/programs', { params }),
  getOne: (id: string) => api.get(`/programs/${id}`),
  create: (data: any) => api.post('/programs', data),
  update: (id: string, data: any) => api.put(`/programs/${id}`, data),
}

// Accreditation
export const accreditationApi = {
  getAll: (params?: Record<string, any>) => api.get('/accreditation', { params }),
  getOne: (id: string) => api.get(`/accreditation/${id}`),
  check: (universitySlug: string, programSlug: string) => api.get('/accreditation/check', { params: { universitySlug, programSlug } }),
  create: (data: any) => api.post('/accreditation', data),
  update: (id: string, data: any) => api.put(`/accreditation/${id}`, data),
}

// Directorates
export const directoratesApi = {
  getAll: () => api.get('/directorates'),
  getOne: (slug: string) => api.get(`/directorates/${slug}`),
  create: (data: any) => api.post('/directorates', data),
  update: (id: string, data: any) => api.put(`/directorates/${id}`, data),
}

// Posts
export const postsApi = {
  getAll: (params?: Record<string, any>) => api.get('/posts', { params }),
  getOne: (slug: string) => api.get(`/posts/${slug}`),
  create: (data: any) => api.post('/posts', data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
}

// Documents
export const documentsApi = {
  getAll: (params?: Record<string, any>) => api.get('/documents', { params }),
  getOne: (slug: string) => api.get(`/documents/${slug}`),
  create: (data: any) => api.post('/documents', data),
  update: (id: string, data: any) => api.put(`/documents/${id}`, data),
  delete: (id: string) => api.delete(`/documents/${id}`),
}

// Stats
export const statsApi = {
  get: () => api.get('/stats'),
}

// Search
export const searchApi = {
  search: (q: string) => api.get('/search', { params: { q } }),
}

// Admin
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  updateRole: (id: string, role: string) => api.patch(`/admin/users/${id}/role`, { role }),
  toggleActive: (id: string) => api.patch(`/admin/users/${id}/toggle`),
}

// API Keys
export const apiKeysApi = {
  getAll: () => api.get('/api-keys'),
  create: (name: string) => api.post('/api-keys', { name }),
  delete: (id: string) => api.delete(`/api-keys/${id}`),
}
