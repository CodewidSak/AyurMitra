import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import SymptomForm from '../components/SymptomForm'
import AyurvedicResult from '../components/AyurvedicResultSimple'
import { useConsultationStore } from '../../../store/consultationStore'
import { ayurvedicService } from '../../../api/ayurvedicService'
import { motion } from 'framer-motion'
import { 
  Activity,
  AlertCircle, 
  Heart,
  Brain,
  TrendingUp,
  Sparkles,
  User,
  Zap
} from 'lucide-react'

const BODY_PARTS = [
  { name: 'Head', icon: '🧠' },
  { name: 'Eyes', icon: '👁️' },
  { name: 'Ears', icon: '👂' },
  { name: 'Nose', icon: '👃' },
  { name: 'Throat', icon: '🗣️' },
  { name: 'Chest', icon: '🫁' },
  { name: 'Heart', icon: '❤️' },
  { name: 'Stomach', icon: '🫃' },
  { name: 'Abdomen', icon: '🔴' },
  { name: 'Back', icon: '🔙' },
  { name: 'Left Arm', icon: '💪' },
  { name: 'Right Arm', icon: '💪' },
  { name: 'Left Leg', icon: '🦵' },
  { name: 'Right Leg', icon: '🦵' },
  { name: 'Joints', icon: '🦴' },
  { name: 'Skin', icon: '🤲' },
]

