import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../api/authService'
import { medicalService } from '../../../api/medicalService'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    heightCm: user?.heightCm || '',
    weightKg: user?.weightKg || '',
    age: user?.age || '',
    gender: user?.gender || 'Male'
  })
  const [conditions, setConditions] = useState([])
  const [newCondition, setNewCondition] = useState({
    conditionName: '',
    severity: 'Mild',
    description: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchConditions()
  }, [])

  const fetchConditions = async () => {
    try {
      const data = await medicalService.getConditions()
      setConditions(data)
    } catch (err) {
      console.error('Failed to fetch conditions:', err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleConditionChange = (e) => {
    const { name, value } = e.target
    setNewCondition(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await authService.updateProfile(formData)
      updateUser(response)
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCondition = async (e) => {
    e.preventDefault()
    if (!newCondition.conditionName) {
      setError('Please enter a condition name')
      return
    }

    try {
      await medicalService.addCondition(newCondition)
      setNewCondition({ conditionName: '', severity: 'Mild', description: '' })
      setMessage('Condition added successfully!')
      fetchConditions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add condition')
    }
  }

  const handleDeleteCondition = async (id) => {
    try {
      await medicalService.deleteCondition(id)
      fetchConditions()
      setMessage('Condition deleted successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete condition')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">My Profile</h1>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ayur-600 hover:bg-ayur-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Medical Conditions */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Medical Conditions</h2>

            {/* Add Condition Form */}
            <form onSubmit={handleAddCondition} className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Condition</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition Name</label>
                  <input
                    type="text"
                    name="conditionName"
                    value={newCondition.conditionName}
                    onChange={handleConditionChange}
                    placeholder="e.g., Diabetes, Hypertension"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      name="severity"
                      value={newCondition.severity}
                      onChange={handleConditionChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                    >
                      <option>Mild</option>
                      <option>Moderate</option>
                      <option>Severe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={newCondition.description}
                    onChange={handleConditionChange}
                    placeholder="Additional details..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-ayur-600 hover:bg-ayur-700 text-white font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Condition
                </button>
              </div>
            </form>

            {/* Conditions List */}
            <div className="space-y-4">
              {conditions.length > 0 ? (
                conditions.map((condition) => (
                  <motion.div
                    key={condition.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="border-l-4 border-ayur-600 bg-ayur-50 p-4 rounded flex justify-between items-start"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{condition.conditionName}</h3>
                      <p className="text-sm text-gray-600">Severity: {condition.severity}</p>
                      {condition.description && (
                        <p className="text-sm text-gray-700 mt-2">{condition.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteCondition(condition.id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-600">No conditions recorded</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
