import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../../components/Navbar'
import { useAuthStore } from '../../../store/authStore'
import { medicalService } from '../../../api/medicalService'
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Leaf, 
  User, 
  Sparkles,
  Calendar,
  FileText,
  Award
} from 'lucide-react'
import { motion } from 'framer-motion'
import StatCard from '../../../components/ui/StatCard'
import ActionCard from '../../../components/ui/ActionCard'
import { Card, CardContent, CardTitle } from '../../../components/ui/Card'
import HealthScore from '../components/HealthScore'
import DoshaBalance from '../components/DoshaBalance'
import RecentActivity from '../components/RecentActivity'
import HealthTips from '../components/HealthTips'
import UpcomingReminders from '../components/UpcomingReminders'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [conditions, setConditions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConditions()
  }, [])

  const fetchConditions = async () => {
    try {
      const data = await medicalService.getActiveConditions()
      setConditions(data)
    } catch (err) {
      console.error('Failed to fetch conditions:', err)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: 'BMI',
      value: user?.bmi?.toFixed(1) || 'N/A',
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-600',
      trend: 'up',
      trendValue: '2%'
    },
    {
      title: 'Prakriti',
      value: user?.prakriti || 'Pitta',
      icon: Leaf,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      title: 'Consultations',
      value: conditions.length,
      icon: Heart,
      gradient: 'from-teal-500 to-cyan-600'
    },
    {
      title: 'Age',
      value: user?.age || 'N/A',
      icon: Activity,
      gradient: 'from-lime-500 to-green-600'
    }
  ]

  const quickActions = [
    {
      title: 'Start Consultation',
      description: 'Get AI-powered Ayurvedic health analysis',
      icon: Activity,
      gradient: 'from-green-500 to-emerald-600',
      onClick: () => navigate('/consultation')
    },
    {
      title: 'Update Profile',
      description: 'Manage your health information',
      icon: User,
      gradient: 'from-teal-500 to-cyan-600',
      onClick: () => navigate('/profile')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-lime-400 to-green-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Modern Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <motion.div 
              className="relative"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-4 rounded-2xl shadow-2xl shadow-green-500/40">
                <Sparkles className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </motion.div>
            <div>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Welcome back, {user?.firstName || user?.username}
              </motion.h1>
              <motion.p 
                className="text-green-700 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                🌿 Here's your health overview for today
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid - Perfectly Aligned */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <ActionCard key={action.title} {...action} delay={0.4 + index * 0.1} />
              ))}
            </div>

            {/* Health Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <HealthScore score={78} />
            </motion.div>

            {/* Health Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <HealthTips />
            </motion.div>

            {/* Active Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card>
                <CardContent>
                  <CardTitle icon={Heart}>Active Medical Conditions</CardTitle>
                  
                  {loading ? (
                    <div className="flex items-center justify-center py-8 mt-6">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                  ) : conditions.length > 0 ? (
                    <div className="mt-6 space-y-3">
                      {conditions.map((condition, index) => (
                        <motion.div
                          key={condition.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-l-4 border-teal-500 bg-teal-50 p-4 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900">{condition.conditionName}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Severity: <span className="font-medium">{condition.severity}</span>
                              </p>
                              {condition.description && (
                                <p className="text-sm text-gray-700 mt-2">{condition.description}</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 mt-6">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="text-gray-400" size={24} />
                      </div>
                      <p className="text-gray-600">No active conditions recorded</p>
                      <p className="text-sm text-gray-500 mt-1">Start a consultation to track your health</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Dosha Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <DoshaBalance vata={30} pitta={45} kapha={25} />
            </motion.div>

            {/* Upcoming Reminders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <UpcomingReminders />
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <RecentActivity />
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Card>
                <CardContent>
                  <CardTitle icon={Award}>Achievements</CardTitle>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <Award className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">7 Day Streak</p>
                        <p className="text-xs text-gray-600">Daily health tracking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FileText className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">5 Consultations</p>
                        <p className="text-xs text-gray-600">This month</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Calendar className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">30 Days</p>
                        <p className="text-xs text-gray-600">Member since</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
