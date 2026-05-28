import axiosInstance from './axiosInstance'

export const medicalService = {
  addCondition: async (data) => {
    const response = await axiosInstance.post('/medical-conditions', data)
    return response.data
  },

  getConditions: async () => {
    const response = await axiosInstance.get('/medical-conditions')
    return response.data
  },

  getActiveConditions: async () => {
    const response = await axiosInstance.get('/medical-conditions/active')
    return response.data
  },

  updateCondition: async (id, data) => {
    const response = await axiosInstance.put(`/medical-conditions/${id}`, data)
    return response.data
  },

  deleteCondition: async (id) => {
    const response = await axiosInstance.delete(`/medical-conditions/${id}`)
    return response.data
  },
}
