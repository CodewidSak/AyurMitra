import React from 'react'
import { Leaf, Utensils, AlertCircle, Activity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AyurvedicResult({ result, onNewConsultation }) {
  const sections = [
    {
      title: 'Remedies',
      content: result.remedies,
      icon: Leaf,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Lifestyle Changes',
      content: result.lifestyleChanges,
      icon: Activity,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Dietary Recommendations',
      content: result.dietaryRecommendations,
      icon: Utensils,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Precautions',
      content: result.precautions,
      icon: AlertCircle,
      color: 'bg-red-50 border-red-200'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Your Ayurvedic Analysis</h2>
            <p className="text-gray-600">Comprehensive recommendations for holistic healing</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
              Export PDF
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition">
              Share
            </button>
            <button 
              onClick={onNewConsultation}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition"
            >
              New Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ayurvedic Recommendations</h2>
        <p className="text-gray-600">
          For <span className="font-semibold text-teal-600">{result.bodyPart}</span> - {result.symptoms}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-xl border-2 p-6 ${section.color} bg-white/80 backdrop-blur-sm shadow-lg`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="text-gray-700" size={24} />
                <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
              </div>
              <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {section.content}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-lg">
        <p className="text-blue-800 text-sm">
          <strong>Disclaimer:</strong> These recommendations are based on Ayurvedic principles and should not replace professional medical advice. 
          Please consult with a qualified healthcare provider for proper diagnosis and treatment.
        </p>
      </div>
    </div>
  )
}