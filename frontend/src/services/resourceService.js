import api from './api'

export const resourceService = {
  getAll: async () => {
    const { data } = await api.get('/api/resources')
    return data
  },

  getMine: async () => {
    const { data } = await api.get('/api/resources/my')
    return data
  },

  search: async (keyword) => {
    const { data } = await api.get(`/api/resources/search?keyword=${encodeURIComponent(keyword)}`)
    return data
  },

  create: async (formData) => {
    const { data } = await api.post('/api/resources', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/api/resources/${id}`)
    return data
  },

  // Cloudinary returns full URL — use it directly
  getFileUrl: (fileUrl) => fileUrl
}