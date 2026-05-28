import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useAuthStore } from '../../../store/authStore'
import { wellnessService } from '../../../api/wellnessService'
import { Card } from '../../../components/ui/Card'
import { CircularProgress } from '../../../components/ui/ProgressBar'
import ProgressBar from '../../../components/ui/ProgressBar'
import Badge from '../../../components/ui/Badge'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const stats = await wellnessService.getDashboardStats()
      setDashboardStats(stats)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
      setError('Failed to load dashboard data')
      // Initialize default data on error
      await initializeDefaultData()
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultData = async () => {
    try {
      await wellnessService.initializeDefaultRituals()
      await wellnessService.initializeDefaultHerbs()
      // Retry fetching data
      const stats = await wellnessService.getDashboardStats()
      setDashboardStats(stats)
    } catch (err) {
      console.error('Failed to initialize default data:', err)
    }
  }

  const handleRitualComplete = async (ritualId) => {
    try {
      await wellnessService.completeRitual(ritualId)
      // Refresh dashboard data
      await fetchDashboardData()
    } catch (err) {
      console.error('Failed to complete ritual:', err)
    }
  }

  const handleRitualSkip = async (ritualId) => {
    try {
      await wellnessService.skipRitual(ritualId)
      // Refresh dashboard data
      await fetchDashboardData()
    } catch (err) {
      console.error('Failed to skip ritual:', err)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-secondary">Loading your wellness dashboard...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error && !dashboardStats) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-primary text-surface rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const {
    vitalityScore = 84,
    doshaBalance = { vataPercentage: 25, pittaPercentage: 60, kaphaPercentage: 15, dominantDosha: 'PITTA' },
    ritualStats = { completedToday: 0, totalToday: 0, completionPercentage: 0 },
    herbOfTheDay = { name: 'Brahmi', description: 'The herb of grace.' },
    todayRituals = [],
    personalizedMessage = 'Your balance is our focus.',
    seasonalAdvice = 'Focus on maintaining balance through mindful practices.'
  } = dashboardStats || {}

  return (
    <MainLayout>
      {/* Welcome Hero Section - Asymmetric */}
      <section className="grid grid-cols-12 gap-8 mb-12">
        {/* Hero Card with Gradient */}
        <div className="col-span-12 lg:col-span-8 relative rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-end p-12 bg-gradient-primary group">
          {/* Decorative overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-lg">
            <Badge variant="success" size="sm" className="mb-4">
              Daily Affirmation
            </Badge>
            
            <h2 className="font-headline text-5xl text-surface leading-tight mb-4 italic">
              Namaste, {user?.firstName || user?.username}.<br/>
              {personalizedMessage}
            </h2>
            
            <p className="text-primary-fixed-dim text-lg max-w-md">
              {seasonalAdvice}
            </p>
          </div>
        </div>

        {/* Herb of the Day - Editorial Spotlight */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between border-l-4 border-tertiary">
          <div>
            <span className="font-label text-[10px] uppercase tracking-widest-plus text-secondary opacity-60">
              Herb of the Day
            </span>
            <h3 className="font-headline text-3xl text-primary mt-2">{herbOfTheDay.name}</h3>
            <p className="text-on-surface-variant text-sm mt-4 leading-relaxed italic">
              "{herbOfTheDay.description}"
            </p>
          </div>
          
          <div className="mt-8">
            <button 
              onClick={() => navigate('/remedies')}
              className="text-xs font-bold uppercase tracking-widest text-primary flex items-center hover:translate-x-2 transition-transform ease-calm"
            >
              Explore Herb Library
              <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bento Grid Stats Section */}
      <section className="grid grid-cols-12 gap-8 mb-12">
        {/* Health Score Circular Progress */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-highest rounded-2xl p-8 flex flex-col items-center text-center">
          <CircularProgress 
            value={Math.round(vitalityScore)} 
            max={100}
            label="Vitality Quotient"
            size={192}
            strokeWidth={12}
          />
          <p className="mt-8 text-sm font-medium text-primary">
            {personalizedMessage}
          </p>
        </div>

        {/* Dosha Balance Bars */}
        <div className="col-span-12 md:col-span-5 bg-surface-container rounded-2xl p-8 flex flex-col">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                Dosha Constitution
              </span>
              <h3 className="font-headline text-2xl text-primary mt-1">{doshaBalance.dominantDosha} Dominant</h3>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
          </div>

          <div className="space-y-6">
            <ProgressBar 
              label="Vata" 
              value={doshaBalance.vataPercentage} 
              variant="secondary"
            />
            <ProgressBar 
              label="Pitta" 
              value={doshaBalance.pittaPercentage} 
              variant="primary"
            />
            <ProgressBar 
              label="Kapha" 
              value={doshaBalance.kaphaPercentage} 
              variant="botanical"
            />
          </div>

          <div className="mt-auto pt-6 text-[11px] leading-relaxed text-secondary opacity-80 border-t border-primary/5 italic">
            Analysis based on sleep patterns and tongue diagnostic from {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
          </div>
        </div>

        {/* Upcoming Consultation Reminders */}
        <div className="col-span-12 md:col-span-3 space-y-8">
          <Card variant="primary" className="shadow-ambient-lg">
            <span className="material-symbols-outlined mb-4 text-surface">calendar_today</span>
            <h4 className="font-bold text-lg mb-1 text-surface">Follow-up</h4>
            <p className="text-sm opacity-80 mb-6 text-surface">
              With Dr. Ananya V. regarding metabolic flora.
            </p>
            <div className="bg-surface/10 rounded-lg p-4">
              <p className="text-xs uppercase font-bold tracking-widest text-surface">Tomorrow</p>
              <p className="text-2xl font-serif text-surface">09:30 AM</p>
            </div>
          </Card>

          <Card variant="low" className="border border-primary/5">
            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-4">
              Quick Action
            </p>
            <button 
              onClick={() => navigate('/consultation')}
              className="flex items-center w-full group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors ease-calm">
                <span className="material-symbols-outlined text-sm">videocam</span>
              </div>
              <span className="ml-3 text-sm font-bold text-primary">Start Consultation</span>
            </button>
          </Card>
        </div>
      </section>

      {/* Rituals & Habits Section */}
      <section className="grid grid-cols-12 gap-8">
        {/* Daily Rituals */}
        <div className="col-span-12 md:col-span-7 bg-surface-container-lowest rounded-2xl p-10 border border-primary/5">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline text-2xl text-primary">Daily Rituals</h3>
            <Badge variant="tertiary">
              {ritualStats.completedToday} / {ritualStats.totalToday} Completed
            </Badge>
          </div>

          <div className="space-y-4">
            {todayRituals.map((ritual, index) => (
              <div 
                key={ritual.id || index}
                className={`
                  flex items-center p-4 bg-surface rounded-xl hover:translate-x-2 transition-transform ease-calm cursor-pointer group
                  ${ritual.isSkipped ? 'opacity-60' : ''}
                `}
              >
                <button
                  onClick={() => ritual.isCompleted ? null : handleRitualComplete(ritual.id)}
                  className={`
                    material-symbols-outlined 
                    ${ritual.isCompleted ? 'text-tertiary' : 'text-primary/20 hover:text-primary'}
                    ${ritual.isCompleted ? '' : 'cursor-pointer'}
                  `}
                  style={ritual.isCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}
                  disabled={ritual.isCompleted}
                >
                  {ritual.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                </button>
                
                <div className="ml-4 flex-1">
                  <p className={`text-sm font-bold text-primary ${ritual.isSkipped ? 'line-through' : ''}`}>
                    {ritual.name}
                  </p>
                  {ritual.description && (
                    <p className="text-[10px] text-secondary opacity-60">
                      {ritual.description}
                    </p>
                  )}
                </div>
                
                {ritual.scheduledTime && (
                  <span className="text-[10px] font-bold text-secondary opacity-40">
                    {new Date(`2000-01-01T${ritual.scheduledTime}`).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </span>
                )}

                {!ritual.isCompleted && !ritual.isSkipped && (
                  <button
                    onClick={() => handleRitualSkip(ritual.id)}
                    className="ml-2 text-xs text-secondary/60 hover:text-secondary"
                  >
                    Skip
                  </button>
                )}
              </div>
            ))}
            
            {todayRituals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-secondary opacity-60 mb-4">No rituals for today</p>
                <button 
                  onClick={initializeDefaultData}
                  className="text-xs font-bold uppercase tracking-widest text-primary hover:translate-x-2 transition-transform ease-calm"
                >
                  Initialize Default Rituals
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contextual Insight Card */}
        <div className="col-span-12 md:col-span-5 bg-secondary-container/30 rounded-2xl p-10 flex flex-col relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl"></div>
          
          <span className="material-symbols-outlined text-secondary text-4xl mb-6">lightbulb</span>
          
          <h3 className="font-headline text-2xl text-secondary mb-4 leading-snug">
            The wisdom of balance.
          </h3>
          
          <p className="text-secondary opacity-80 text-sm leading-relaxed mb-8">
            {seasonalAdvice}
          </p>
          
          <div className="mt-auto">
            <button className="text-xs font-bold uppercase tracking-widest text-primary flex items-center hover:translate-x-2 transition-transform ease-calm">
              Explore Full Dietary Guide
              <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
