import React from 'react'
import { Card, CardContent, CardTitle } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { Bell, Calendar, Pill, Apple } from 'lucide-react'
import { motion } from 'framer-motion'

export default function UpcomingReminders() {
  const reminders = [
    {
      id: 1,
      type: 'medication',
      title: 'Take Ashwagandha',
      time: 'Today, 8:00 PM',
      icon: Pill,
      priority: 'high',
    },
    {
      id: 2,
      type: 'meal',
      title: 'Dinner Time',
      time: 'Today, 7:30 PM',
      icon: Apple,
      priority: 'medium',
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Follow-up Consultation',
      time: 'Tomorrow, 10:00 AM',
      icon: Calendar,
      priority: 'high',
    },
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      default: return 'info'
    }
  }

  return (
    <Card>
      <CardContent>
        <CardTitle icon={Bell}>Upcoming Reminders</CardTitle>
        
        <div className="mt-6 space-y-3">
          {reminders.map((reminder, index) => {
            const Icon = reminder.icon
            return (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors"
              >
                <div className="bg-teal-100 p-2.5 rounded-lg">
                  <Icon className="text-teal-600" size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{reminder.title}</h4>
                    <Badge variant={getPriorityColor(reminder.priority)} size="sm">
                      {reminder.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{reminder.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <button className="w-full mt-4 px-4 py-2 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded-lg text-sm font-medium transition-colors">
          Add New Reminder
        </button>
      </CardContent>
    </Card>
  )
}
