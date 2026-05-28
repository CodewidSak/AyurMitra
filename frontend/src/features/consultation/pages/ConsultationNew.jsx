import React, { useState, useEffect } from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import { useConsultationStore } from '../../../store/consultationStore'
import { ayurvedicService } from '../../../api/ayurvedicService'
import { Textarea, Select } from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'

const BODY_PARTS = [
  { name: 'Head & Mind', icon: 'psychology', description: 'Cognitive and neurological concerns' },
  { name: 'Digestive Core', icon: 'gastroenterology', description: 'Stomach, intestines, and digestion' },
  { name: 'Spine & Back', icon: 'back_hand', description: 'Spinal and back-related issues' },
  { name: 'Limbs & Joints', icon: 'accessibility_new', description: 'Arms, legs, and joint mobility' },
  { name: 'Respiratory', icon: 'air', description: 'Breathing and lung function' },
  { name: 'Cardiovascular', icon: 'cardiology', description: 'Heart and circulation' },
  { name: 'Skin', icon: 'dermatology', description: 'Skin conditions and concerns' },
  { name: 'Eyes', icon: 'visibility', description: 'Vision and eye health' },
]

const DURATION_OPTIONS = [
  { value: 'less-than-24h', label: 'Less than 24 hours' },
  { value: '1-3-days', label: '1 - 3 Days' },
  { value: '1-week', label: '1 Week' },
  { value: '2-weeks', label: '2 Weeks' },
  { value: '1-month', label: '1 Month' },
  { value: 'chronic', label: 'Chronic (1 month+)' },
]

const TIME_OF_DAY_OPTIONS = [
  { value: 'morning', label: 'Morning (Kapha)' },
  { value: 'afternoon', label: 'Afternoon (Pitta)' },
  { value: 'evening', label: 'Evening (Vata)' },
  { value: 'constant', label: 'Constant' },
]

export default function Consultation() {
  const {
    selectedBodyPart,
    setSelectedBodyPart,
    isLoading,
    setIsLoading,
  } = useConsultationStore()

  const [symptoms, setSymptoms] = useState('')
  const [duration, setDuration] = useState('1-week')
  const [timeOfDay, setTimeOfDay] = useState('constant')
  const [severity, setSeverity] = useState(5)
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
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedBodyPart || !symptoms.trim()) {
      setError('Please select a body area and describe your symptoms')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const response = await ayurvedicService.getRemedy({
        bodyPart: selectedBodyPart,
        symptoms: [symptoms],
        duration,
        severity: severity.toString(),
        timeOfDay,
      })
      
      // Navigate to results or show results
      console.log('Analysis result:', response)
      loadConsultationHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout breadcrumb={{ section: 'Consultation Portal', page: 'Symptom Assessment' }}>
      <div className="min-h-screen flex">
        {/* Left Column: Body Part Selection (50%) */}
        <section className="w-1/2 pr-8 flex flex-col justify-center relative">
          {/* Botanical Background Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-12">
              <span className="font-label text-xs tracking-widest-plus uppercase text-secondary mb-2 block">
                Step 01
              </span>
              <h2 className="font-headline text-4xl text-primary font-bold mb-4">
                Select the Area of Concern
              </h2>
              <p className="text-on-surface-variant max-w-md font-light leading-relaxed">
                Identify the primary focal point of your discomfort. Ayurvedic diagnosis begins with localizing the imbalance.
              </p>
            </div>

            {/* Body Part Selection Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl">
              {BODY_PARTS.map((part) => (
                <button
                  key={part.name}
                  onClick={() => handleBodyPartSelect(part.name)}
                  className={`
                    group flex flex-col items-center justify-center p-8 rounded-2xl shadow-sm 
                    transition-all duration-300 ease-calm border
                    ${selectedBodyPart === part.name
                      ? 'bg-primary text-surface border-primary shadow-ambient-lg scale-[1.02]'
                      : 'bg-surface-container-lowest border-transparent hover:border-primary/20 hover:shadow-xl hover:translate-y-[-4px]'
                    }
                    active:scale-95
                  `}
                >
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors
                    ${selectedBodyPart === part.name
                      ? 'bg-surface/20'
                      : 'bg-surface group-hover:bg-primary/10'
                    }
                  `}>
                    <span className={`
                      material-symbols-outlined text-3xl
                      ${selectedBodyPart === part.name ? 'text-surface' : 'text-primary'}
                    `}>
                      {part.icon}
                    </span>
                  </div>
                  <span className={`
                    font-headline text-lg mb-1
                    ${selectedBodyPart === part.name ? 'text-surface' : 'text-primary'}
                  `}>
                    {part.name}
                  </span>
                  <span className={`
                    text-xs text-center
                    ${selectedBodyPart === part.name ? 'text-surface/80' : 'text-on-surface-variant'}
                  `}>
                    {part.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary">history</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{consultationHistory.length}</p>
                  <p className="text-xs text-secondary uppercase tracking-wider">Past Consultations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-tertiary/10 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-tertiary">verified</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">98.5%</p>
                  <p className="text-xs text-secondary uppercase tracking-wider">AI Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Consultation Form (50%) */}
        <section className="w-1/2 pl-8 flex flex-col justify-center bg-surface-container-low rounded-3xl p-12">
          <div className="max-w-xl">
            {/* Header */}
            <div className="mb-12">
              <span className="font-label text-xs tracking-widest-plus uppercase text-secondary mb-2 block">
                Step 02
              </span>
              <h2 className="font-headline text-4xl text-primary font-bold mb-4">
                Nature of Imbalance
              </h2>
              <p className="text-on-surface-variant font-light leading-relaxed">
                Describe your symptoms with precision to help our practitioners understand your Dosha constitution.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-error-container/20 rounded-xl border-l-4 border-error">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error">warning</span>
                  <p className="text-sm text-on-error-container font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Symptom Description */}
              <Textarea
                label="Symptom Description"
                placeholder="Tell us how you feel... (e.g., sharp pain, dull ache, bloating)"
                rows={5}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />

              {/* Duration & Time of Day */}
              <div className="grid grid-cols-2 gap-8">
                <Select
                  label="Onset & Duration"
                  options={DURATION_OPTIONS}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
                <Select
                  label="Time of Day"
                  options={TIME_OF_DAY_OPTIONS}
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
              </div>

              {/* Severity Slider */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <label className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                    Intensity Spectrum
                  </label>
                  <Badge variant="primary">
                    {severity === 1 ? 'Gentle' : severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : severity <= 8 ? 'Significant' : 'Acute'} ({severity}/10)
                  </Badge>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                  style={{
                    background: `linear-gradient(to right, #0f5238 0%, #0f5238 ${(severity - 1) * 11.11}%, #dee4e0 ${(severity - 1) * 11.11}%, #dee4e0 100%)`
                  }}
                />
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-secondary opacity-60">
                  <span>Gentle</span>
                  <span>Medium</span>
                  <span>Acute</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  disabled={isLoading || !selectedBodyPart}
                  className="w-full shadow-ambient-lg"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Analyzing Symptoms...
                    </>
                  ) : (
                    <>
                      Analyze Symptoms
                      <span className="material-symbols-outlined">temp_preferences_custom</span>
                    </>
                  )}
                </Button>
                <p className="text-center text-[10px] text-on-surface-variant mt-4 uppercase tracking-wider">
                  By submitting, you agree to our Clinical Privacy Standards.
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
