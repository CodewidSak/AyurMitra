/**
 * Validation utilities for form fields
 */

export const validators = {
  // Username validation
  username: (value) => {
    if (!value) return 'Username is required'
    if (value.length < 3) return 'Username must be at least 3 characters'
    if (value.length > 20) return 'Username must not exceed 20 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores'
    }
    return ''
  },

  // Email validation
  email: (value) => {
    if (!value) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email address'
    return ''
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required'
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter'
    if (!/[0-9]/.test(value)) return 'Password must contain at least one number'
    if (!/[!@#$%^&*]/.test(value)) {
      return 'Password must contain at least one special character (!@#$%^&*)'
    }
    return ''
  },

  // Password confirmation
  passwordConfirm: (value, password) => {
    if (!value) return 'Please confirm your password'
    if (value !== password) return 'Passwords do not match'
    return ''
  },

  // Name validation
  name: (value, fieldName = 'Name') => {
    if (value && value.length > 50) {
      return `${fieldName} must not exceed 50 characters`
    }
    return ''
  },

  // Height validation (cm)
  height: (value) => {
    if (value) {
      const num = parseFloat(value)
      if (isNaN(num)) return 'Height must be a valid number'
      if (num < 50) return 'Height must be at least 50 cm'
      if (num > 300) return 'Height must not exceed 300 cm'
    }
    return ''
  },

  // Weight validation (kg)
  weight: (value) => {
    if (value) {
      const num = parseFloat(value)
      if (isNaN(num)) return 'Weight must be a valid number'
      if (num < 10) return 'Weight must be at least 10 kg'
      if (num > 500) return 'Weight must not exceed 500 kg'
    }
    return ''
  },

  // Age validation
  age: (value) => {
    if (value) {
      const num = parseInt(value)
      if (isNaN(num)) return 'Age must be a valid number'
      if (num < 1) return 'Age must be at least 1'
      if (num > 150) return 'Age must not exceed 150'
    }
    return ''
  },

  // Condition name validation
  conditionName: (value) => {
    if (!value) return 'Condition name is required'
    if (value.length < 2) return 'Condition name must be at least 2 characters'
    if (value.length > 100) return 'Condition name must not exceed 100 characters'
    return ''
  },

  // Severity validation
  severity: (value) => {
    if (!value) return 'Severity is required'
    if (!['Mild', 'Moderate', 'Severe'].includes(value)) {
      return 'Severity must be Mild, Moderate, or Severe'
    }
    return ''
  },

  // Description validation
  description: (value) => {
    if (value && value.length > 500) {
      return 'Description must not exceed 500 characters'
    }
    return ''
  },

  // Body part validation
  bodyPart: (value) => {
    if (!value) return 'Please select a body part'
    return ''
  },

  // Symptoms validation
  symptoms: (symptoms) => {
    if (!symptoms || symptoms.length === 0) {
      return 'Please select at least one symptom'
    }
    if (symptoms.length > 10) {
      return 'You can select a maximum of 10 symptoms'
    }
    return ''
  },

  // Symptom text validation
  symptomText: (value) => {
    if (!value) return 'Symptom cannot be empty'
    if (value.length < 2) return 'Symptom must be at least 2 characters'
    if (value.length > 50) return 'Symptom must not exceed 50 characters'
    return ''
  },
}

/**
 * Validate entire form object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {}
  
  Object.keys(validationRules).forEach((field) => {
    const rule = validationRules[field]
    const value = formData[field]
    
    if (typeof rule === 'function') {
      const error = rule(value, formData)
      if (error) errors[field] = error
    }
  })
  
  return errors
}

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0
}

/**
 * Get password strength indicator
 */
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'No password', color: 'gray' }
  
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[!@#$%^&*]/.test(password)) strength++
  
  const levels = [
    { strength: 0, label: 'No password', color: 'gray' },
    { strength: 1, label: 'Weak', color: 'red' },
    { strength: 2, label: 'Fair', color: 'orange' },
    { strength: 3, label: 'Good', color: 'yellow' },
    { strength: 4, label: 'Strong', color: 'lime' },
    { strength: 5, label: 'Very Strong', color: 'green' },
  ]
  
  return levels[strength]
}
