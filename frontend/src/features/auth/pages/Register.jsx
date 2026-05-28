import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../api/authService'
import { motion } from 'framer-motion'

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    heightCm: '',
    weightKg: '',
    age: '',
    gender: 'Male'
  })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value) return 'Username is required'
        if (value.length < 3) return 'Username must be at least 3 characters'
        if (value.length > 20) return 'Username must not exceed 20 characters'
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return 'Username can only contain letters, numbers, and underscores'
        return ''
      
      case 'email':
        if (!value) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
        return ''
      
      case 'password':
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
        if (!/[!@#$%^&*]/.test(value)) return 'Password must contain at least one special character (!@#$%^&*)'
        return ''
      
      case 'heightCm':
        if (value && (value < 50 || value > 300)) return 'Height must be between 50 and 300 cm'
        return ''
      
      case 'weightKg':
        if (value && (value < 10 || value > 500)) return 'Weight must be between 10 and 500 kg'
        return ''
      
      case 'age':
        if (value && (value < 1 || value > 150)) return 'Age must be between 1 and 150'
        return ''
      
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validate on change
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    
    // Validate all required fields
    const newErrors = {}
    newErrors.username = validateField('username', formData.username)
    newErrors.email = validateField('email', formData.email)
    newErrors.password = validateField('password', formData.password)
    
    // Validate optional fields if they have values
    if (formData.heightCm) newErrors.heightCm = validateField('heightCm', formData.heightCm)
    if (formData.weightKg) newErrors.weightKg = validateField('weightKg', formData.weightKg)
    if (formData.age) newErrors.age = validateField('age', formData.age)
    
    setErrors(newErrors)
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '')
    if (hasErrors) {
      return
    }
    
    setLoading(true)

    try {
      const response = await authService.register(formData)
      setAuth(response.user, response.token)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration error:', err)
      console.error('Error response:', err.response?.data)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed'
      setApiError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-3 rounded-xl">
              <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AyurMitra</h1>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                  errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                  errors.heightCm ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.heightCm && <p className="text-red-600 text-xs mt-1">{errors.heightCm}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                  errors.weightKg ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.weightKg && <p className="text-red-600 text-xs mt-1">{errors.weightKg}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                  errors.age ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.age && <p className="text-red-600 text-xs mt-1">{errors.age}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
