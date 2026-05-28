import React, { useState, useEffect } from 'react'
import MainLayout from '../../../components/layout/MainLayout'
import { useConsultationStore } from '../../../store/consultationStore'
import { ayurvedicService } from '../../../api/ayurvedicService'
import { Textarea, Select } from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { Card } from '../../../components/ui/Card'
import Grid from '../../../components/ui/Grid'

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

export default function ConsultationImproved() {
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
  const [currentResult, setCurrentResult] = useState(null)

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
      
      setCurrentResult(response)
      loadConsultationHistory()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze symptoms')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedBodyPart('')
    setSymptoms('')
    setDuration('1-week')
    setTimeOfDay('constant')
    setSeverity(5)
    setError('')
    setCurrentResult(null)
  }

  return (
    <MainLayout breadcrumb={{ section: 'Consultation Portal', page: 'Symptom Assessment' }}>
      <div className="h-[calc(100vh-200px)] flex gap-6">
        {/* Left Column: Body Part Selection & Form (50%) */}
        <section className="w-1/2 flex flex-col">
          <Card variant="low" size="md" className="flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-label text-xs tracking-widest-plus uppercase text-secondary mb-1 block">
                    Step 01 • Body Area Selection
                  </span>
                  <h2 className="font-headline text-2xl text-primary font-bold">
                    Select Area of Concern
                  </h2>
                </div>
                {selectedBodyPart && (
                  <Badge variant="primary" size="sm">
                    {selectedBodyPart}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Identify the primary focal point of your discomfort for accurate Ayurvedic analysis.
              </p>
            </div>

            {/* Body Part Selection Grid - Compact */}
            <div className="mb-6">
              <Grid cols={2} gap={3}>
                {BODY_PARTS.map((part) => (
                  <button
                    key={part.name}
                    onClick={() => handleBodyPartSelect(part.name)}
                    className={`
                      group flex items-center p-3 rounded-lg transition-all duration-300 ease-calm border text-left
                      ${selectedBodyPart === part.name
                        ? 'bg-primary text-surface border-primary shadow-ambient scale-[1.01]'
                        : 'bg-surface-container-lowest border-transparent hover:border-primary/20 hover:shadow-md hover:translate-y-[-1px]'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors
                      ${selectedBodyPart === part.name
                        ? 'bg-surface/20'
                        : 'bg-surface group-hover:bg-primary/10'
                      }
                    `}>
                      <span className={`
                        material-symbols-outlined text-lg
                        ${selectedBodyPart === part.name ? 'text-surface' : 'text-primary'}
                      `}>
                        {part.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`
                        font-headline text-sm font-semibold block mb-0.5
                        ${selectedBodyPart === part.name ? 'text-surface' : 'text-primary'}
                      `}>
                        {part.name}
                      </span>
                      <span className={`
                        text-xs leading-tight
                        ${selectedBodyPart === part.name ? 'text-surface/80' : 'text-on-surface-variant'}
                      `}>
                        {part.description}
                      </span>
                    </div>
                  </button>
                ))}
              </Grid>
            </div>

            {/* Form Section */}
            {selectedBodyPart && (
              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="font-label text-xs tracking-widest-plus uppercase text-secondary mb-1 block">
                    Step 02 • Symptom Details
                  </span>
                  <h3 className="font-headline text-lg text-primary font-semibold">
                    Describe Your Experience
                  </h3>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-error-container/20 rounded-lg border-l-4 border-error">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-error text-sm">warning</span>
                      <p className="text-sm text-on-error-container font-medium">{error}</p>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                  {/* Symptom Description */}
                  <Textarea
                    label="Symptom Description"
                    placeholder="Describe your symptoms in detail..."
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                  />

                  {/* Duration & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Duration"
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
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="font-label text-xs uppercase tracking-widest text-primary font-bold">
                        Intensity Level
                      </label>
                      <Badge variant="primary" size="sm">
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
                    <div className="flex justify-between text-xs uppercase tracking-widest text-secondary opacity-60">
                      <span>Gentle</span>
                      <span>Moderate</span>
                      <span>Acute</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-auto pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      disabled={isLoading || !selectedBodyPart}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">progress_activity</span>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Analyze Symptoms
                          <span className="material-symbols-outlined">temp_preferences_custom</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Card>
        </section>

        {/* Right Column: Results & History (50%) */}
        <section className="w-1/2 flex flex-col">
          <Card variant="default" size="md" className="flex-1 flex flex-col">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label text-xs tracking-widest-plus uppercase text-secondary mb-1 block">
                    Analysis Results
                  </span>
                  <h2 className="font-headline text-xl text-primary font-bold">
                    Ayurvedic Consultation
                  </h2>
                </div>
                {currentResult && (
                  <Button variant="outline" size="sm" onClick={resetForm}>
                    <span className="material-symbols-outlined">refresh</span>
                    New
                  </Button>
                )}
              </div>
            </div>

            {/* Content Area - Fixed Height, No Scroll */}
            <div className="flex-1 overflow-hidden">
              {currentResult ? (
                /* Analysis Results */
                <div className="h-full flex flex-col space-y-4">
                  {/* Summary */}
                  <div className="bg-primary/5 rounded-lg p-3 border-l-4 border-primary">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-lg mt-0.5">analytics</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-headline text-base text-primary font-semibold mb-1">
                          Analysis Summary
                        </h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed">
                          <strong>Area:</strong> {currentResult.bodyPart}<br/>
                          <strong>Symptoms:</strong> {currentResult.symptoms}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remedies - Scrollable within fixed container */}
                  <div className="flex-1 min-h-0">
                    <h4 className="font-headline text-base text-primary font-semibold mb-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">eco</span>
                      Ayurvedic Remedies
                    </h4>
                    <div className="bg-surface-container-low rounded-lg p-3 h-full overflow-y-auto">
                      <div className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                        {currentResult.remedies}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <span className="material-symbols-outlined">download</span>
                      Save
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <span className="material-symbols-outlined">share</span>
                      Share
                    </Button>
                  </div>
                </div>
              ) : consultationHistory.length > 0 ? (
                /* Consultation History */
                <div className="h-full flex flex-col">
                  <h3 className="font-headline text-base text-primary font-semibold mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">history</span>
                    Recent Consultations
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {consultationHistory.slice(0, 8).map((consultation, index) => (
                      <div key={consultation.id || index} className="bg-surface-container-low rounded-lg p-3 hover:shadow-md transition-all duration-300">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-primary text-sm truncate">{consultation.bodyPart}</p>
                            <p className="text-xs text-secondary">
                              {new Date(consultation.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" size="sm">
                            Done
                          </Badge>
                        </div>
                        <p className="text-sm text-on-surface-variant line-clamp-2">
                          {consultation.symptoms}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-primary/20 text-5xl mb-3 block">
                      psychology
                    </span>
                    <h3 className="font-headline text-lg text-primary mb-2">Ready for Analysis</h3>
                    <p className="text-sm text-on-surface-variant max-w-sm">
                      Select a body area and describe your symptoms to receive personalized Ayurvedic guidance.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </MainLayout>
  )
}