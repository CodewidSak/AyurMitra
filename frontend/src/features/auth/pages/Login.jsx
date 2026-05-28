import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../api/authService'
import { motion } from 'framer-motion'
import { validators, validateForm, hasErrors } from '../../../utils/validation'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const validationRules = {
    username: validators.username,
    password: (value) => {
      if (!value) return 'Password is required'
      if (value.length < 6) return 'Password must be at least 6 characters'
      return ''
    },
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Real-time validation
    if (touched[name]) {
      const error = validationRules[name](value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validationRules[name](formData[name])
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    
    // Validate all fields
    const newErrors = validateForm(formData, validationRules)
    setErrors(newErrors)
    
    if (hasErrors(newErrors)) {
      return
    }
    
    setLoading(true)

    try {
      const response = await authService.login(formData)
      setAuth(response.user, response.token)
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Login failed'
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
        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-3 rounded-xl">
              <span className="text-3xl">🌿</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">AyurMitra</h1>
          </div>
          <p className="text-gray-600">Welcome back</p>
        </div>

        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3"
          >
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                  errors.username && touched.username
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your username"
              />
              {!errors.username && touched.username && formData.username && (
                <CheckCircle size={20} className="absolute right-3 top-3 text-green-500" />
              )}
            </div>
            {errors.username && touched.username && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-xs mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.username}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition ${
                  errors.password && touched.password
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your password"
              />
              {!errors.password && touched.password && formData.password && (
                <CheckCircle size={20} className="absolute right-3 top-3 text-green-500" />
              )}
            </div>
            {errors.password && touched.password && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-xs mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.password}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || hasErrors(errors)}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