export default function Consultation() {
  const {
    selectedBodyPart,
    setSelectedBodyPart,
    symptoms,
    setSymptoms,
    isLoading,
    setIsLoading,
  } = useConsultationStore()

  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [consultationHistory, setConsultationHistory] = useState([])

  useEffect(() => {
    loadConsultationHistory()
  }, [])

  const loadConsultationHistory = async () => {
    try {
      const history = await ayurvedicService.getChatHistory()
      setConsultationHistory(history)
    } catch (err) {
      console.error('Failed to load consultation history:', err)
    }
  }

  const handleBodyPartSelect = (part) => {
    setSelectedBodyPart(part)
    setSymptoms([])
    setResult(null)
  }

  const handleSubmitSymptoms = async (symptomList, additionalInfo) => {
    if (!selectedBodyPart || symptomList.length === 0) {
      setError('Please select a body part and add symptoms')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await ayurvedicService.getRemedy({
        bodyPart: selectedBodyPart,
        symptoms: symptomList,
        duration: additionalInfo?.duration,
        severity: additionalInfo?.severity,
        triggers: additionalInfo?.triggers,
        previousTreatments: additionalInfo?.previousTreatments
      })
      setResult(response)
      loadConsultationHistory() // Refresh history
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get remedy')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConsultation = () => {
    setSelectedBodyPart(null)
    setSymptoms([])
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-lime-400 to-green-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Modern Header with Animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-3">
            <motion.div 
              className="relative"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-4 rounded-2xl shadow-2xl shadow-green-500/40">
                <Sparkles className="text-white" size={28} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </motion.div>
            <div>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Health Consultation
              </motion.h1>
              <motion.p 
                className="text-green-700 text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                🌿 AI-powered Ayurvedic health analysis
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Animated Stats Cards with Modern Pattern */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-green-200/50 p-6 overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Consultations</p>
                <motion.p 
                  className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {consultationHistory.length}
                </motion.p>
              </div>
              <motion.div 
                className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-green-500/40"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart className="text-white" size={24} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-teal-200/50 p-6 overflow-hidden hover:shadow-2xl hover:shadow-teal-500/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-teal-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">AI Accuracy</p>
                <motion.p 
                  className="text-4xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                >
                  98.5%
                </motion.p>
              </div>
              <motion.div 
                className="bg-gradient-to-br from-teal-500 to-cyan-600 p-4 rounded-2xl shadow-lg shadow-teal-500/40"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Brain className="text-white" size={24} />
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-lime-200/50 p-6 overflow-hidden hover:shadow-2xl hover:shadow-lime-500/20 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lime-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-lime-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-lime-600 uppercase tracking-wider mb-2">Response Time</p>
                <motion.p 
                  className="text-4xl font-black bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                >
                  &lt;2s
                </motion.p>
              </div>
              <motion.div 
                className="bg-gradient-to-br from-lime-500 to-green-600 p-4 rounded-2xl shadow-lg shadow-lime-500/40"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="text-white" size={24} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 rounded-3xl p-5 flex items-center gap-4 shadow-lg">
              <div className="bg-red-500 p-3 rounded-2xl animate-pulse">
                <AlertCircle className="text-white" size={22} />
              </div>
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content with Modern Pattern */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Body Part Selection - Enhanced with Animations */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-200/50 p-8 overflow-hidden"
            >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
              
              <div className="relative flex items-center gap-3 mb-8">
                <motion.div 
                  className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-2xl shadow-lg shadow-green-500/40"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Activity className="text-white" size={22} />
                </motion.div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Select Body Area
                </h2>
              </div>

              {/* Body Parts Grid with Staggered Animation */}
              <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {BODY_PARTS.map((part, index) => (
                  <motion.button
                    key={part.name}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4 + index * 0.05,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.08, 
                      y: -8,
                      rotate: [0, -2, 2, 0]
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBodyPartSelect(part.name)}
                    className={`
                      relative p-6 rounded-3xl border-2 transition-all duration-300 group
                      ${selectedBodyPart === part.name
                        ? 'border-green-500 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 shadow-2xl shadow-green-500/30'
                        : 'border-green-200/50 bg-white/50 hover:border-green-400 hover:shadow-xl hover:bg-gradient-to-br hover:from-green-50/50 hover:to-emerald-50/50'
                      }
                    `}
                  >
                    {/* Glow Effect */}
                    {selectedBodyPart === part.name && (
                      <motion.div
                        layoutId="selectedGlow"
                        className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl blur-xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <div className="relative flex flex-col items-center gap-3">
                      <motion.div 
                        className={`
                          w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300
                          ${selectedBodyPart === part.name 
                            ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg shadow-green-500/30' 
                            : 'bg-gradient-to-br from-gray-50 to-green-50 group-hover:from-green-100 group-hover:to-emerald-100'
                          }
                        `}
                        animate={selectedBodyPart === part.name ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {part.icon}
                      </motion.div>
                      <span className={`
                        text-sm font-bold text-center transition-colors
                        ${selectedBodyPart === part.name ? 'text-green-700' : 'text-gray-700 group-hover:text-green-600'}
                      `}>
                        {part.name}
                      </span>
                    </div>
                    
                    {selectedBodyPart === part.name && (
                      <motion.div
                        layoutId="selectedIndicator"
                        className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Selected Part Info with Animation */}
              {selectedBodyPart && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mt-8 p-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl border-2 border-green-300 shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
                  <div className="relative flex items-center gap-4">
                    <motion.div 
                      className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-green-500/40"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <User className="text-white" size={22} />
                    </motion.div>
                    <div>
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Selected Area</p>
                      <motion.p 
                        className="text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                      >
                        {selectedBodyPart}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Symptom Form & Tips */}
          <div className="space-y-6">
            {/* Symptom Form with Animation */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-teal-200/50 p-8 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-teal-400/10 to-cyan-400/10 rounded-full blur-3xl"></div>
              
              <div className="relative flex items-center gap-3 mb-6">
                <motion.div 
                  className="bg-gradient-to-br from-teal-500 to-cyan-600 p-3 rounded-2xl shadow-lg shadow-teal-500/40"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <AlertCircle className="text-white" size={22} />
                </motion.div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-teal-700 to-cyan-600 bg-clip-text text-transparent">
                  Symptoms
                </h2>
              </div>
              <div className="relative">
                <SymptomForm
                  onSubmit={handleSubmitSymptoms}
                  isLoading={isLoading}
                  selectedBodyPart={selectedBodyPart}
                />
              </div>
            </motion.div>

            {/* Quick Tips with Modern Design */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 rounded-3xl border-2 border-lime-300/50 p-6 overflow-hidden shadow-xl"
            >
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-lime-400/20 rounded-full blur-2xl"></div>
              
              <div className="relative flex items-center gap-3 mb-4">
                <motion.div 
                  className="bg-gradient-to-br from-lime-500 to-green-600 p-2.5 rounded-xl shadow-lg shadow-lime-500/40"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <TrendingUp className="text-white" size={20} />
                </motion.div>
                <h3 className="font-black text-green-800">Quick Tips</h3>
              </div>
              <ul className="relative space-y-3 text-sm text-green-800">
                {[
                  'Be specific about your symptoms',
                  'Include duration and severity',
                  'Mention any triggers you\'ve noticed'
                ].map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <motion.span 
                      className="text-green-600 font-black text-lg mt-0.5"
                      whileHover={{ scale: 1.3, rotate: 360 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      •
                    </motion.span>
                    <span className="group-hover:text-green-900 transition-colors font-medium">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8"
          >
            <AyurvedicResult 
              result={result} 
              onNewConsultation={handleNewConsultation}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}