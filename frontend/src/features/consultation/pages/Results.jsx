import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { Card } from '../../../components/ui/Card'
import ProgressBar from '../../../components/ui/ProgressBar'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'

export default function Results() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('analysis')

  // Mock data - replace with actual data from consultation
  const result = {
    bodyPart: 'Head & Mind',
    confidence: 95,
    condition: 'Vata Imbalance - Stress-induced Tension',
    severity: 'Moderate',
    doshaImpact: {
      vata: 75,
      pitta: 20,
      kapha: 5,
    },
    recommendations: [
      {
        category: 'Dietary',
        icon: 'restaurant',
        items: [
          { do: 'Warm, cooked foods', dont: 'Cold, raw foods' },
          { do: 'Sweet fruits (dates, figs)', dont: 'Fermented foods' },
          { do: 'Ghee and healthy fats', dont: 'Caffeine and alcohol' },
        ]
      },
      {
        category: 'Lifestyle',
        icon: 'self_improvement',
        items: [
          'Establish regular sleep schedule (10 PM - 6 AM)',
          'Practice daily meditation (15-20 minutes)',
          'Gentle yoga or stretching in the morning',
          'Warm oil massage (Abhyanga) before bath',
        ]
      },
      {
        category: 'Herbal Remedies',
        icon: 'eco',
        items: [
          'Ashwagandha (500mg twice daily)',
          'Brahmi tea before bedtime',
          'Triphala for digestive support',
        ]
      },
    ],
    precautions: [
      'Avoid excessive screen time, especially before bed',
      'Reduce multitasking and mental overload',
      'Consult a physician if symptoms persist beyond 2 weeks',
    ],
    followUp: {
      timeline: '2 weeks',
      trackSymptoms: true,
    }
  }

  const tabs = [
    { id: 'analysis', label: 'Ayurvedic Analysis', icon: 'analytics' },
    { id: 'recommendations', label: 'Recommendations', icon: 'recommend' },
    { id: 'precautions', label: 'Precautions', icon: 'warning' },
    { id: 'followup', label: 'Follow-up', icon: 'event' },
  ]

  return (
    <MainLayout breadcrumb={{ section: 'Consultation', page: 'Analysis Results' }}>
      {/* Header Summary */}
      <section className="mb-12">
        <div className="bg-surface-container-lowest rounded-2xl p-10 border border-primary/5 shadow-ambient">
          <div className="flex items-start justify-between mb-6">
            <div>
              <span className="font-label text-xs uppercase tracking-widest text-secondary mb-2 block">
                Analysis Results
              </span>
              <h1 className="font-headline text-4xl text-primary mb-2">
                {result.condition}
              </h1>
              <p className="text-on-surface-variant">
                Based on your symptoms for <span className="font-bold text-primary">{result.bodyPart}</span>
              </p>
            </div>
            <div className="text-right">
              <Badge variant="success" size="lg">
                {result.confidence}% Confidence
              </Badge>
              <p className="text-xs text-secondary mt-2">
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-primary/5">
            <div>
              <p className="font-label text-xs uppercase tracking-widest text-secondary mb-2">Severity</p>
              <p className="text-2xl font-bold text-primary">{result.severity}</p>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-widest text-secondary mb-2">Primary Dosha</p>
              <p className="text-2xl font-bold text-primary">Vata</p>
            </div>
            <div>
              <p className="font-label text-xs uppercase tracking-widest text-secondary mb-2">Recommended Action</p>
              <p className="text-2xl font-bold text-primary">Lifestyle Changes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabbed Content */}
      <section>
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-primary/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 font-medium transition-all ease-calm
                border-b-2 -mb-px
                ${activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-secondary hover:text-primary hover:bg-surface-container-low'
                }
              `}
            >
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              <span className="font-label text-sm uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Ayurvedic Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="grid grid-cols-12 gap-8">
              {/* Dosha Impact */}
              <div className="col-span-12 md:col-span-5">
                <Card variant="high" className="sticky top-24">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <span className="font-label text-xs uppercase tracking-widest text-secondary">
                        Dosha Imbalance
                      </span>
                      <h3 className="font-headline text-2xl text-primary mt-1">Vata Dominant</h3>
                    </div>
                    <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
                  </div>

                  <div className="space-y-6">
                    <ProgressBar label="Vata" value={result.doshaImpact.vata} variant="primary" />
                    <ProgressBar label="Pitta" value={result.doshaImpact.pitta} variant="secondary" />
                    <ProgressBar label="Kapha" value={result.doshaImpact.kapha} variant="botanical" />
                  </div>

                  <div className="mt-8 pt-6 border-t border-primary/5">
                    <p className="text-sm text-on-surface-variant leading-relaxed italic">
                      Vata governs movement and communication in the body. When imbalanced, it manifests as anxiety, 
                      restlessness, and irregular patterns. The elevated Vata requires grounding and calming practices.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Properties */}
              <div className="col-span-12 md:col-span-7 space-y-6">
                <Card variant="low">
                  <div className="relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 text-primary/5 font-serif text-9xl">01</div>
                    <h3 className="font-headline text-2xl text-primary mb-4 italic relative">Rasa & Virya</h3>
                    <div className="space-y-4 relative">
                      <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                        <span className="font-label text-xs uppercase tracking-wider text-secondary">Rasa (Taste)</span>
                        <span className="font-serif text-primary">Tikta (Bitter), Kashaya (Astringent)</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-primary/10 pb-2">
                        <span className="font-label text-xs uppercase tracking-wider text-secondary">Virya (Potency)</span>
                        <span className="font-serif text-primary">Ushna (Heating)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-label text-xs uppercase tracking-wider text-secondary">Vipaka (Post-digestive)</span>
                        <span className="font-serif text-primary">Madhura (Sweet)</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card variant="primary">
                  <h3 className="font-headline text-2xl mb-4 italic text-surface">Root Cause Analysis</h3>
                  <p className="text-surface/90 text-sm leading-relaxed">
                    The imbalance stems from irregular routines, excessive mental activity, and insufficient grounding practices. 
                    Vata's mobile and cold qualities have increased, requiring warm, stable, and nourishing interventions to restore balance.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-8">
              {result.recommendations.map((rec, index) => (
                <Card key={index} variant="low">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <span className="material-symbols-outlined text-primary text-2xl">{rec.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-headline text-2xl text-primary">{rec.category}</h3>
                      <p className="text-sm text-secondary">Personalized recommendations for your constitution</p>
                    </div>
                  </div>

                  {rec.items[0]?.do ? (
                    // Dietary format with do's and don'ts
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-tertiary">check_circle</span>
                          <h4 className="font-bold text-primary uppercase text-sm tracking-wider">Include</h4>
                        </div>
                        <ul className="space-y-2">
                          {rec.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                              <span className="text-tertiary mt-1">•</span>
                              <span>{item.do}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="material-symbols-outlined text-error">cancel</span>
                          <h4 className="font-bold text-primary uppercase text-sm tracking-wider">Avoid</h4>
                        </div>
                        <ul className="space-y-2">
                          {rec.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                              <span className="text-error mt-1">•</span>
                              <span>{item.dont}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    // Simple list format
                    <ul className="space-y-3">
                      {rec.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-surface rounded-xl hover:translate-x-2 transition-transform ease-calm">
                          <span className="material-symbols-outlined text-primary mt-0.5">arrow_right</span>
                          <span className="text-sm text-on-surface">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Precautions Tab */}
          {activeTab === 'precautions' && (
            <Card variant="low" className="border-l-4 border-error">
              <div className="flex items-center gap-4 mb-8">
                <span className="material-symbols-outlined text-error text-4xl">warning</span>
                <h2 className="font-headline text-3xl text-on-error-container">Clinical Precautions</h2>
              </div>

              <ul className="space-y-6">
                {result.precautions.map((precaution, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-error mt-1">fiber_manual_record</span>
                    <div>
                      <p className="text-sm text-on-surface leading-relaxed">{precaution}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-6 bg-error-container/10 rounded-xl">
                <p className="text-sm text-on-error-container font-medium">
                  <span className="font-bold">Important:</span> This analysis is for informational purposes only and does not replace professional medical advice. 
                  Consult with a qualified Ayurvedic practitioner or physician for personalized treatment.
                </p>
              </div>
            </Card>
          )}

          {/* Follow-up Tab */}
          {activeTab === 'followup' && (
            <div className="grid grid-cols-2 gap-8">
              <Card variant="low">
                <span className="material-symbols-outlined text-primary text-4xl mb-6 block">event</span>
                <h3 className="font-headline text-2xl text-primary mb-4">Suggested Timeline</h3>
                <p className="text-on-surface-variant mb-6">
                  Follow the recommendations for <span className="font-bold text-primary">{result.followUp.timeline}</span> and 
                  reassess your symptoms.
                </p>
                <Button variant="primary" className="w-full">
                  Schedule Follow-up
                  <span className="material-symbols-outlined">calendar_add_on</span>
                </Button>
              </Card>

              <Card variant="low">
                <span className="material-symbols-outlined text-secondary text-4xl mb-6 block">monitoring</span>
                <h3 className="font-headline text-2xl text-primary mb-4">Track Progress</h3>
                <p className="text-on-surface-variant mb-6">
                  Monitor your symptoms daily to identify patterns and measure improvement.
                </p>
                <Button variant="secondary" className="w-full">
                  Start Symptom Tracker
                  <span className="material-symbols-outlined">add_circle</span>
                </Button>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Action Buttons */}
      <section className="mt-12 flex gap-4 justify-center">
        <Button variant="outline" onClick={() => navigate('/consultation')}>
          <span className="material-symbols-outlined">refresh</span>
          New Consultation
        </Button>
        <Button variant="primary">
          <span className="material-symbols-outlined">download</span>
          Download Report
        </Button>
        <Button variant="secondary">
          <span className="material-symbols-outlined">share</span>
          Share with Doctor
        </Button>
      </section>
    </MainLayout>
  )
}
