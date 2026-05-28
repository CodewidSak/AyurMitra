import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { useConsultationStore } from '../../../store/consultationStore'
import { ayurvedicService } from '../../../api/ayurvedicService'
import { Textarea, Select } from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { Card, CardHeader, CardTitle } from '../../../components/ui/Card'
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

export default function ConsultationProfessional() {
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
  const [activeTab, setActiveTab] = useState('consultation') // 'consultation', 'results', 'history'
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

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
      setActiveTab('results')
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
    setActiveTab('consultation')
    setSelectedHistoryItem(null)
  }

  const viewHistoryItem = (item) => {
    setSelectedHistoryItem(item)
    setActiveTab('results')
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

  const parseRemedies = (remediesText) => {
    if (!remediesText) return { herbs: [], lifestyle: [], precautions: [] }
    
    const sections = remediesText.split('\n\n')
    const herbs = []
    const lifestyle = []
    const precautions = []
    
    sections.forEach(section => {
      if (section.toLowerCase().includes('herb') || section.includes('•')) {
        const lines = section.split('\n').filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
        herbs.push(...lines.map(line => line.replace(/^[•-]\s*/, '').trim()))
      } else if (section.toLowerCase().includes('lifestyle') || section.toLowerCase().includes('practice')) {
        lifestyle.push(section.trim())
      } else if (section.toLowerCase().includes('precaution') || section.toLowerCase().includes('avoid')) {
        precautions.push(section.trim())
      }
    })
    
    return { herbs, lifestyle, precautions }
  }

  return (
    <MainLayout breadcrumb={{ section: 'AI Consultation', page: 'Professional Analysis' }}>
      <div className="min-h-screen">
        {/* Header with Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-headline text-4xl text-primary font-bold mb-2">
                AI-Powered Ayurvedic Consultation
              </h1>
              <p className="text-lg text-on-surface-variant">
                Professional symptom analysis with personalized Ayurvedic recommendations
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" size="sm">
                <span className="material-symbols-outlined text-sm mr-1">verified</span>
                AI Certified
              </Badge>
              <Badge variant="outline" size="sm">
                98.5% Accuracy
              </Badge>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('consultation')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${activeTab === 'consultation'
                  ? 'bg-primary text-surface shadow-ambient'
                  : 'text-primary hover:bg-primary/10'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">psychology</span>
              New Consultation
            </button>
            <button
              onClick={() => setActiveTab('results')}
              disabled={!currentResult && !selectedHistoryItem}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${activeTab === 'results'
                  ? 'bg-primary text-surface shadow-ambient'
                  : 'text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">analytics</span>
              Analysis Results
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300
                ${activeTab === 'history'
                  ? 'bg-primary text-surface shadow-ambient'
                  : 'text-primary hover:bg-primary/10'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">history</span>
              Past Analysis ({consultationHistory.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'consultation' && (
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div className="col-span-7">
              <Card variant="low" size="lg">
                <CardHeader>
                  <CardTitle icon="medical_information" size="lg">
                    Symptom Assessment Form
                  </CardTitle>
                  <p className="text-sm text-on-surface-variant">
                    Provide detailed information for accurate Ayurvedic analysis
                  </p>
                </CardHeader>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-error-container/20 rounded-xl border-l-4 border-error">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-error">warning</span>
                      <p className="text-sm text-on-error-container font-medium">{error}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Body Part Selection */}
                  <div>
                    <label className="font-label text-sm uppercase tracking-widest text-primary font-bold mb-4 block">
                      1. Select Affected Area
                    </label>
                    <Grid cols={2} gap={4}>
                      {BODY_PARTS.map((part) => (
                        <button
                          key={part.name}
                          type="button"
                          onClick={() => handleBodyPartSelect(part.name)}
                          className={`
                            group flex items-center p-4 rounded-xl transition-all duration-300 ease-calm border text-left
                            ${selectedBodyPart === part.name
                              ? 'bg-primary text-surface border-primary shadow-ambient'
                              : 'bg-surface-container-lowest border-primary/10 hover:border-primary/30 hover:shadow-md'
                            }
                          `}
                        >
                          <div className={`
                            w-12 h-12 rounded-lg flex items-center justify-center mr-4 transition-colors
                            ${selectedBodyPart === part.name
                              ? 'bg-surface/20'
                              : 'bg-primary/10 group-hover:bg-primary/20'
                            }
                          `}>
                            <span className={`
                              material-symbols-outlined text-xl
                              ${selectedBodyPart === part.name ? 'text-surface' : 'text-primary'}
                            `}>
                              {part.icon}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`
                              font-headline text-sm font-semibold block mb-1
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

                  {/* Symptom Details */}
                  <div className="space-y-6">
                    <label className="font-label text-sm uppercase tracking-widest text-primary font-bold block">
                      2. Symptom Details
                    </label>
                    
                    <Textarea
                      label="Detailed Symptom Description"
                      placeholder="Describe your symptoms in detail, including intensity, frequency, and any patterns you've noticed..."
                      rows={4}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      required
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <Select
                        label="Duration of Symptoms"
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

                    {/* Severity Assessment */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="font-label text-sm uppercase tracking-widest text-primary font-bold">
                          3. Severity Assessment
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
                        className="w-full h-3 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
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

                  {/* Submit Button */}
                  <div className="pt-6 border-t border-primary/10">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isLoading || !selectedBodyPart || !symptoms.trim()}
                      className="w-full"
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
                    <p className="text-center text-xs text-on-surface-variant mt-3">
                      Analysis typically takes 5-10 seconds • Results are for informational purposes only
                    </p>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Column: Quick Stats */}
            <div className="col-span-5 space-y-6">
              <Card variant="primary" size="md">
                <div className="text-center">
                  <span className="material-symbols-outlined text-surface text-4xl mb-4 block">verified</span>
                  <h3 className="font-headline text-xl text-surface font-semibold mb-2">
                    AI-Powered Analysis
                  </h3>
                  <p className="text-surface/90 text-sm mb-4">
                    Our advanced AI system analyzes your symptoms using traditional Ayurvedic principles combined with modern diagnostic patterns.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-surface/20 rounded-lg p-3">
                      <p className="text-2xl font-bold text-surface">98.5%</p>
                      <p className="text-xs text-surface/80">Accuracy Rate</p>
                    </div>
                    <div className="bg-surface/20 rounded-lg p-3">
                      <p className="text-2xl font-bold text-surface">{consultationHistory.length}</p>
                      <p className="text-xs text-surface/80">Your Analyses</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="low" size="md">
                <CardHeader>
                  <CardTitle icon="info" size="md">Analysis Process</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Symptom Analysis</p>
                      <p className="text-xs text-secondary">AI processes your symptoms using Ayurvedic diagnostic patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Dosha Assessment</p>
                      <p className="text-xs text-secondary">Identifies imbalances in Vata, Pitta, and Kapha</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">Personalized Recommendations</p>
                      <p className="text-xs text-secondary">Generates herbs, lifestyle, and dietary guidance</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'results' && (currentResult || selectedHistoryItem) && (
          <div className="space-y-8">
            {/* Results Header */}
            <Card variant="primary" size="lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-surface text-2xl">analytics</span>
                    <h2 className="font-headline text-2xl text-surface font-bold">
                      Analysis Results
                    </h2>
                    <Badge variant="success" size="sm" className="bg-surface/20 text-surface">
                      <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                      Complete
                    </Badge>
                  </div>
                  <p className="text-surface/90">
                    Generated on {formatDate((currentResult || selectedHistoryItem)?.timestamp || (currentResult || selectedHistoryItem)?.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <Button variant="outline" size="sm" onClick={resetForm} className="border-surface/20 text-surface hover:bg-surface hover:text-primary">
                    <span className="material-symbols-outlined">refresh</span>
                    New Analysis
                  </Button>
                </div>
              </div>
            </Card>

            {/* Analysis Content */}
            <div className="grid grid-cols-12 gap-8">
              {/* Main Results */}
              <div className="col-span-8 space-y-6">
                {/* Input Summary */}
                <Card variant="low" size="md">
                  <CardHeader>
                    <CardTitle icon="summarize" size="md">Input Summary</CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Affected Area</p>
                      <p className="text-sm font-semibold text-primary">
                        {(currentResult?.inputData?.bodyPart || selectedHistoryItem?.bodyPart)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Severity Level</p>
                      <p className="text-sm font-semibold text-primary">
                        {(currentResult?.inputData?.severity || '5')}/10
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">Symptoms Described</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        {(currentResult?.inputData?.symptoms || selectedHistoryItem?.symptoms)}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* AI Analysis */}
                <Card variant="default" size="md">
                  <CardHeader>
                    <CardTitle icon="psychology" size="md">AI Analysis & Recommendations</CardTitle>
                  </CardHeader>
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-on-surface leading-relaxed">
                      {(currentResult?.remedies || selectedHistoryItem?.aiResponse)}
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button variant="primary" size="md" className="flex-1">
                    <span className="material-symbols-outlined">download</span>
                    Download Report
                  </Button>
                  <Button variant="outline" size="md" className="flex-1">
                    <span className="material-symbols-outlined">share</span>
                    Share with Doctor
                  </Button>
                  <Button variant="outline" size="md" onClick={() => navigate('/herbs')}>
                    <span className="material-symbols-outlined">eco</span>
                    View Herb Library
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-span-4 space-y-6">
                {/* Quick Actions */}
                <Card variant="high" size="md">
                  <CardHeader>
                    <CardTitle icon="bolt" size="sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="material-symbols-outlined">schedule</span>
                      Schedule Follow-up
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="material-symbols-outlined">add_circle</span>
                      Add to Health Journal
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="material-symbols-outlined">notifications</span>
                      Set Reminder
                    </Button>
                  </div>
                </Card>

                {/* Disclaimer */}
                <Card variant="secondary" size="md">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-secondary text-xl mt-1">info</span>
                    <div>
                      <h4 className="font-semibold text-secondary mb-2">Medical Disclaimer</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">
                        This AI analysis is for informational purposes only and should not replace professional medical advice. 
                        Consult with a qualified healthcare provider for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <Card variant="low" size="md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle icon="history" size="lg">Consultation History</CardTitle>
                  <Badge variant="primary" size="sm">
                    {consultationHistory.length} Total Analyses
                  </Badge>
                </div>
                <p className="text-sm text-on-surface-variant">
                  View and manage your past AI consultations and analysis results
                </p>
              </CardHeader>
            </Card>

            {consultationHistory.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {consultationHistory.map((item, index) => (
                  <Card key={item.id || index} variant="default" size="md" className="hover:shadow-ambient-lg transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary">psychology</span>
                          </div>
                          <div>
                            <h3 className="font-headline text-lg font-semibold text-primary">
                              {item.bodyPart}
                            </h3>
                            <p className="text-sm text-secondary">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">
                          <strong>Symptoms:</strong> {item.symptoms}
                        </p>
                        <div className="flex items-center gap-4">
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => viewHistoryItem(item)}
                          >
                            <span className="material-symbols-outlined">visibility</span>
                            View Analysis
                          </Button>
                          <Button variant="outline" size="sm">
                            <span className="material-symbols-outlined">download</span>
                            Export
                          </Button>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        Completed
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card variant="default" size="lg">
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-primary/20 text-6xl mb-4 block">
                    history
                  </span>
                  <h3 className="font-headline text-xl text-primary mb-2">No Consultation History</h3>
                  <p className="text-on-surface-variant mb-6">
                    Start your first AI consultation to build your health analysis history
                  </p>
                  <Button variant="primary" onClick={() => setActiveTab('consultation')}>
                    <span className="material-symbols-outlined">add</span>
                    Start New Consultation
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  )
}