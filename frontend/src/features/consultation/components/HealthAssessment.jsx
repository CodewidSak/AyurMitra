import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Heart, 
  Brain, 
  Utensils, 
  Moon, 
  Droplets,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const assessmentQuestions = [
  {
    id: 'energy',
    title: 'Energy Levels',
    icon: Activity,
    question: 'How would you rate your overall energy levels?',
    options: [
      { value: 1, label: 'Very Low', color: 'red' },
      { value: 2, label: 'Low', color: 'orange' },
      { value: 3, label: 'Moderate', color: 'yellow' },
      { value: 4, label: 'Good', color: 'green' },
      { value: 5, label: 'Excellent', color: 'emerald' }
    ]
  },
  {
    id: 'sleep',
    title: 'Sleep Quality',
    icon: Moon,
    question: 'How well do you sleep at night?',
    options: [
      { value: 1, label: 'Very Poor', color: 'red' },
      { value: 2, label: 'Poor', color: 'orange' },
      { value: 3, label: 'Fair', color: 'yellow' },
      { value: 4, label: 'Good', color: 'green' },
      { value: 5, label: 'Excellent', color: 'emerald' }
    ]
  },
  {
    id: 'digestion',
    title: 'Digestive Health',
    icon: Utensils,
    question: 'How is your digestive health?',
    options: [
      { value: 1, label: 'Very Poor', color: 'red' },
      { value: 2, label: 'Poor', color: 'orange' },
      { value: 3, label: 'Fair', color: 'yellow' },
      { value: 4, label: 'Good', color: 'green' },
      { value: 5, label: 'Excellent', color: 'emerald' }
    ]
  },
  {
    id: 'stress',
    title: 'Stress Levels',
    icon: Brain,
    question: 'How stressed do you feel on average?',
    options: [
      { value: 5, label: 'Very High', color: 'red' },
      { value: 4, label: 'High', color: 'orange' },
      { value: 3, label: 'Moderate', color: 'yellow' },
      { value: 2, label: 'Low', color: 'green' },
      { value: 1, label: 'Very Low', color: 'emerald' }
    ]
  },
  {
    id: 'hydration',
    title: 'Hydration',
    icon: Droplets,
    question: 'How much water do you drink daily?',
    options: [
      { value: 1, label: 'Less than 4 glasses', color: 'red' },
      { value: 2, label: '4-6 glasses', color: 'orange' },
      { value: 3, label: '6-8 glasses', color: 'yellow' },
      { value: 4, label: '8-10 glasses', color: 'green' },
      { value: 5, label: 'More than 10 glasses', color: 'emerald' }
    ]
  }
]

export default function HealthAssessment({ onAssessmentComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isComplete, setIsComplete] = useState(false)
  const [results, setResults] = useState(null)

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeAssessment(newAnswers)
    }
  }

  const completeAssessment = (finalAnswers) => {
    const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0)
    const maxScore = assessmentQuestions.length * 5
    const percentage = (totalScore / maxScore) * 100

    let overallHealth, recommendations
    
    if (percentage >= 80) {
      overallHealth = { level: 'Excellent', color: 'emerald', icon: CheckCircle }
      recommendations = [
        'Maintain your current healthy lifestyle',
        'Continue regular exercise and balanced diet',
        'Keep up with stress management practices'
      ]
    } else if (percentage >= 60) {
      overallHealth = { level: 'Good', color: 'green', icon: CheckCircle }
      recommendations = [
        'Focus on areas that scored lower',
        'Consider incorporating more Ayurvedic practices',
        'Maintain consistency in healthy habits'
      ]
    } else if (percentage >= 40) {
      overallHealth = { level: 'Fair', color: 'yellow', icon: AlertCircle }
      recommendations = [
        'Prioritize sleep and stress management',
        'Improve hydration and dietary habits',
        'Consider consulting an Ayurvedic practitioner'
      ]
    } else {
      overallHealth = { level: 'Needs Attention', color: 'red', icon: AlertCircle }
      recommendations = [
        'Focus on fundamental health practices',
        'Seek professional guidance',
        'Start with small, manageable changes'
      ]
    }

    const assessmentResults = {
      totalScore,
      percentage: Math.round(percentage),
      overallHealth,
      recommendations,
      categoryScores: finalAnswers
    }

    setResults(assessmentResults)
    setIsComplete(true)
    onAssessmentComplete(assessmentResults)
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResults(null)
  }

  if (isComplete && results) {
    const OverallIcon = results.overallHealth.icon
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${results.overallHealth.color}-100 mb-4`}>
              <OverallIcon className={`text-${results.overallHealth.color}-600`} size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Assessment Complete</h2>
            <p className="text-lg text-gray-600">
              Your overall health score: <span className={`font-bold text-${results.overallHealth.color}-600`}>
                {results.percentage}% - {results.overallHealth.level}
              </span>
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {assessmentQuestions.map((question) => {
              const score = answers[question.id]
              const Icon = question.icon
              const option = question.options.find(opt => opt.value === score)
              
              return (
                <div key={question.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="text-gray-600" size={20} />
                    <h3 className="font-semibold text-gray-900">{question.title}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-${option.color}-600 font-medium`}>
                      {option.label}
                    </span>
                    <span className="text-gray-500">{score}/5</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Recommendations */}
          <div className="bg-ayur-50 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Personalized Recommendations</h3>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-ayur-600 flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              onClick={resetAssessment}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Retake Assessment
            </button>
            <button className="flex-1 bg-ayur-600 hover:bg-ayur-700 text-white font-semibold py-3 rounded-lg transition">
              Get Personalized Plan
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const question = assessmentQuestions[currentQuestion]
  const Icon = question.icon

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-ayur-100 p-2 rounded-lg">
              <Icon className="text-ayur-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Health Assessment</h2>
          </div>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} of {assessmentQuestions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
            className="bg-ayur-600 h-2 rounded-full transition-all duration-300"
          />
        </div>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {question.options.map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(question.id, option.value)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md border-${option.color}-200 hover:border-${option.color}-400 hover:bg-${option.color}-50`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{option.label}</span>
                <div className={`w-6 h-6 rounded-full bg-${option.color}-500`} />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}