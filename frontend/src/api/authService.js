import axiosInstance from './axiosInstance'

export const authService = {
  register: async (data) => {
    const response = await axiosInstance.post('/auth/register', data)
    return response.data
  },

  login: async (data) => {
    const response = await axiosInstance.post('/auth/login', data)
    return response.data
  },

  getProfile: async () => {
    const response = await axiosInstance.get('/users/profile')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/profile', data)
    return response.data
  },
}
