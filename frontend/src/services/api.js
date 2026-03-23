import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('learnhive_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('learnhive_token')
      localStorage.removeItem('learnhive_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api