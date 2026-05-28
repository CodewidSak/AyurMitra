import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  Coffee, 
  Utensils, 
  Activity, 
  Heart,
  Brain,
  Droplets,
  Clock,
  CheckCircle
} from 'lucide-react'
import { BentoGrid, BentoItem, GlassCard, GlassButton } from '../../../components/ui/GlassCard'

const dinacharayaSchedule = [
  {
    time: '5:00 - 6:00 AM',
    period: 'Brahma Muhurta',
    icon: Sunrise,
    color: 'from-orange-400 to-pink-400',
    activities: [
      { name: 'Wake up naturally', icon: Brain, completed: false },
      { name: 'Meditation & Pranayama', icon: Heart, completed: false },
      { name: 'Gratitude practice', icon: Brain, completed: false }
    ],
    dosha: 'Vata',
    description: 'The most auspicious time for spiritual practices and setting daily intentions.'
  },
  {
    time: '6:00 - 8:00 AM',
    period: 'Morning Routine',
    icon: Sun,
    color: 'from-yellow-400 to-orange-400',
    activities: [
      { name: 'Oil pulling', icon: Droplets, completed: false },
      { name: 'Tongue scraping', icon: Activity, completed: false },
      { name: 'Warm water with lemon', icon: Droplets, completed: false },
      { name: 'Light exercise/Yoga', icon: Activity, completed: false }
    ],
    dosha: 'Kapha',
    description: 'Cleansing and energizing the body for the day ahead.'
  },
  {
    time: '8:00 - 10:00 AM',
    period: 'Breakfast Time',
    icon: Coffee,
    color: 'from-green-400 to-teal-400',
    activities: [
      { name: 'Nutritious breakfast', icon: Utensils, completed: false },
      { name: 'Herbal tea', icon: Coffee, completed: false },
      { name: 'Plan the day', icon: Brain, completed: false }
    ],
    dosha: 'Kapha',
    description: 'Nourishing the body with wholesome, warm foods.'
  },
  {
    time: '12:00 - 1:00 PM',
    period: 'Lunch Time',
    icon: Utensils,
    color: 'from-red-400 to-pink-400',
    activities: [
      { name: 'Main meal of the day', icon: Utensils, completed: false },
      { name: 'Mindful eating', icon: Brain, completed: false },
      { name: 'Short walk', icon: Activity, completed: false }
    ],
    dosha: 'Pitta',
    description: 'The digestive fire is strongest, perfect for the largest meal.'
  },
  {
    time: '6:00 - 8:00 PM',
    period: 'Evening Routine',
    icon: Sunset,
    color: 'from-purple-400 to-pink-400',
    activities: [
      { name: 'Light dinner', icon: Utensils, completed: false },
      { name: 'Family time', icon: Heart, completed: false },
      { name: 'Gentle activities', icon: Activity, completed: false }
    ],
    dosha: 'Kapha',
    description: 'Winding down and preparing for rest.'
  },
  {
    time: '9:00 - 10:00 PM',
    period: 'Sleep Preparation',
    icon: Moon,
    color: 'from-indigo-400 to-purple-400',
    activities: [
      { name: 'Digital detox', icon: Brain, completed: false },
      { name: 'Relaxation practices', icon: Heart, completed: false },
      { name: 'Prepare for sleep', icon: Moon, completed: false }
    ],
    dosha: 'Kapha',
    description: 'Creating the optimal environment for restorative sleep.'
  }
]

