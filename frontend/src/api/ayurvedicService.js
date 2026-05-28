import axiosInstance from './axiosInstance'

export const ayurvedicService = {
  getRemedy: async (symptomRequest) => {
    const response = await axiosInstance.post('/ayurvedic/remedy', symptomRequest)
    return response.data
  },

  getChatHistory: async () => {
    const response = await axiosInstance.get('/ayurvedic/chat-history')
    return response.data
  },
}
