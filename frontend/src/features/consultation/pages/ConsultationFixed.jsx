import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useConsultationStore } from '../../../store/consultationStore'
import { ayurvedicService } from '../../../api/ayurvedicService'
import { Textarea, Select } from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'

const BODY_PARTS = [
  { name: 'Head & Mind', icon: 'psychology', description: 'Cognitive concerns' },
  { name: 'Digestive Core', icon: 'gastroenterology', description: 'Stomach & digestion' },
  { name: 'Respiratory', icon: 'air', description: 'Breathing & lungs' },
  { name: 'Cardiovascular', icon: 'cardiology', description: 'Heart & circulation' },
  { name: 'Spine & Back', icon: 'back_hand', description: 'Spinal issues' },
  { name: 'Limbs & Joints', icon: 'accessibility_new', description: 'Arms, legs & joints' },
  { name: 'Skin', icon: 'dermatology', description: 'Skin conditions' },
  { name: 'Eyes', icon: 'visibility', description: 'Vision & eye health' },
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

export default function ConsultationFixed() {
  const navigate = useNavigate()
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
  const [activeView, setActiveView] = useState('form') // 'form', 'results', 'history'

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
      
      setCurrentResult({
        ...response,
        timestamp: new Date().toISOString(),
        inputData: {
          bodyPart: selectedBodyPart,
          symptoms,
          duration,
          timeOfDay,
          severity
        }
      })
      setActiveView('results')
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
    setActiveView('form')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <MainLayout breadcrumb={{ section: 'Consultation Portal', page: 'Symptom Assessment' }}>
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="flex-shrink-0 bg-background border-b border-primary/10 px-6 py-4">
          <div className="text-center mb-4">
            <h1 className="font-headline text-3xl text-primary font-bold mb-2">
              AI-Powered Ayurvedic Consultation
            </h1>
            <p className="text-sm text-on-surface-variant">
              Get personalized Ayurvedic recommendations based on your symptoms
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center">
            <div className="flex bg-surface-container-low rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveView('form')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm
                  ${activeView === 'form'
                    ? 'bg-primary text-surface shadow-ambient'
                    : 'text-primary hover:bg-primary/10'
                  }
                `}
              >
                <span className="material-symbols-outlined text-lg">psychology</span>
                New Consultation
              </button>
              <button
                onClick={() => setActiveView('results')}
                disabled={!currentResult}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm
                  ${activeView === 'results'
                    ? 'bg-primary text-surface shadow-ambient'
                    : 'text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed'
                  }
                `}
              >
                <span className="material-symbols-outlined text-lg">analytics</span>
                Results
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm
                  ${activeView === 'history'
                    ? 'bg-primary text-surface shadow-ambient'
                    : 'text-primary hover:bg-primary/10'
                  }
                `}
              >
                <span className="material-symbols-outlined text-lg">history</span>
                History ({consultationHistory.length})
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          {activeView === 'form' && (
            <div className="h-full flex">
              {/* Main Form - Left Side */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-error-container/20 rounded-lg border-l-4 border-error">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-error text-lg">warning</span>
                        <p className="text-sm text-on-error-container font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Body Part Selection */}
                    <Card variant="low" size="md">
                      <CardHeader>
                        <CardTitle icon="medical_information" size="md">
                          Select Affected Area
                        </CardTitle>
                      </CardHeader>
                      <div className="grid grid-cols-4 gap-3">
                        {BODY_PARTS.map((part) => (
                          <button
                            key={part.name}
                            type="button"
                            onClick={() => handleBodyPartSelect(part.name)}
                            className={`
                              flex flex-col items-center p-3 rounded-lg transition-all duration-300 border text-center h-24
                              ${selectedBodyPart === part.name
                                ? 'bg-primary text-surface border-primary shadow-ambient'
                                : 'bg-surface-container-lowest border-primary/10 hover:border-primary/30 hover:shadow-md'
                              }
                            `}
                          >
                            <span className={`
                              material-symbols-outlined text-2xl mb-1
                              ${selectedBodyPart === part.name ? 'text-surface' : 'text-primary'}
                            `}>
                              {part.icon}
                            </span>
                            <span className={`
                              text-xs font-medium
                              ${selectedBodyPart === part.name ? 'text-surface' : 'text-primary'}
                            `}>
                              {part.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </Card>

                    {/* Symptom Details */}
                    <Card variant="low" size="md">
                      <CardHeader>
                        <CardTitle icon="edit_note" size="md">
                          Symptom Details
                        </CardTitle>
                      </CardHeader>
                      <div className="space-y-4">
                        <Textarea
                          label="Symptom Description"
                          placeholder="Describe your symptoms in detail..."
                          rows={3}
                          value={symptoms}
                          onChange={(e) => setSymptoms(e.target.value)}
                          required
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <Select
                            label="Duration"
                            options={DURATION_OPTIONS}
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                          />
                          <Select
                            label="Time Pattern"
                            options={TIME_OF_DAY_OPTIONS}
                            value={timeOfDay}
                            onChange={(e) => setTimeOfDay(e.target.value)}
                          />
                        </div>

                        {/* Severity Slider */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <label className="font-label text-sm uppercase tracking-widest text-primary font-bold">
                              Severity Level
                            </label>
                            <Badge variant="primary" size="sm">
                              {severity === 1 ? 'Minimal' : severity <= 3 ? 'Mild' : severity <= 6 ? 'Moderate' : severity <= 8 ? 'Severe' : 'Critical'} ({severity}/10)
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
                            <span>Minimal</span>
                            <span>Moderate</span>
                            <span>Critical</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Submit Button */}
                    <Card variant="primary" size="md">
                      <Button
                        type="submit"
                        variant="outline"
                        size="lg"
                        disabled={isLoading || !selectedBodyPart || !symptoms.trim()}
                        className="w-full h-12 border-surface/20 text-surface hover:bg-surface hover:text-primary"
                      >
                        {isLoading ? (
                          <>
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            Analyzing Symptoms...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">psychology</span>
                            Generate AI Analysis
                          </>
                        )}
                      </Button>
                    </Card>
                  </form>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-80 bg-surface-container-low border-l border-primary/10 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* AI Info */}
                  <Card variant="primary" size="sm">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-surface text-3xl mb-3 block">verified</span>
                      <h3 className="font-headline text-lg text-surface font-semibold mb-2">
                        AI-Powered Analysis
                      </h3>
                      <p className="text-surface/90 text-sm mb-4">
                        Advanced AI analyzes symptoms using Ayurvedic principles
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface/20 rounded-lg p-3">
                          <p className="text-xl font-bold text-surface">98.5%</p>
                          <p className="text-xs text-surface/80 uppercase tracking-wider">Accuracy</p>
                        </div>
                        <div className="bg-surface/20 rounded-lg p-3">
                          <p className="text-xl font-bold text-surface">{consultationHistory.length}</p>
                          <p className="text-xs text-surface/80 uppercase tracking-wider">Analyses</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Process Steps */}
                  <Card variant="low" size="sm">
                    <CardHeader>
                      <CardTitle icon="info" size="sm">How It Works</CardTitle>
                    </CardHeader>
                    <div className="space-y-3">
                      {[
                        { step: 1, title: 'Symptom Analysis', desc: 'AI processes symptoms using Ayurvedic patterns' },
                        { step: 2, title: 'Dosha Assessment', desc: 'Identifies Vata, Pitta, Kapha imbalances' },
                        { step: 3, title: 'Recommendations', desc: 'Generates personalized herb & lifestyle guidance' }
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary">{item.step}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-primary">{item.title}</p>
                            <p className="text-xs text-secondary">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeView === 'results' && currentResult && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Results Header */}
                <Card variant="primary" size="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-surface text-2xl">analytics</span>
                        <h2 className="font-headline text-2xl text-surface font-bold">
                          Analysis Complete
                        </h2>
                        <Badge variant="success" size="sm" className="bg-surface/20 text-surface">
                          <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                          Verified
                        </Badge>
                      </div>
                      <p className="text-surface/90 text-sm">
                        Generated on {formatDate(currentResult.timestamp)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetForm} className="border-surface/20 text-surface hover:bg-surface hover:text-primary">
                      <span className="material-symbols-outlined">refresh</span>
                      New Analysis
                    </Button>
                  </div>
                </Card>

                {/* Results Content */}
                <div className="grid grid-cols-12 gap-8">
                  {/* Main Results */}
                  <div className="col-span-8 space-y-6">
                    {/* Input Summary */}
                    <Card variant="low" size="lg">
                      <CardHeader>
                        <CardTitle icon="summarize" size="lg">Assessment Summary</CardTitle>
                      </CardHeader>
                      <div className="grid grid-cols-3 gap-6 mb-6">
                        <div className="text-center p-4 bg-surface-container rounded-xl">
                          <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Area</p>
                          <p className="text-lg font-semibold text-primary">{currentResult.inputData.bodyPart}</p>
                        </div>
                        <div className="text-center p-4 bg-surface-container rounded-xl">
                          <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Severity</p>
                          <p className="text-lg font-semibold text-primary">{currentResult.inputData.severity}/10</p>
                        </div>
                        <div className="text-center p-4 bg-surface-container rounded-xl">
                          <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Duration</p>
                          <p className="text-lg font-semibold text-primary">{currentResult.inputData.duration}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">Symptoms Described</p>
                        <p className="text-sm text-on-surface-variant leading-relaxed p-4 bg-surface-container rounded-xl">
                          {currentResult.inputData.symptoms}
                        </p>
                      </div>
                    </Card>

                    {/* AI Analysis */}
                    <Card variant="default" size="lg">
                      <CardHeader>
                        <CardTitle icon="psychology" size="lg">AI Analysis & Recommendations</CardTitle>
                      </CardHeader>
                      <div className="bg-surface-container-low rounded-xl p-6">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm text-on-surface leading-relaxed">
                            {currentResult.remedies}
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-4">
                      <Button variant="primary" size="lg" className="h-14">
                        <span className="material-symbols-outlined">download</span>
                        Download Report
                      </Button>
                      <Button variant="outline" size="lg" className="h-14">
                        <span className="material-symbols-outlined">share</span>
                        Share Results
                      </Button>
                      <Button variant="outline" size="lg" className="h-14" onClick={() => navigate('/herbs')}>
                        <span className="material-symbols-outlined">eco</span>
                        View Herbs
                      </Button>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="col-span-4 space-y-6">
                    {/* Quick Actions */}
                    <Card variant="high" size="md">
                      <CardHeader>
                        <CardTitle icon="bolt" size="md">Quick Actions</CardTitle>
                      </CardHeader>
                      <div className="space-y-3">
                        <Button variant="outline" size="md" className="w-full justify-start h-12">
                          <span className="material-symbols-outlined">schedule</span>
                          Schedule Follow-up
                        </Button>
                        <Button variant="outline" size="md" className="w-full justify-start h-12">
                          <span className="material-symbols-outlined">add_circle</span>
                          Save to Journal
                        </Button>
                        <Button variant="outline" size="md" className="w-full justify-start h-12">
                          <span className="material-symbols-outlined">notifications</span>
                          Set Reminder
                        </Button>
                      </div>
                    </Card>

                    {/* Disclaimer */}
                    <Card variant="secondary" size="md">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary text-2xl mt-1">info</span>
                        <div>
                          <h4 className="font-semibold text-secondary mb-3 text-lg">Medical Disclaimer</h4>
                          <p className="text-sm text-on-surface-variant leading-relaxed">
                            This AI analysis is for informational purposes only. Always consult qualified healthcare providers for proper diagnosis and treatment.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'history' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                <Card variant="low" size="lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle icon="history" size="lg">Consultation History</CardTitle>
                      <Badge variant="primary" size="lg">
                        {consultationHistory.length} Total
                      </Badge>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      View and manage your past consultations and analysis results
                    </p>
                  </CardHeader>
                </Card>

                {consultationHistory.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {consultationHistory.map((item, index) => (
                      <Card key={item.id || index} variant="default" size="lg" className="hover:shadow-ambient-lg transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-primary text-2xl">psychology</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-headline text-xl font-semibold text-primary mb-2">
                                {item.bodyPart}
                              </h3>
                              <p className="text-sm text-secondary mb-3">
                                {formatDate(item.createdAt)}
                              </p>
                              <p className="text-sm text-on-surface-variant line-clamp-2">
                                <strong>Symptoms:</strong> {item.symptoms}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="success" size="md">
                              Completed
                            </Badge>
                            <Button variant="primary" size="md">
                              <span className="material-symbols-outlined">visibility</span>
                              View Analysis
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card variant="default" size="xl">
                    <div className="text-center py-16">
                      <span className="material-symbols-outlined text-primary/20 text-8xl mb-6 block">
                        history
                      </span>
                      <h3 className="font-headline text-2xl text-primary mb-4">No History Yet</h3>
                      <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
                        Start your first consultation to build your health analysis history
                      </p>
                      <Button variant="primary" size="lg" onClick={() => setActiveView('form')}>
                        <span className="material-symbols-outlined">add</span>
                        Start New Consultation
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}