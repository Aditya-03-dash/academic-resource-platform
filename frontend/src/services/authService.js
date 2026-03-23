import api from './api'

export const authService = {
  register: async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    return data
  },

  login: async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    if (data.token) {
      localStorage.setItem('learnhive_token', data.token)
      localStorage.setItem('learnhive_user', JSON.stringify(data.user))
    }
    return data
  },

  logout: () => {
    localStorage.removeItem('learnhive_token')
    localStorage.removeItem('learnhive_user')
  },

  // Admin only — GET /api/users
  getAllUsers: async () => {
    const { data } = await api.get('/api/users')
    return data
  },

  // Admin only — DELETE /api/users/:id
  deleteUser: async (id) => {
    const { data } = await api.delete(`/api/users/${id}`)
    return data
  },

  getStoredUser: () => {
    try {
      return JSON.parse(localStorage.getItem('learnhive_user'))
    } catch {
      return null
    }
  },

  getToken: () => localStorage.getItem('learnhive_token')
}