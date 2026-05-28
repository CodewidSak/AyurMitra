import React from 'react'
import { Card, CardContent, CardTitle } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { Clock, Activity, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'consultation',
      title: 'Headache Consultation',
      description: 'Analyzed symptoms and received recommendations',
      time: '2 hours ago',
      status: 'completed',
      icon: CheckCircle,
    },
    {
      id: 2,
      type: 'profile',
      title: 'Profile Updated',
      description: 'Updated weight and height information',
      time: '1 day ago',
      status: 'completed',
      icon: Activity,
    },
    {
      id: 3,
      type: 'consultation',
      title: 'Digestive Issues',
      description: 'Consultation for stomach discomfort',
      time: '3 days ago',
      status: 'completed',
      icon: CheckCircle,
    },
  ]

  return (
    <Card>
      <CardContent>
        <CardTitle icon={Clock}>Recent Activity</CardTitle>
        
        <div className="mt-6 space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="bg-teal-100 p-2 rounded-lg flex-shrink-0">
                  <Icon className="text-teal-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                    <Badge variant="success" size="sm">
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <button className="w-full mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium py-2">
          View All Activity →
        </button>
      </CardContent>
    </Card>
  )
}
