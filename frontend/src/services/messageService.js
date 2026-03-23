import api from './api'

export const messageService = {
  // GET /api/messages/:userId  (auth required)
  // Returns all messages between current user and :userId, sorted by createdAt asc
  getConversation: async (userId) => {
    const { data } = await api.get(`/api/messages/${userId}`)
    return data
  }
}