import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useAuthStore } from '../../../store/authStore'
import { wellnessService } from '../../../api/wellnessService'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
import { CircularProgress } from '../../../components/ui/ProgressBar'
import ProgressBar from '../../../components/ui/ProgressBar'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Grid from '../../../components/ui/Grid'

export default function DashboardImproved() {
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
      await initializeDefaultData()
    } finally {
      setLoading(false)
    }
  }

  const initializeDefaultData = async () => {
    try {
      await wellnessService.initializeDefaultRituals()
      await wellnessService.initializeDefaultHerbs()
      const stats = await wellnessService.getDashboardStats()
      setDashboardStats(stats)
    } catch (err) {
      console.error('Failed to initialize default data:', err)
    }
  }

  const handleRitualComplete = async (ritualId) => {
    try {
      await wellnessService.completeRitual(ritualId)
      await fetchDashboardData()
    } catch (err) {
      console.error('Failed to complete ritual:', err)
    }
  }

  const handleRitualSkip = async (ritualId) => {
    try {
      await wellnessService.skipRitual(ritualId)
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
            <Button onClick={fetchDashboardData}>Retry</Button>
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
      {/* Welcome Section */}
      <section className="mb-8">
        <Card variant="primary" size="lg" className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-surface/20 to-transparent"></div>
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <Badge variant="success" size="sm" className="mb-3 bg-surface/20 text-surface">
                Daily Affirmation
              </Badge>
              <h2 className="font-headline text-3xl text-surface leading-tight mb-3">
                Namaste, {user?.firstName || user?.username}.
              </h2>
              <p className="text-surface/90 text-lg max-w-md">
                {personalizedMessage}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-surface/20 rounded-xl p-4">
                <p className="text-xs uppercase font-bold tracking-widest text-surface mb-1">Today</p>
                <p className="text-2xl font-serif text-surface">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Stats Grid - Uniform Heights */}
      <section className="mb-8">
        <Grid cols={4} gap={6}>
          {/* Health Score */}
          <Card variant="high" size="md" className="flex flex-col items-center text-center h-64">
            <CardHeader>
              <span className="font-label text-xs uppercase tracking-widest text-secondary">
                Vitality Score
              </span>
            </CardHeader>
            <div className="flex-1 flex items-center justify-center">
              <CircularProgress 
                value={Math.round(vitalityScore)} 
                max={100}
                size={120}
                strokeWidth={8}
                className="text-primary"
              />
            </div>
            <p className="text-sm font-medium text-primary mt-4">
              Excellent Balance
            </p>
          </Card>

          {/* Dosha Balance */}
          <Card variant="low" size="md" className="h-64 flex flex-col">
            <CardHeader>
              <CardTitle icon="water_drop" size="sm">Dosha Balance</CardTitle>
              <Badge variant="primary" size="sm">{doshaBalance.dominantDosha} Dominant</Badge>
            </CardHeader>
            <div className="flex-1 space-y-4">
              <ProgressBar 
                label="Vata" 
                value={doshaBalance.vataPercentage} 
                variant="secondary"
                size="sm"
              />
              <ProgressBar 
                label="Pitta" 
                value={doshaBalance.pittaPercentage} 
                variant="primary"
                size="sm"
              />
              <ProgressBar 
                label="Kapha" 
                value={doshaBalance.kaphaPercentage} 
                variant="botanical"
                size="sm"
              />
            </div>
            <div className="text-xs text-secondary opacity-80 mt-4">
              Analysis from {new Date().toLocaleDateString()}
            </div>
          </Card>

          {/* Ritual Progress */}
          <Card variant="default" size="md" className="h-64 flex flex-col">
            <CardHeader>
              <CardTitle icon="task_alt" size="sm">Today's Rituals</CardTitle>
              <Badge variant="tertiary" size="sm">
                {ritualStats.completedToday} / {ritualStats.totalToday}
              </Badge>
            </CardHeader>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.round(ritualStats.completionPercentage)}%
                </div>
                <p className="text-sm text-secondary">Completion Rate</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/rituals')}
              className="mt-4"
            >
              View All Rituals
            </Button>
          </Card>

          {/* Herb of the Day */}
          <Card variant="secondary" size="md" className="h-64 flex flex-col">
            <CardHeader>
              <CardTitle icon="eco" size="sm">Herb of the Day</CardTitle>
            </CardHeader>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-headline text-2xl text-primary mb-2">{herbOfTheDay.name}</h3>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                "{herbOfTheDay.description}"
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/herbs')}
              className="mt-4"
            >
              Explore Library
            </Button>
          </Card>
        </Grid>
      </section>

      {/* Main Content Grid */}
      <section>
        <Grid cols={3} gap={6}>
          {/* Daily Rituals - Spans 2 columns */}
          <div className="col-span-2">
            <Card variant="low" size="lg" className="h-96">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle icon="self_improvement" size="lg">Daily Rituals</CardTitle>
                  <Badge variant="tertiary">
                    {ritualStats.completedToday} / {ritualStats.totalToday} Completed
                  </Badge>
                </div>
              </CardHeader>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {todayRituals.map((ritual, index) => (
                  <div 
                    key={ritual.id || index}
                    className={`
                      flex items-center p-4 bg-surface rounded-xl hover:shadow-md transition-all duration-300 group
                      ${ritual.isSkipped ? 'opacity-60' : ''}
                    `}
                  >
                    <button
                      onClick={() => ritual.isCompleted ? null : handleRitualComplete(ritual.id)}
                      className={`
                        material-symbols-outlined text-xl mr-4
                        ${ritual.isCompleted ? 'text-tertiary' : 'text-primary/40 hover:text-primary'}
                        ${ritual.isCompleted ? '' : 'cursor-pointer'}
                      `}
                      style={ritual.isCompleted ? { fontVariationSettings: "'FILL' 1" } : {}}
                      disabled={ritual.isCompleted}
                    >
                      {ritual.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                    </button>
                    
                    <div className="flex-1">
                      <p className={`text-sm font-semibold text-primary ${ritual.isSkipped ? 'line-through' : ''}`}>
                        {ritual.name}
                      </p>
                      {ritual.description && (
                        <p className="text-xs text-secondary opacity-80">
                          {ritual.description}
                        </p>
                      )}
                    </div>
                    
                    {ritual.scheduledTime && (
                      <span className="text-xs font-medium text-secondary opacity-60 mr-3">
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
                        className="text-xs text-secondary/60 hover:text-secondary px-2 py-1 rounded"
                      >
                        Skip
                      </button>
                    )}
                  </div>
                ))}
                
                {todayRituals.length === 0 && (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-primary/20 text-4xl mb-3 block">
                      self_improvement
                    </span>
                    <p className="text-secondary opacity-60 mb-4">No rituals for today</p>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={initializeDefaultData}
                    >
                      Initialize Default Rituals
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Actions & Insights */}
          <div className="space-y-6">
            {/* Quick Consultation */}
            <Card variant="primary" size="md">
              <CardHeader>
                <span className="material-symbols-outlined text-surface text-2xl mb-3 block">videocam</span>
                <h3 className="font-headline text-lg text-surface font-semibold mb-2">
                  Quick Consultation
                </h3>
                <p className="text-surface/80 text-sm">
                  Get instant Ayurvedic guidance for your symptoms.
                </p>
              </CardHeader>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/consultation')}
                className="mt-4 border-surface/20 text-surface hover:bg-surface hover:text-primary"
              >
                Start Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </Button>
            </Card>

            {/* Wellness Insight */}
            <Card variant="default" size="md">
              <CardHeader>
                <span className="material-symbols-outlined text-primary text-2xl mb-3 block">lightbulb</span>
                <h3 className="font-headline text-lg text-primary font-semibold mb-2">
                  Today's Insight
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {seasonalAdvice}
                </p>
              </CardHeader>
              <div className="mt-4 pt-4 border-t border-primary/10">
                <p className="text-xs text-secondary uppercase tracking-wider">
                  Personalized for your {doshaBalance.dominantDosha} constitution
                </p>
              </div>
            </Card>
          </div>
        </Grid>
      </section>
    </MainLayout>
  )
}