import React, { useState } from 'react'
import { 
  Leaf, 
  Utensils, 
  AlertCircle, 
  Activity, 
  Heart, 
  Brain, 
  Sun, 
  Moon,
  Droplets,
  Star,
  Download,
  Share2,
  BookOpen,
  Clock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { BentoGrid, BentoItem, GlassCard, GlassButton } from '../../../components/ui/GlassCard'

export default function AyurvedicResult({ result, onNewConsultation }) {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Heart,
      color: 'from-teal-500 to-green-500'
    },
    {
      id: 'remedies',
      title: 'Remedies & Herbs',
      icon: Leaf,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'diet',
      title: 'Diet & Nutrition',
      icon: Utensils,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'precautions',
      title: 'Precautions',
      icon: AlertCircle,
      color: 'from-red-500 to-pink-500'
    }
  ]

  const getDoshaInfo = (dosha) => {
    const doshaData = {
      'Vata': {
        icon: Brain,
        color: 'from-purple-500 to-indigo-500',
        element: 'Air & Space',
        qualities: 'Dry, Light, Cold, Rough, Subtle, Mobile'
      },
      'Pitta': {
        icon: Sun,
        color: 'from-red-500 to-orange-500',
        element: 'Fire & Water',
        qualities: 'Hot, Sharp, Light, Oily, Liquid, Mobile'
      },
      'Kapha': {
        icon: Droplets,
        color: 'from-blue-500 to-teal-500',
        element: 'Earth & Water',
        qualities: 'Heavy, Slow, Cool, Oily, Smooth, Dense'
      }
    }
    return doshaData[dosha] || doshaData['Vata']
  }

  const renderOverview = () => (
    <BentoGrid>
      <BentoItem colSpan="col-span-8" className="bg-gradient-to-br from-teal-500/10 to-green-500/10 border-teal-200/50">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500 p-3 rounded-xl">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-charcoal-800">Consultation Summary</h2>
              <p className="text-charcoal-600">
                Analysis for <span className="font-semibold text-teal-600">{result.bodyPart}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-charcoal-800 mb-3">Reported Symptoms</h3>
            <p className="text-charcoal-700">{result.symptoms}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-teal-600" size={20} />
                <h4 className="font-semibold text-charcoal-800">Assessment Date</h4>
              </div>
              <p className="text-charcoal-700">{new Date().toLocaleDateString()}</p>
            </div>

            <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <Star className="text-yellow-500" size={20} />
                <h4 className="font-semibold text-charcoal-800">Confidence Score</h4>
              </div>
              <p className="text-charcoal-700">94% Match</p>
            </div>
          </div>
        </div>
      </BentoItem>

      <BentoItem colSpan="col-span-4">
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-xl">
            <Brain className="text-white mx-auto mb-2" size={32} />
            <h3 className="text-white font-bold">Primary Dosha</h3>
          </div>
          <div>
            <h4 className="text-xl font-bold text-charcoal-800">Vata Imbalance</h4>
            <p className="text-charcoal-600 text-sm">Air & Space Elements</p>
            <div className="mt-3 text-xs text-charcoal-500">
              Qualities: Dry, Light, Cold, Mobile
            </div>
          </div>
        </div>
      </BentoItem>
    </BentoGrid>
  )

  const renderRemedies = () => (
    <div className="space-y-6">
      <BentoGrid>
        <BentoItem colSpan="col-span-6" className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Leaf className="text-green-600" size={24} />
              <h3 className="text-xl font-bold text-charcoal-800">Recommended Herbs</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-charcoal-800">Ashwagandha</h4>
                    <p className="text-sm text-charcoal-600">अश्वगंधा (Withania somnifera)</p>
                  </div>
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                    Adaptogen
                  </div>
                </div>
                <p className="text-sm text-charcoal-700 mb-2">
                  Reduces stress and anxiety, improves energy levels, supports nervous system health.
                </p>
                <div className="text-xs text-charcoal-600">
                  <strong>Dosage:</strong> 300-600mg daily with warm milk
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-charcoal-800">Brahmi</h4>
                    <p className="text-sm text-charcoal-600">ब्राह्मी (Bacopa monnieri)</p>
                  </div>
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">
                    Nootropic
                  </div>
                </div>
                <p className="text-sm text-charcoal-700 mb-2">
                  Enhances memory and cognitive function, calms the mind, supports brain health.
                </p>
                <div className="text-xs text-charcoal-600">
                  <strong>Dosage:</strong> 300-600mg daily with meals
                </div>
              </div>
            </div>
          </div>
        </BentoItem>

        <BentoItem colSpan="col-span-6" className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-charcoal-800">Yoga & Pranayama</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-charcoal-800 mb-2">Child's Pose (Balasana)</h4>
                <p className="text-sm text-charcoal-700 mb-2">
                  Calms the nervous system, relieves stress and anxiety, grounds Vata energy.
                </p>
                <div className="text-xs text-charcoal-600">
                  <strong>Duration:</strong> Hold for 2-5 minutes, focus on deep breathing
                </div>
              </div>

              <div className="bg-white/50 rounded-xl p-4 backdrop-blur-sm">
                <h4 className="font-semibold text-charcoal-800 mb-2">Alternate Nostril Breathing</h4>
                <p className="text-sm text-charcoal-700 mb-2">
                  Balances the nervous system, reduces anxiety, harmonizes left and right brain.
                </p>
                <div className="text-xs text-charcoal-600">
                  <strong>Practice:</strong> 5-10 rounds, twice daily
                </div>
              </div>
            </div>
          </div>
        </BentoItem>
      </BentoGrid>
    </div>
  )

  const renderLifestyle = () => (
    <BentoGrid>
      <BentoItem colSpan="col-span-12" className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-charcoal-800">Lifestyle Recommendations</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-charcoal-800 flex items-center gap-2">
                <Sun className="text-orange-500" size={20} />
                Daily Routine (Dinacharya)
              </h4>
              <div className="space-y-2">
                <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm font-medium text-charcoal-800">Wake up: 5:30-6:00 AM</div>
                  <div className="text-xs text-charcoal-600">During Brahma Muhurta for optimal energy</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm font-medium text-charcoal-800">Sleep: 9:30-10:00 PM</div>
                  <div className="text-xs text-charcoal-600">Consistent sleep schedule balances Vata</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm font-medium text-charcoal-800">Oil Massage (Abhyanga)</div>
                  <div className="text-xs text-charcoal-600">3x weekly with warm sesame oil</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-charcoal-800 flex items-center gap-2">
                <Brain className="text-purple-500" size={20} />
                Mental Wellness
              </h4>
              <div className="space-y-2">
                <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm font-medium text-charcoal-800">Meditation: 10-20 minutes daily</div>
                  <div className="text-xs text-charcoal-600">Calms Vata and reduces anxiety</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm font-medium text-charcoal-800">Pranayama: Morning & evening</div>
                  <div className="text-xs text-charcoal-600">Nadi Shodhana for nervous system balance</div>
                </div>
                <div className="bg-white/50 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-sm font-medium text-charcoal-800">Limit screen time before bed</div>
                  <div className="text-xs text-charcoal-600">Reduces mental stimulation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BentoItem>
    </BentoGrid>
  )

  const renderDiet = () => (
    <BentoGrid>
      <BentoItem colSpan="col-span-12" className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-200/50">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Utensils className="text-orange-600" size={24} />
            <h3 className="text-xl font-bold text-charcoal-800">Dietary Guidelines</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-700 text-center">✓ Favor These Foods</h4>
              <div className="space-y-2">
                {[
                  'Warm, cooked, moist foods',
                  'Sweet, sour, and salty tastes',
                  'Healthy fats (ghee, sesame oil)',
                  'Warm milk with spices',
                  'Cooked grains and vegetables',
                  'Nuts and seeds (soaked)'
                ].map((item, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-2 text-sm text-green-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-red-700 text-center">✗ Avoid These Foods</h4>
              <div className="space-y-2">
                {[
                  'Cold, dry, raw foods',
                  'Excessive bitter, pungent tastes',
                  'Carbonated drinks',
                  'Processed and packaged foods',
                  'Irregular meal timing',
                  'Eating while distracted'
                ].map((item, index) => (
                  <div key={index} className="bg-red-50 rounded-lg p-2 text-sm text-red-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-blue-700 text-center">⏰ Meal Timing</h4>
              <div className="space-y-2">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="font-medium text-blue-800">Breakfast</div>
                  <div className="text-sm text-blue-600">7:00-8:00 AM</div>
                  <div className="text-xs text-blue-500">Warm, nourishing foods</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="font-medium text-blue-800">Lunch</div>
                  <div className="text-sm text-blue-600">12:00-1:00 PM</div>
                  <div className="text-xs text-blue-500">Largest meal of the day</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="font-medium text-blue-800">Dinner</div>
                  <div className="text-sm text-blue-600">6:00-7:00 PM</div>
                  <div className="text-xs text-blue-500">Light, easily digestible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BentoItem>
    </BentoGrid>
  )

  const renderPrecautions = () => (
    <BentoGrid>
      <BentoItem colSpan="col-span-12" className="bg-gradient-to-br from-red-500/10 to-pink-500/10 border-red-200/50">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600" size={24} />
            <h3 className="text-xl font-bold text-charcoal-800">Important Precautions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-yellow-800 mb-3">⚠️ General Precautions</h4>
              <ul className="space-y-2 text-sm text-yellow-700">
                <li>• Consult qualified Ayurvedic practitioner for personalized treatment</li>
                <li>• Start herbs with small doses and monitor body's response</li>
                <li>• Inform all healthcare providers about supplements</li>
                <li>• Maintain regular follow-ups for chronic conditions</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-semibold text-red-800 mb-3">🚨 Seek Medical Attention If:</h4>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Symptoms worsen or persist beyond 2 weeks</li>
                <li>• Severe pain or discomfort develops</li>
                <li>• Signs of allergic reactions to herbs</li>
                <li>• Any concerning new symptoms appear</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-3">📋 Disclaimer</h4>
            <p className="text-sm text-blue-700">
              This analysis is based on Ayurvedic principles and should complement, not replace, 
              conventional medical care. Always consult qualified healthcare professionals for 
              proper diagnosis and treatment of medical conditions.
            </p>
          </div>
        </div>
      </BentoItem>
    </BentoGrid>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview()
      case 'remedies': return renderRemedies()
      case 'lifestyle': return renderLifestyle()
      case 'diet': return renderDiet()
      case 'precautions': return renderPrecautions()
      default: return renderOverview()
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Actions */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-charcoal-800">Your Ayurvedic Analysis</h2>
            <p className="text-charcoal-600">Comprehensive recommendations for holistic healing</p>
          </div>
          
          <div className="flex items-center gap-3">
            <GlassButton variant="secondary" size="sm" className="flex items-center gap-2">
              <Download size={16} />
              Export PDF
            </GlassButton>
            <GlassButton variant="secondary" size="sm" className="flex items-center gap-2">
              <Share2 size={16} />
              Share
            </GlassButton>
            <GlassButton variant="primary" onClick={onNewConsultation}>
              New Consultation
            </GlassButton>
          </div>
        </div>
      </GlassCard>

      {/* Navigation Tabs */}
      <GlassCard className="p-2">
        <div className="flex space-x-2 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <GlassButton
                key={section.id}
                variant={activeSection === section.id ? 'primary' : 'ghost'}
                onClick={() => setActiveSection(section.id)}
                className="flex items-center gap-2 px-4 py-3 whitespace-nowrap"
              >
                <Icon size={18} />
                {section.title}
              </GlassButton>
            )
          })}
        </div>
      </GlassCard>

      {/* Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  )
}
