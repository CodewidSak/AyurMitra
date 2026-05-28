import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = 'http://localhost:8081/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const status = error.response.status
      const data = error.response.data

      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject({
          ...error,
          message: data?.message || 'Session expired. Please login again.'
        })
      }

      // Handle 403 Forbidden
      if (status === 403) {
        return Promise.reject({
          ...error,
          message: data?.message || 'You do not have permission to perform this action.'
        })
      }

      // Handle 404 Not Found
      if (status === 404) {
        return Promise.reject({
          ...error,
          message: data?.message || 'Resource not found.'
        })
      }

      // Handle 400 Bad Request (validation errors)
      if (status === 400) {
        return Promise.reject({
          ...error,
          message: data?.message || 'Invalid request. Please check your input.',
          fieldErrors: data?.fieldErrors
        })
      }

      // Handle 500 Server Error
      if (status === 500) {
        return Promise.reject({
          ...error,
          message: data?.message || 'Server error. Please try again later.'
        })
      }

      // Generic server error
      return Promise.reject({
        ...error,
        message: data?.message || `Error: ${status}`
      })
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request)
      return Promise.reject({
        ...error,
        message: 'No response from server. Please check your connection.'
      })
    } else {
      // Error in request setup
      console.error('Error:', error.message)
      return Promise.reject({
        ...error,
        message: error.message || 'An unexpected error occurred.'
      })
    }
  }
)

export default axiosInstance
