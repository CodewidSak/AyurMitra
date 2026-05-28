import React, { useState, useEffect } from 'react'
import Navbar from '../../../components/Navbar'
import BodyNavigator from '../../body-map/components/BodyNavigator'
import SymptomForm from '../components/SymptomForm'
import AyurvedicResult from '../components/AyurvedicResult'
import ConsultationHistory from '../components/ConsultationHistory'
import HealthAssessment from '../components/HealthAssessment'
import EmergencyAlert from '../components/EmergencyAlert'
import ConsultationProgress from '../components/ConsultationProgress'
import DinacharayaTimeline from '../components/DinacharayaTimeline'
import HerbMapping from '../components/HerbMapping'
import { useConsultationStore } from '../../../store/consultationStore'
import { ayurvedicService } from '../../../api/ayurvedicService'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Stethoscope, 
  Clock, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp,
  ChevronRight,
  Heart,
  Brain,
  Shield,
  Sparkles,
  Activity,
  Leaf
} from 'lucide-react'
import { BentoGrid, BentoItem, GlassCard, GlassButton } from '../../../components/ui/GlassCard'

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
  const [activeTab, setActiveTab] = useState('consultation')
  const [consultationStep, setConsultationStep] = useState(1)
  const [healthMetrics, setHealthMetrics] = useState(null)
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false)
  const [consultationHistory, setConsultationHistory] = useState([])

  useEffect(() => {
    loadConsultationHistory()
    checkForEmergencySymptoms()
  }, [symptoms])

  const loadConsultationHistory = async () => {
    try {
      const history = await ayurvedicService.getChatHistory()
      setConsultationHistory(history)
    } catch (err) {
      console.error('Failed to load consultation history:', err)
    }
  }

  const checkForEmergencySymptoms = () => {
    const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'loss of consciousness']
    const hasEmergency = symptoms.some(symptom => 
      emergencySymptoms.some(emergency => 
        symptom.toLowerCase().includes(emergency)
      )
    )
    setShowEmergencyAlert(hasEmergency)
  }

  const handleBodyPartSelect = (part) => {
    setSelectedBodyPart(part)
    setSymptoms([])
    setResult(null)
    setConsultationStep(2)
  }

  const handleSubmitSymptoms = async (symptomList, additionalInfo) => {
    if (!selectedBodyPart || symptomList.length === 0) {
      setError('Please select a body part and add symptoms')
      return
    }

    setError('')
    setIsLoading(true)
    setConsultationStep(3)

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
      setConsultationStep(4)
      loadConsultationHistory() // Refresh history
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get remedy')
      setConsultationStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewConsultation = () => {
    setSelectedBodyPart(null)
    setSymptoms([])
    setResult(null)
    setError('')
    setConsultationStep(1)
    setActiveTab('consultation')
  }

  const tabs = [
    { id: 'consultation', label: 'AI Consultation', icon: Stethoscope, color: 'teal' },
    { id: 'dinacharya', label: 'Daily Routine', icon: Activity, color: 'blue' },
    { id: 'herbs', label: 'Herb Library', icon: Leaf, color: 'green' },
    { id: 'history', label: 'History', icon: Clock, color: 'purple' },
    { id: 'assessment', label: 'Health Metrics', icon: TrendingUp, color: 'orange' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-blue-50">
      <Navbar />

      {/* Emergency Alert */}
      <AnimatePresence>
        {showEmergencyAlert && (
          <EmergencyAlert onClose={() => setShowEmergencyAlert(false)} />
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="bg-medical-gradient p-4 rounded-2xl shadow-glow">
                <Sparkles className="text-white" size={40} />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-charcoal-800 to-teal-600 bg-clip-text text-transparent">
                AyurVeda Pro
              </h1>
              <p className="text-charcoal-600 text-lg">AI-Powered Holistic Health Platform</p>
            </div>
          </div>
        </motion.div>

        {/* Professional Stats Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <BentoGrid>
            <BentoItem colSpan="col-span-3" className="bg-gradient-to-br from-teal-500/10 to-teal-600/20 border-teal-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-teal-500 p-3 rounded-xl">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-charcoal-800">{consultationHistory.length}</h3>
                  <p className="text-charcoal-600">Total Consultations</p>
                </div>
              </div>
            </BentoItem>

            <BentoItem colSpan="col-span-3" className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <Brain className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-charcoal-800">98.5%</h3>
                  <p className="text-charcoal-600">AI Accuracy</p>
                </div>
              </div>
            </BentoItem>

            <BentoItem colSpan="col-span-3" className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-xl">
                  <Shield className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-charcoal-800">24/7</h3>
                  <p className="text-charcoal-600">Available</p>
                </div>
              </div>
            </BentoItem>

            <BentoItem colSpan="col-span-3" className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-xl">
                  <Leaf className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-charcoal-800">500+</h3>
                  <p className="text-charcoal-600">Ayurvedic Remedies</p>
                </div>
              </div>
            </BentoItem>
          </BentoGrid>
        </motion.div>

        {/* Professional Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-2">
            <div className="flex space-x-2 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <GlassButton
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'ghost'}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-3 px-6 py-3 whitespace-nowrap"
                  >
                    <Icon size={20} />
                    {tab.label}
                  </GlassButton>
                )
              })}
            </div>
          </GlassCard>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <GlassCard className="p-4 bg-red-500/10 border-red-200/50">
              <div className="flex items-center gap-3 text-red-700">
                <AlertTriangle size={20} />
                {error}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Tab Content with Professional Layout */}
        <AnimatePresence mode="wait">
          {activeTab === 'consultation' && (
            <motion.div
              key="consultation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Progress Indicator */}
              <div className="mb-8">
                <ConsultationProgress currentStep={consultationStep} />
              </div>

              <BentoGrid>
                {/* 3D Body Navigator - Large Section */}
                <BentoItem colSpan="col-span-8" rowSpan="row-span-2">
                  <div className="h-full">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-teal-100 p-2 rounded-xl">
                        <Stethoscope className="text-teal-600" size={24} />
                      </div>
                      <h2 className="text-2xl font-bold text-charcoal-800">3D Body Analysis</h2>
                    </div>
                    <BodyNavigator
                      onBodyPartSelect={handleBodyPartSelect}
                      selectedPart={selectedBodyPart}
                    />
                  </div>
                </BentoItem>

                {/* Symptom Form - Side Panel */}
                <BentoItem colSpan="col-span-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <AlertTriangle className="text-blue-600" size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-charcoal-800">Symptom Analysis</h2>
                  </div>
                  <SymptomForm
                    onSubmit={handleSubmitSymptoms}
                    isLoading={isLoading}
                    selectedBodyPart={selectedBodyPart}
                  />
                </BentoItem>

                {/* Selected Part Info */}
                {selectedBodyPart && (
                  <BentoItem colSpan="col-span-4" className="bg-gradient-to-br from-teal-500/10 to-green-500/10 border-teal-200/50">
                    <div className="text-center">
                      <div className="bg-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-charcoal-800 mb-2">Selected Area</h3>
                      <p className="text-teal-600 font-semibold text-lg">{selectedBodyPart}</p>
                      <div className="flex items-center justify-center gap-2 mt-3 text-sm text-charcoal-600">
                        <ChevronRight size={16} />
                        <span>Ready for analysis</span>
                      </div>
                    </div>
                  </BentoItem>
                )}
              </BentoGrid>

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
            </motion.div>
          )}

          {activeTab === 'dinacharya' && (
            <motion.div
              key="dinacharya"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <DinacharayaTimeline />
            </motion.div>
          )}

          {activeTab === 'herbs' && (
            <motion.div
              key="herbs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HerbMapping />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ConsultationHistory 
                history={consultationHistory}
                onSelectConsultation={(consultation) => {
                  setResult(consultation)
                  setActiveTab('consultation')
                }}
              />
            </motion.div>
          )}

          {activeTab === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HealthAssessment 
                onAssessmentComplete={(metrics) => setHealthMetrics(metrics)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}