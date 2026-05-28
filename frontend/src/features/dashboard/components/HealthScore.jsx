import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardTitle } from '../../../components/ui/Card'
import { TrendingUp } from 'lucide-react'

export default function HealthScore({ score = 75 }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Attention'
  }

  return (
    <Card>
      <CardContent>
        <CardTitle icon={TrendingUp}>Health Score</CardTitle>
        
        <div className="mt-6 flex items-center justify-center">
          <div className="relative">
            {/* Circular Progress */}
            <svg className="transform -rotate-90" width="160" height="160">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 440" }}
                animate={{ strokeDasharray: `${(score / 100) * 440} 440` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Score Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className={`text-4xl font-bold ${getScoreColor(score)}`}
              >
                {score}
              </motion.span>
              <span className="text-sm text-gray-600 mt-1">out of 100</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className={`text-lg font-semibold ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </span>
          <p className="text-sm text-gray-600 mt-2">
            Based on your recent health data and consultations
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
