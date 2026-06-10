import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { useAuthStore } from '../../../store/authStore'
import { authService } from '../../../api/authService'
import { medicalService } from '../../../api/medicalService'

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('personal')
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
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCondition = async (e) => {
    e.preventDefault()
    if (!newCondition.conditionName) {
      setError('Please enter a condition name')
      setTimeout(() => setError(''), 3000)
      return
    }

    try {
      await medicalService.addCondition(newCondition)
      setNewCondition({ conditionName: '', severity: 'Mild', description: '' })
      setMessage('Condition added successfully!')
      setTimeout(() => setMessage(''), 3000)
      fetchConditions()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add condition')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleDeleteCondition = async (id) => {
    try {
      await medicalService.deleteCondition(id)
      fetchConditions()
      setMessage('Condition deleted successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete condition')
      setTimeout(() => setError(''), 3000)
    }
  }

  const calculateBMI = () => {
    if (formData.heightCm && formData.weightKg) {
      const heightM = formData.heightCm / 100
      const bmi = (formData.weightKg / (heightM * heightM)).toFixed(1)
      return bmi
    }
    return user?.bmi?.toFixed(1) || '--'
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'person' },
    { id: 'health', label: 'Health Records', icon: 'medical_services' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ]

  return (
    <MainLayout breadcrumb={{ section: 'User Profile', page: user?.firstName + ' ' + user?.lastName }}>
      {/* Hero Header with Stats */}
      <section className="mb-12">
        <Card variant="low" size="lg">
          <div className="flex items-start justify-between">
            {/* Profile Info */}
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-5xl">account_circle</span>
              </div>
              <div>
                <h1 className="font-headline text-4xl text-primary mb-2">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-on-surface-variant mb-4">{user?.email}</p>
                <div className="flex gap-2">
                  <Badge variant="success">Active Member</Badge>
                  <Badge variant="secondary">{user?.prakriti || 'Pitta'} Constitution</Badge>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-secondary mb-1">Age</p>
                <p className="text-2xl font-bold text-primary">{user?.age || formData.age || '--'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-secondary mb-1">BMI</p>
                <p className="text-2xl font-bold text-primary">{calculateBMI()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-secondary mb-1">Gender</p>
                <p className="text-2xl font-bold text-primary">{user?.gender || formData.gender}</p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Messages */}
      {message && (
        <div className="mb-6 p-4 bg-tertiary/10 border border-tertiary rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary">check_circle</span>
          <p className="text-tertiary font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined text-error">error</span>
          <p className="text-error font-medium">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 border-b border-primary/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-6 py-4 font-medium transition-all ease-calm
              border-b-2 -mb-px
              ${activeTab === tab.id
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-secondary hover:text-primary hover:bg-surface-container-low'
              }
            `}
          >
            <span className="material-symbols-outlined text-xl">{tab.icon}</span>
            <span className="font-label text-sm uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <Card variant="low">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">edit</span>
              <h2 className="font-headline text-2xl text-primary">Edit Personal Information</h2>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="heightCm"
                    value={formData.heightCm}
                    onChange={handleChange}
                    placeholder="170"
                    className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weightKg"
                    value={formData.weightKg}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all cursor-pointer"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  <span className="material-symbols-outlined">close</span>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Health Records Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Add Condition Card */}
            <Card variant="high">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">add_circle</span>
                <h3 className="font-headline text-2xl text-primary">Add Medical Condition</h3>
              </div>

              <form onSubmit={handleAddCondition} className="space-y-4">
                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                    Condition Name
                  </label>
                  <input
                    type="text"
                    name="conditionName"
                    value={newCondition.conditionName}
                    onChange={handleConditionChange}
                    placeholder="e.g., Diabetes, Hypertension, Asthma"
                    className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                      Severity
                    </label>
                    <select
                      name="severity"
                      value={newCondition.severity}
                      onChange={handleConditionChange}
                      className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all cursor-pointer"
                    >
                      <option>Mild</option>
                      <option>Moderate</option>
                      <option>Severe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-label text-xs uppercase tracking-wider text-secondary mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="description"
                    value={newCondition.description}
                    onChange={handleConditionChange}
                    placeholder="Any additional details about this condition..."
                    rows="3"
                    className="w-full px-4 py-3 bg-surface-container border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-primary transition-all resize-none"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full">
                  <span className="material-symbols-outlined">add</span>
                  Add Condition
                </Button>
              </form>
            </Card>

            {/* Conditions List */}
            <Card variant="low">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">medical_services</span>
                  <h3 className="font-headline text-2xl text-primary">My Medical Conditions</h3>
                </div>
                <Badge variant="secondary">{conditions.length} Recorded</Badge>
              </div>

              <div className="space-y-4">
                {conditions.length > 0 ? (
                  conditions.map((condition) => (
                    <div
                      key={condition.id}
                      className="border-l-4 border-primary bg-surface-container p-6 rounded-lg flex justify-between items-start hover:translate-x-1 transition-transform ease-calm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg text-primary">{condition.conditionName}</h4>
                          <Badge 
                            variant={condition.severity === 'Severe' ? 'error' : condition.severity === 'Moderate' ? 'warning' : 'success'}
                            size="sm"
                          >
                            {condition.severity}
                          </Badge>
                        </div>
                        {condition.description && (
                          <p className="text-sm text-on-surface-variant leading-relaxed">{condition.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteCondition(condition.id)}
                        className="text-error hover:text-error/80 transition-colors p-2 hover:bg-error/10 rounded-lg"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <span className="material-symbols-outlined text-primary/20 text-6xl mb-4 block">health_and_safety</span>
                    <p className="text-on-surface-variant">No medical conditions recorded</p>
                    <p className="text-sm text-secondary mt-2">Add your medical history to get personalized recommendations</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card variant="low">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">settings</span>
              <h2 className="font-headline text-2xl text-primary">Account Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                <div>
                  <h4 className="font-bold text-primary mb-1">Email Notifications</h4>
                  <p className="text-sm text-secondary">Receive updates about your consultations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                <div>
                  <h4 className="font-bold text-primary mb-1">Reminder Notifications</h4>
                  <p className="text-sm text-secondary">Get reminded about your daily rituals</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-surface-container-high peer-focus:ring-2 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="pt-6 mt-6 border-t border-primary/10">
                <h4 className="font-bold text-error mb-2">Danger Zone</h4>
                <p className="text-sm text-secondary mb-4">Permanently delete your account and all data</p>
                <Button variant="error">
                  <span className="material-symbols-outlined">delete_forever</span>
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
