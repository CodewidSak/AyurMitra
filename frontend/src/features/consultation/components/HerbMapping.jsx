import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, 
  Search, 
  Filter, 
  Star, 
  Info, 
  Heart, 
  Brain, 
  Shield,
  Zap,
  Droplets,
  Sun
} from 'lucide-react'
import { BentoGrid, BentoItem, GlassCard, GlassButton } from '../../../components/ui/GlassCard'

const ayurvedicHerbs = [
  {
    id: 1,
    name: 'Ashwagandha',
    sanskrit: 'अश्वगंधा',
    scientificName: 'Withania somnifera',
    category: 'Adaptogen',
    dosha: ['Vata', 'Kapha'],
    properties: ['Stress Relief', 'Energy Boost', 'Immunity'],
    image: '/api/placeholder/300/200',
    color: 'from-green-500 to-emerald-500',
    rating: 4.8,
    description: 'Known as Indian Winter Cherry, this powerful adaptogen helps the body manage stress and boosts energy levels.',
    benefits: [
      'Reduces cortisol levels',
      'Improves sleep quality',
      'Enhances physical performance',
      'Supports immune function'
    ],
    dosage: '300-600mg daily',
    precautions: 'Avoid during pregnancy. Consult doctor if on thyroid medication.',
    bodyParts: ['Brain', 'Adrenals', 'Muscles']
  },
  {
    id: 2,
    name: 'Turmeric',
    sanskrit: 'हरिद्रा',
    scientificName: 'Curcuma longa',
    category: 'Anti-inflammatory',
    dosha: ['Pitta', 'Kapha'],
    properties: ['Anti-inflammatory', 'Antioxidant', 'Digestive'],
    image: '/api/placeholder/300/200',
    color: 'from-yellow-500 to-orange-500',
    rating: 4.9,
    description: 'Golden spice with powerful anti-inflammatory and antioxidant properties.',
    benefits: [
      'Reduces inflammation',
      'Supports joint health',
      'Aids digestion',
      'Boosts immunity'
    ],
    dosage: '500-1000mg daily with black pepper',
    precautions: 'May increase bleeding risk. Avoid with blood thinners.',
    bodyParts: ['Joints', 'Digestive System', 'Liver']
  },
  {
    id: 3,
    name: 'Brahmi',
    sanskrit: 'ब्राह्मी',
    scientificName: 'Bacopa monnieri',
    category: 'Nootropic',
    dosha: ['Vata', 'Pitta'],
    properties: ['Memory Enhancement', 'Cognitive Support', 'Stress Relief'],
    image: '/api/placeholder/300/200',
    color: 'from-blue-500 to-purple-500',
    rating: 4.7,
    description: 'Sacred herb for enhancing memory, focus, and cognitive function.',
    benefits: [
      'Improves memory and learning',
      'Reduces anxiety',
      'Enhances cognitive function',
      'Supports nervous system'
    ],
    dosage: '300-600mg daily',
    precautions: 'May cause drowsiness initially. Take with food.',
    bodyParts: ['Brain', 'Nervous System']
  },
  {
    id: 4,
    name: 'Triphala',
    sanskrit: 'त्रिफला',
    scientificName: 'Three fruits combination',
    category: 'Digestive Tonic',
    dosha: ['Vata', 'Pitta', 'Kapha'],
    properties: ['Digestive Health', 'Detoxification', 'Antioxidant'],
    image: '/api/placeholder/300/200',
    color: 'from-red-500 to-pink-500',
    rating: 4.6,
    description: 'Traditional combination of three fruits for digestive health and detoxification.',
    benefits: [
      'Improves digestion',
      'Gentle detoxification',
      'Rich in antioxidants',
      'Supports eye health'
    ],
    dosage: '500-1000mg before bed',
    precautions: 'Start with lower dose. May cause loose stools initially.',
    bodyParts: ['Digestive System', 'Colon', 'Eyes']
  },
  {
    id: 5,
    name: 'Guduchi',
    sanskrit: 'गुडूची',
    scientificName: 'Tinospora cordifolia',
    category: 'Immunomodulator',
    dosha: ['Pitta', 'Kapha'],
    properties: ['Immunity Boost', 'Liver Support', 'Anti-inflammatory'],
    image: '/api/placeholder/300/200',
    color: 'from-teal-500 to-cyan-500',
    rating: 4.5,
    description: 'Divine nectar for immunity and liver health, known as the "root of immortality".',
    benefits: [
      'Boosts immune system',
      'Supports liver function',
      'Reduces inflammation',
      'Helps manage diabetes'
    ],
    dosage: '250-500mg daily',
    precautions: 'Generally safe. Consult doctor if diabetic.',
    bodyParts: ['Immune System', 'Liver', 'Pancreas']
  },
  {
    id: 6,
    name: 'Shatavari',
    sanskrit: 'शतावरी',
    scientificName: 'Asparagus racemosus',
    category: 'Reproductive Tonic',
    dosha: ['Vata', 'Pitta'],
    properties: ['Hormonal Balance', 'Reproductive Health', 'Digestive Support'],
    image: '/api/placeholder/300/200',
    color: 'from-pink-500 to-rose-500',
    rating: 4.4,
    description: 'Queen of herbs for women\'s health and hormonal balance.',
    benefits: [
      'Supports reproductive health',
      'Balances hormones',
      'Aids lactation',
      'Soothes digestive tract'
    ],
    dosage: '500-1000mg daily',
    precautions: 'Generally safe. Consult during pregnancy.',
    bodyParts: ['Reproductive System', 'Digestive System']
  }
]

