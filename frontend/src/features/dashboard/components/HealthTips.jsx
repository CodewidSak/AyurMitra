import React from 'react'
import { Card, CardContent, CardTitle } from '../../../components/ui/Card'
import { Lightbulb, Sun, Moon, Droplets, Wind } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HealthTips() {
  const tips = [
    {
      id: 1,
      icon: Sun,
      title: 'Morning Routine',
      tip: 'Start your day with warm lemon water to boost digestion',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: 2,
      icon: Droplets,
      title: 'Hydration',
      tip: 'Drink 8-10 glasses of water throughout the day',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 3,
      icon: Wind,
      title: 'Breathing Exercise',
      tip: 'Practice pranayama for 10 minutes daily',
      color: 'bg-teal-100 text-teal-600',
    },
    {
      id: 4,
      icon: Moon,
      title: 'Sleep Schedule',
      tip: 'Maintain consistent sleep times for better rest',
      color: 'bg-indigo-100 text-indigo-600',
    },
  ]

  return (
    <Card>
      <CardContent>
        <CardTitle icon={Lightbulb}>Daily Health Tips</CardTitle>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tips.map((tip, index) => {
            const Icon = tip.icon
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors"
              >
                <div className={`${tip.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon size={20} />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.tip}</p>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