export default function DinacharayaTimeline() {
  const [completedActivities, setCompletedActivities] = useState(new Set())
  const [selectedPeriod, setSelectedPeriod] = useState(null)

  const toggleActivity = (periodIndex, activityIndex) => {
    const activityId = `${periodIndex}-${activityIndex}`
    const newCompleted = new Set(completedActivities)
    
    if (newCompleted.has(activityId)) {
      newCompleted.delete(activityId)
    } else {
      newCompleted.add(activityId)
    }
    
    setCompletedActivities(newCompleted)
  }

  const getCompletionPercentage = () => {
    const totalActivities = dinacharayaSchedule.reduce((sum, period) => sum + period.activities.length, 0)
    return Math.round((completedActivities.size / totalActivities) * 100)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <GlassCard className="p-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 rounded-2xl">
              <Clock className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-charcoal-800">Dinacharya</h1>
              <p className="text-charcoal-600 text-lg">Your Personalized Daily Routine</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-charcoal-600">Today's Progress</span>
              <span className="text-sm font-semibold text-teal-600">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getCompletionPercentage()}%` }}
                className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Timeline */}
      <BentoGrid>
        {dinacharayaSchedule.map((period, periodIndex) => {
          const Icon = period.icon
          const isSelected = selectedPeriod === periodIndex
          
          return (
            <BentoItem
              key={periodIndex}
              colSpan="col-span-6"
              className={`cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-2 ring-teal-400 shadow-glow' : ''
              }`}
              onClick={() => setSelectedPeriod(isSelected ? null : periodIndex)}
            >
              <div className="space-y-4">
                {/* Period Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-r ${period.color} p-3 rounded-xl`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-charcoal-800">{period.period}</h3>
                      <p className="text-charcoal-600">{period.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      period.dosha === 'Vata' ? 'bg-purple-100 text-purple-700' :
                      period.dosha === 'Pitta' ? 'bg-red-100 text-red-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {period.dosha} Time
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-charcoal-600 text-sm">{period.description}</p>

                {/* Activities */}
                <div className="space-y-2">
                  {period.activities.map((activity, activityIndex) => {
                    const ActivityIcon = activity.icon
                    const activityId = `${periodIndex}-${activityIndex}`
                    const isCompleted = completedActivities.has(activityId)
                    
                    return (
                      <motion.div
                        key={activityIndex}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                          isCompleted 
                            ? 'bg-teal-50 border border-teal-200' 
                            : 'bg-white/50 border border-white/30 hover:bg-white/70'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleActivity(periodIndex, activityIndex)
                        }}
                      >
                        <div className={`p-2 rounded-lg ${
                          isCompleted ? 'bg-teal-500' : 'bg-gray-300'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="text-white" size={16} />
                          ) : (
                            <ActivityIcon className="text-gray-600" size={16} />
                          )}
                        </div>
                        <span className={`flex-1 ${
                          isCompleted 
                            ? 'text-teal-700 font-medium line-through' 
                            : 'text-charcoal-700'
                        }`}>
                          {activity.name}
                        </span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Expand indicator */}
                {!isSelected && (
                  <div className="text-center">
                    <GlassButton variant="ghost" size="sm">
                      View Details
                    </GlassButton>
                  </div>
                )}
              </div>
            </BentoItem>
          )
        })}
      </BentoGrid>

      {/* Dosha Information */}
      <BentoGrid>
        <BentoItem colSpan="col-span-4" className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/50">
          <div className="text-center">
            <h3 className="text-xl font-bold text-charcoal-800 mb-3">Vata Dosha</h3>
            <p className="text-charcoal-600 text-sm">
              Air & Space elements. Best time for creativity, meditation, and spiritual practices.
            </p>
          </div>
        </BentoItem>

        <BentoItem colSpan="col-span-4" className="bg-gradient-to-br from-red-500/10 to-red-600/20 border-red-200/50">
          <div className="text-center">
            <h3 className="text-xl font-bold text-charcoal-800 mb-3">Pitta Dosha</h3>
            <p className="text-charcoal-600 text-sm">
              Fire & Water elements. Peak digestive fire and mental clarity for important tasks.
            </p>
          </div>
        </BentoItem>

        <BentoItem colSpan="col-span-4" className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200/50">
          <div className="text-center">
            <h3 className="text-xl font-bold text-charcoal-800 mb-3">Kapha Dosha</h3>
            <p className="text-charcoal-600 text-sm">
              Earth & Water elements. Time for grounding activities, meals, and rest.
            </p>
          </div>
        </BentoItem>
      </BentoGrid>
    </div>
  )
}