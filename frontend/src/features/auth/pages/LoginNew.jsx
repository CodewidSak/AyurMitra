import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../api/authService'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import { validators, validateForm, hasErrors } from '../../../utils/validation'

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
    
    if (touched[name]) {
      const error = validationRules[name](value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validationRules[name](formData[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    
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
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-primary relative overflow-hidden items-center justify-center p-12">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-surface rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-fixed rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <span className="material-symbols-outlined text-surface text-8xl mb-8 block">spa</span>
          <h1 className="font-headline text-6xl text-surface mb-6 italic leading-tight">
            AyurMitra
          </h1>
          <p className="font-label text-xs uppercase tracking-ultra-wide text-surface/80 mb-8">
            Clinical Wellness Platform
          </p>
          <p className="text-surface/90 text-lg leading-relaxed">
            Integrating ancient Ayurvedic wisdom with modern clinical precision for holistic health management.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <h1 className="font-headline text-4xl text-primary mb-2">AyurMitra</h1>
            <p className="font-label text-xs uppercase tracking-widest text-secondary">
              Clinical Wellness
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-10 border border-primary/5 shadow-ambient">
            <div className="mb-8">
              <h2 className="font-headline text-3xl text-primary mb-2">Welcome Back</h2>
              <p className="text-on-surface-variant text-sm">
                Sign in to continue your wellness journey
              </p>
            </div>

            {/* Error Message */}
            {apiError && (
              <div className="mb-6 p-4 bg-error-container/20 rounded-xl border-l-4 border-error">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-error text-xl">error</span>
                  <div>
                    <p className="text-sm font-bold text-on-error-container mb-1">Authentication Failed</p>
                    <p className="text-xs text-on-error-container/80">{apiError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.username ? errors.username : ''}
                placeholder="Enter your username"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : ''}
                placeholder="Enter your password"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/20"
                  />
                  <span className="text-on-surface-variant">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary hover:text-primary-container font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !formData.username || !formData.password}
                className="w-full"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-on-surface-variant">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary-container font-bold transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex justify-center gap-6">
            <Link
              to="/privacy"
              className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60 hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60 hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              to="/support"
              className="font-label text-[10px] uppercase tracking-widest text-secondary opacity-60 hover:text-primary transition-colors"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