const categories = ['All', 'Adaptogen', 'Anti-inflammatory', 'Nootropic', 'Digestive Tonic', 'Immunomodulator', 'Reproductive Tonic']
const doshas = ['All', 'Vata', 'Pitta', 'Kapha']

export default function HerbMapping() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDosha, setSelectedDosha] = useState('All')
  const [selectedHerb, setSelectedHerb] = useState(null)

  const filteredHerbs = ayurvedicHerbs.filter(herb => {
    const matchesSearch = herb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         herb.sanskrit.includes(searchTerm) ||
                         herb.properties.some(prop => prop.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || herb.category === selectedCategory
    const matchesDosha = selectedDosha === 'All' || herb.dosha.includes(selectedDosha)
    
    return matchesSearch && matchesCategory && matchesDosha
  })

  const getDoshaIcon = (dosha) => {
    switch (dosha) {
      case 'Vata': return Brain
      case 'Pitta': return Sun
      case 'Kapha': return Droplets
      default: return Shield
    }
  }

  const getDoshaColor = (dosha) => {
    switch (dosha) {
      case 'Vata': return 'text-purple-600 bg-purple-100'
      case 'Pitta': return 'text-red-600 bg-red-100'
      case 'Kapha': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <GlassCard className="p-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-2xl">
              <Leaf className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-charcoal-800">Ayurvedic Herb Library</h1>
              <p className="text-charcoal-600 text-lg">Discover the healing power of nature</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Search and Filters */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
            <input
              type="text"
              placeholder="Search herbs, properties, or Sanskrit names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent backdrop-blur-sm appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Dosha Filter */}
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" size={20} />
            <select
              value={selectedDosha}
              onChange={(e) => setSelectedDosha(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white/50 border border-white/30 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent backdrop-blur-sm appearance-none"
            >
              {doshas.map(dosha => (
                <option key={dosha} value={dosha}>{dosha} Dosha</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Herbs Grid */}
      <BentoGrid>
        {filteredHerbs.map((herb) => (
          <BentoItem
            key={herb.id}
            colSpan="col-span-4"
            className="cursor-pointer group hover:shadow-glow transition-all duration-300"
            onClick={() => setSelectedHerb(herb)}
          >
            <div className="space-y-4">
              {/* Herb Image */}
              <div className={`h-32 bg-gradient-to-br ${herb.color} rounded-xl flex items-center justify-center relative overflow-hidden`}>
                <Leaf className="text-white/30" size={64} />
                <div className="absolute top-2 right-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                    <Star className="text-yellow-300" size={12} fill="currentColor" />
                    <span className="text-white text-xs font-semibold">{herb.rating}</span>
                  </div>
                </div>
              </div>

              {/* Herb Info */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-charcoal-800">{herb.name}</h3>
                    <p className="text-charcoal-600 text-sm">{herb.sanskrit}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                    herb.category === 'Adaptogen' ? 'bg-green-100 text-green-700' :
                    herb.category === 'Anti-inflammatory' ? 'bg-orange-100 text-orange-700' :
                    herb.category === 'Nootropic' ? 'bg-purple-100 text-purple-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {herb.category}
                  </div>
                </div>

                <p className="text-charcoal-600 text-sm mb-3 line-clamp-2">{herb.description}</p>

                {/* Properties */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {herb.properties.slice(0, 3).map((property, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full"
                    >
                      {property}
                    </span>
                  ))}
                </div>

                {/* Doshas */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-charcoal-600">Balances:</span>
                  {herb.dosha.map((dosha, index) => {
                    const DoshaIcon = getDoshaIcon(dosha)
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getDoshaColor(dosha)}`}
                      >
                        <DoshaIcon size={12} />
                        {dosha}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </BentoItem>
        ))}
      </BentoGrid>

      {/* Herb Detail Modal */}
      <AnimatePresence>
        {selectedHerb && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedHerb(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-charcoal-800">{selectedHerb.name}</h2>
                    <p className="text-xl text-charcoal-600">{selectedHerb.sanskrit}</p>
                    <p className="text-sm text-charcoal-500 italic">{selectedHerb.scientificName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedHerb(null)}
                    className="text-charcoal-400 hover:text-charcoal-600 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Image and Rating */}
                <div className={`h-48 bg-gradient-to-br ${selectedHerb.color} rounded-xl flex items-center justify-center relative`}>
                  <Leaf className="text-white/30" size={96} />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                    <Star className="text-yellow-300" size={16} fill="currentColor" />
                    <span className="text-white font-semibold">{selectedHerb.rating}/5</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-charcoal-700 leading-relaxed">{selectedHerb.description}</p>

                {/* Benefits */}
                <div>
                  <h3 className="text-xl font-bold text-charcoal-800 mb-3">Key Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedHerb.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Heart className="text-teal-500" size={16} />
                        <span className="text-charcoal-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dosage and Precautions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-charcoal-800 mb-2">Recommended Dosage</h4>
                    <p className="text-charcoal-700">{selectedHerb.dosage}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-800 mb-2">Precautions</h4>
                    <p className="text-charcoal-700">{selectedHerb.precautions}</p>
                  </div>
                </div>

                {/* Body Parts Affected */}
                <div>
                  <h4 className="font-bold text-charcoal-800 mb-3">Affects Body Systems</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedHerb.bodyParts.map((part, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                      >
                        {part}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <GlassButton variant="primary" className="flex-1">
                    Add to My Herbs
                  </GlassButton>
                  <GlassButton variant="secondary" className="flex-1">
                    Consult Practitioner
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}