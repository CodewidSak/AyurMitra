import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useAuthStore } from '../../../store/authStore'
import { wellnessService } from '../../../api/wellnessService'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'

export default function DashboardProfessional() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateRitual, setShowCreateRitual] = useState(false)
  const [showAllRituals, setShowAllRituals] = useState(false)
  const [newRitual, setNewRitual] = useState({
    name: '',
    description: '',
    scheduledTime: '',
    category: 'MORNING'
  })

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

  const handleCreateRitual = async (e) => {
    e.preventDefault()
    try {
      await wellnessService.createRitual(newRitual)
      setNewRitual({ name: '', description: '', scheduledTime: '', category: 'MORNING' })
      setShowCreateRitual(false)
      await fetchDashboardData()
    } catch (err) {
      console.error('Failed to create ritual:', err)
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
    <MainLayout breadcrumb={{ section: 'Wellness Hub', page: 'Clinical Dashboard' }}>
      <div className="space-y-12">
        {/* Welcome Hero Asymmetric Section */}
        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 relative rounded-2xl overflow-hidden min-h-[320px] flex flex-col justify-end p-12 bg-gradient-to-br from-primary to-primary-container group">
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/10"></div>
            </div>
            <div className="relative z-10 max-w-lg">
              <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                Daily Affirmation
              </span>
              <h2 className="font-headline text-5xl text-surface leading-tight mb-4 italic">
                Namaste, {user?.firstName || user?.username}.<br/>
                Your balance is our focus.
              </h2>
              <p className="text-primary-fixed-dim text-lg max-w-md">
                {personalizedMessage}
              </p>
            </div>
          </div>

          {/* Herb of the Day - Editorial Spotlight */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-low rounded-2xl p-8 flex flex-col justify-between border-l-4 border-tertiary">
            <div>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary opacity-60">
                Herb of the Day
              </span>
              <h3 className="font-headline text-3xl text-primary mt-2">{herbOfTheDay.name}</h3>
              <p className="text-on-surface-variant text-sm mt-4 leading-relaxed italic">
                "{herbOfTheDay.description}"
              </p>
            </div>
            <div className="mt-8 relative h-40 w-full rounded-xl overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-6xl opacity-30">local_florist</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
              <button 
                onClick={() => navigate('/herbs')}
                className="absolute bottom-4 right-4 bg-surface-container-lowest/90 backdrop-blur text-primary p-2 rounded-full flex items-center justify-center hover:bg-surface transition-colors shadow-lg"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Stats Section */}
        <section className="grid grid-cols-12 gap-8">
          {/* Health Score Circular Progress */}
          <div className="col-span-12 md:col-span-4 bg-surface-container-highest rounded-2xl p-8 flex flex-col items-center text-center">
            <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-8">
              Vitality Quotient
            </span>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  className="text-primary/10" 
                  cx="96" 
                  cy="96" 
                  fill="transparent" 
                  r="88" 
                  stroke="currentColor" 
                  strokeWidth="12"
                />
                <circle 
                  className="text-tertiary" 
                  cx="96" 
                  cy="96" 
                  fill="transparent" 
                  r="88" 
                  stroke="currentColor" 
                  strokeDasharray="552.92" 
                  strokeDashoffset={552.92 - (552.92 * vitalityScore) / 100}
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-bold text-primary">{Math.round(vitalityScore)}</span>
                <span className="text-[10px] uppercase font-bold text-secondary opacity-60">/ 100</span>
              </div>
            </div>
            <p className="mt-8 text-sm font-medium text-primary">
              Excellent alignment. Your circadian rhythm is stabilizing.
            </p>
          </div>

          {/* Dosha Balance Bars */}
          <div className="col-span-12 md:col-span-5 bg-surface-container rounded-2xl p-8 flex flex-col">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                  Dosha Constitution
                </span>
                <h3 className="font-headline text-2xl text-primary mt-1">
                  {doshaBalance.dominantDosha} Dominant
                </h3>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-tighter mb-2">
                  <span>Vata</span>
                  <span>{doshaBalance.vataPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary-fixed-dim transition-all duration-1000" 
                    style={{ width: `${doshaBalance.vataPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-tighter mb-2">
                  <span>Pitta</span>
                  <span>{doshaBalance.pittaPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${doshaBalance.pittaPercentage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-tighter mb-2">
                  <span>Kapha</span>
                  <span>{doshaBalance.kaphaPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-tertiary transition-all duration-1000" 
                    style={{ width: `${doshaBalance.kaphaPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-auto pt-6 text-[11px] leading-relaxed text-secondary opacity-80 border-t border-primary/5 italic">
              Analysis based on sleep patterns and diagnostic from {new Date().toLocaleDateString()}.
            </div>
          </div>

          {/* Upcoming Consultation Reminders */}
          <div className="col-span-12 md:col-span-3 space-y-8">
            <div className="bg-primary text-surface p-8 rounded-2xl shadow-xl">
              <span className="material-symbols-outlined mb-4">calendar_today</span>
              <h4 className="font-bold text-lg mb-1">Quick Consultation</h4>
              <p className="text-sm opacity-80 mb-6">Get instant AI-powered Ayurvedic guidance.</p>
              <button 
                onClick={() => navigate('/consultation')}
                className="bg-surface/10 rounded-lg p-4 w-full text-left hover:bg-surface/20 transition-colors"
              >
                <p className="text-xs uppercase font-bold tracking-widest">Available Now</p>
                <p className="text-2xl font-serif">Start Session</p>
              </button>
            </div>
            <div className="bg-surface-container-low p-6 rounded-2xl border border-primary/5">
              <p className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-4">
                Past Analysis
              </p>
              <button 
                onClick={() => navigate('/consultation')}
                className="flex items-center w-full group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-surface transition-colors">
                  <span className="material-symbols-outlined text-sm">history</span>
                </div>
                <span className="ml-3 text-sm font-bold text-primary">View Results</span>
              </button>
            </div>
          </div>
        </section>

        {/* Rituals & Habits Section */}
        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-7 bg-surface-container-lowest rounded-2xl p-10 border border-primary/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-2xl text-primary">Daily Rituals</h3>
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-tertiary bg-tertiary/10 px-3 py-1 rounded-full">
                  {ritualStats.completedToday} / {ritualStats.totalToday} Completed
                </span>
                <button
                  onClick={() => setShowCreateRitual(true)}
                  className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full hover:bg-primary hover:text-surface transition-colors"
                >
                  + Add Ritual
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(showAllRituals ? todayRituals : todayRituals.slice(0, 4)).map((ritual, index) => (
                <div 
                  key={ritual.id || index}
                  className={`
                    flex items-center p-4 bg-surface rounded-xl hover:translate-x-2 transition-transform cursor-pointer group
                    ${ritual.isCompleted ? 'opacity-100' : ''}
                    ${ritual.isSkipped ? 'opacity-60' : ''}
                  `}
                >
                  <button
                    onClick={() => ritual.isCompleted ? null : handleRitualComplete(ritual.id)}
                    className={`
                      material-symbols-outlined transition-all duration-300
                      ${ritual.isCompleted ? 'text-tertiary' : 'text-primary/20 hover:text-primary'}
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
                      className="ml-4 text-xs text-secondary/60 hover:text-secondary px-2 py-1 rounded"
                    >
                      Skip
                    </button>
                  )}
                </div>
              ))}

              {todayRituals.length === 0 && (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-primary/20 text-6xl mb-4 block">
                    self_improvement
                  </span>
                  <h4 className="font-headline text-xl text-primary mb-2">No rituals for today</h4>
                  <p className="text-secondary opacity-60 mb-6">Start building your wellness routine</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => setShowCreateRitual(true)}
                      className="bg-primary text-surface px-4 py-2 rounded-lg font-medium hover:bg-primary-container transition-colors"
                    >
                      Create Ritual
                    </button>
                    <button
                      onClick={initializeDefaultData}
                      className="bg-surface-container text-primary px-4 py-2 rounded-lg font-medium hover:bg-surface-container-high transition-colors"
                    >
                      Load Defaults
                    </button>
                  </div>
                </div>
              )}

              {todayRituals.length > 4 && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setShowAllRituals(!showAllRituals)}
                    className="text-xs font-bold uppercase tracking-widest text-primary flex items-center mx-auto hover:translate-x-2 transition-transform"
                  >
                    {showAllRituals ? 'Show Less' : `Show ${todayRituals.length - 4} More`}
                    <span className="material-symbols-outlined ml-2 text-sm">
                      {showAllRituals ? 'expand_less' : 'expand_more'}
                    </span>
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
              <button 
                onClick={() => navigate('/herbs')}
                className="text-xs font-bold uppercase tracking-widest text-primary flex items-center hover:translate-x-2 transition-transform"
              >
                Explore Full Dietary Guide
                <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Create Ritual Modal */}
        {showCreateRitual && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-md border border-primary/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline text-xl text-primary font-semibold">Create New Ritual</h3>
                <button
                  onClick={() => setShowCreateRitual(false)}
                  className="material-symbols-outlined text-secondary hover:text-primary p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  close
                </button>
              </div>
              
              <form onSubmit={handleCreateRitual} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                    Ritual Name
                  </label>
                  <input
                    type="text"
                    value={newRitual.name}
                    onChange={(e) => setNewRitual({ ...newRitual, name: e.target.value })}
                    className="w-full p-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
                    placeholder="e.g., Morning Meditation"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRitual.description}
                    onChange={(e) => setNewRitual({ ...newRitual, description: e.target.value })}
                    className="w-full p-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
                    placeholder="Brief description of the ritual"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newRitual.scheduledTime}
                      onChange={(e) => setNewRitual({ ...newRitual, scheduledTime: e.target.value })}
                      className="w-full p-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">
                      Category
                    </label>
                    <select
                      value={newRitual.category}
                      onChange={(e) => setNewRitual({ ...newRitual, category: e.target.value })}
                      className="w-full p-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface"
                    >
                      <option value="MORNING">Morning</option>
                      <option value="AFTERNOON">Afternoon</option>
                      <option value="EVENING">Evening</option>
                      <option value="NIGHT">Night</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateRitual(false)}
                    className="flex-1 bg-surface-container text-primary py-3 rounded-lg font-medium hover:bg-surface-container-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-surface py-3 rounded-lg font-medium hover:bg-primary-container transition-colors shadow-[0px_12px_32px_rgba(15,82,56,0.08)]"
                  >
                    Create Ritual
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}