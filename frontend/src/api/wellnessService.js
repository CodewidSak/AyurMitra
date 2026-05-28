import axiosInstance from './axiosInstance'

export const wellnessService = {
  // Dashboard APIs
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/dashboard/stats')
    return response.data
  },

  // Daily Ritual APIs
  getTodayRituals: async () => {
    const response = await axiosInstance.get('/rituals/today')
    return response.data
  },

  getAllRituals: async () => {
    const response = await axiosInstance.get('/rituals/all')
    return response.data
  },

  completeRitual: async (ritualId) => {
    const response = await axiosInstance.post(`/rituals/${ritualId}/complete`)
    return response.data
  },

  skipRitual: async (ritualId) => {
    const response = await axiosInstance.post(`/rituals/${ritualId}/skip`)
    return response.data
  },

  createRitual: async (ritualData) => {
    const response = await axiosInstance.post('/rituals', ritualData)
    return response.data
  },

  deleteRitual: async (ritualId) => {
    await axiosInstance.delete(`/rituals/${ritualId}`)
  },

  initializeDefaultRituals: async () => {
    await axiosInstance.post('/rituals/initialize')
  },

  // Herb APIs
  getTodayHerb: async () => {
    const response = await axiosInstance.get('/herbs/today')
    return response.data
  },

  getAllHerbs: async () => {
    const response = await axiosInstance.get('/herbs/all')
    return response.data
  },

  getHerbById: async (id) => {
    const response = await axiosInstance.get(`/herbs/${id}`)
    return response.data
  },

  createHerb: async (herbData) => {
    const response = await axiosInstance.post('/herbs', herbData)
    return response.data
  },

  initializeDefaultHerbs: async () => {
    await axiosInstance.post('/herbs/initialize')
  }
}