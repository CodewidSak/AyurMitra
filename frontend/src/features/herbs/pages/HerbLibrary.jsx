import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/layout/MainLayout'
import { Card } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import HerbCardVertical from '../../../components/ui/HerbCardVertical'

const HERBS = [
  {
    id: 1,
    name: 'Ashwagandha',
    latinName: 'Withania somnifera',
    category: 'Stress Relief',
    dosha: 'Vata/Kapha',
    description: 'A powerful adaptogen known for reducing cortisol levels and supporting deep restorative sleep. Enhances physical strength and mental resilience.',
    benefits: ['Reduces stress', 'Improves sleep', 'Enhances strength', 'Boosts immunity'],
    efficacy: 85,
    usage: '300-600mg daily with warm milk or water',
    image: '/images/herbs/ashwagandha.jpg'
  },
  {
    id: 2,
    name: 'Turmeric',
    latinName: 'Curcuma longa',
    category: 'Immunity',
    dosha: 'Pitta Balanced',
    description: 'The golden spice of life. Potent anti-inflammatory properties that support joint health and natural defenses.',
    benefits: ['Anti-inflammatory', 'Immune support', 'Joint health', 'Antioxidant'],
    efficacy: 92,
    usage: '500-1000mg daily with black pepper for absorption',
    image: '/images/herbs/turmeric.jpg'
  },
  {
    id: 3,
    name: 'Tulsi',
    latinName: 'Ocimum tenuiflorum',
    category: 'Vitality',
    dosha: 'Tridoshic',
    description: 'Holy Basil is revered for its ability to clear respiratory pathways and sharpen cognitive function.',
    benefits: ['Respiratory health', 'Mental clarity', 'Adaptogenic', 'Stress relief'],
    efficacy: 88,
    usage: '2-3 cups of tea daily or 300mg extract',
    image: '/images/herbs/tulsi.jpg'
  },
  {
    id: 4,
    name: 'Brahmi',
    latinName: 'Bacopa monnieri',
    category: 'Focus',
    dosha: 'Pitta/Kapha',
    description: 'A legendary brain tonic used to enhance memory, concentration, and emotional stability.',
    benefits: ['Memory enhancement', 'Focus', 'Neuroprotective', 'Anxiety relief'],
    efficacy: 90,
    usage: '300mg twice daily with meals',
    image: '/images/herbs/brahmi.jpg'
  },
  {
    id: 5,
    name: 'Amalaki',
    latinName: 'Emblica officinalis',
    category: 'Digestion',
    dosha: 'Pitta Pacifying',
    description: 'Richest natural source of Vitamin C. Revitalizes the digestive fire and nourishes all bodily tissues.',
    benefits: ['Vitamin C', 'Digestive support', 'Rejuvenative', 'Hair health'],
    efficacy: 87,
    usage: '1-2 tsp powder daily or fresh fruit',
    image: '/images/herbs/amalaki.jpg'
  },
  {
    id: 6,
    name: 'Shatavari',
    latinName: 'Asparagus racemosus',
    category: 'Balance',
    dosha: 'Vata/Pitta',
    description: 'Translates to "she who has a hundred husbands." The premier herb for female hormonal balance and rejuvenation.',
    benefits: ['Hormonal balance', 'Reproductive health', 'Cooling', 'Digestive aid'],
    efficacy: 86,
    usage: '500mg twice daily with warm milk',
    image: '/images/herbs/shatavari.jpg'
  },
  {
    id: 7,
    name: 'Triphala',
    latinName: 'Three Fruits',
    category: 'Digestion',
    dosha: 'Tridoshic',
    description: 'A combination of three fruits that gently cleanses and detoxifies while nourishing the digestive system.',
    benefits: ['Digestive health', 'Detoxification', 'Eye health', 'Antioxidant'],
    efficacy: 89,
    usage: '1-2 tsp powder before bed with warm water',
    image: '/images/herbs/triphala.jpg'
  },
  {
    id: 8,
    name: 'Guduchi',
    latinName: 'Tinospora cordifolia',
    category: 'Immunity',
    dosha: 'Tridoshic',
    description: 'Known as the "divine nectar," this herb is renowned for its immune-boosting and rejuvenative properties.',
    benefits: ['Immune support', 'Liver health', 'Anti-inflammatory', 'Fever reducer'],
    efficacy: 84,
    usage: '500mg twice daily or as directed',
    image: '/images/herbs/guduchi.jpg'
  },
  {
    id: 9,
    name: 'Neem',
    latinName: 'Azadirachta indica',
    category: 'Purification',
    dosha: 'Pitta/Kapha',
    description: 'The village pharmacy tree. Powerful purifying properties for skin health and blood cleansing.',
    benefits: ['Skin health', 'Blood purifier', 'Antimicrobial', 'Dental health'],
    efficacy: 83,
    usage: '2-4 leaves daily or 250mg extract',
    image: '/images/herbs/neem.jpg'
  },
  {
    id: 10,
    name: 'Arjuna',
    latinName: 'Terminalia arjuna',
    category: 'Heart Health',
    dosha: 'Pitta/Kapha',
    description: 'The heart protector. Traditionally used to support cardiovascular health and strengthen the heart muscle.',
    benefits: ['Heart health', 'Blood pressure', 'Cholesterol support', 'Circulation'],
    efficacy: 81,
    usage: '500mg twice daily with warm water',
    image: '/images/herbs/arjuna.jpg'
  },
  {
    id: 11,
    name: 'Shankhpushpi',
    latinName: 'Convolvulus pluricaulis',
    category: 'Focus',
    dosha: 'Vata/Pitta',
    description: 'A brain tonic that enhances memory, concentration, and learning capacity. Calms the nervous system.',
    benefits: ['Memory boost', 'Concentration', 'Stress relief', 'Sleep quality'],
    efficacy: 86,
    usage: '1-2 tsp powder with milk or honey',
    image: '/images/herbs/shankhpushpi.jpg'
  },
  {
    id: 12,
    name: 'Manjistha',
    latinName: 'Rubia cordifolia',
    category: 'Purification',
    dosha: 'Pitta/Kapha',
    description: 'The blood purifier. Excellent for skin conditions and lymphatic system support.',
    benefits: ['Blood purification', 'Skin health', 'Lymphatic support', 'Anti-inflammatory'],
    efficacy: 82,
    usage: '500mg twice daily or as tea',
    image: '/images/herbs/manjistha.jpg'
  }
]

const CATEGORIES = ['All Botanicals', 'Immunity', 'Digestion', 'Vitality', 'Stress Relief', 'Focus', 'Balance', 'Purification', 'Heart Health']
const DOSHAS = ['All Doshas', 'Vata', 'Pitta', 'Kapha', 'Tridoshic']

export default function HerbLibrary() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('All Botanicals')
  const [selectedDosha, setSelectedDosha] = useState('All Doshas')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('compact') // 'compact' or 'detailed'

  const filteredHerbs = HERBS.filter(herb => {
    const matchesCategory = selectedCategory === 'All Botanicals' || herb.category === selectedCategory
    const matchesDosha = selectedDosha === 'All Doshas' || herb.dosha.includes(selectedDosha)
    const matchesSearch = herb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         herb.latinName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesDosha && matchesSearch
  })

  return (
    <MainLayout breadcrumb={{ section: "The Archivist's Collection", page: 'Botanical Herb Library' }}>
      {/* Hero Header */}
      <section className="mb-12">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="font-label text-xs font-bold tracking-widest-plus text-secondary uppercase">
            The Archivist's Collection
          </span>
          <div className="h-px flex-grow bg-primary/10"></div>
        </div>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-headline text-5xl text-primary tracking-tight leading-none mb-4">
              Botanical Herb Library
            </h2>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Explore our curated collection of {HERBS.length} Ayurvedic herbs, categorized by therapeutic benefit and elemental dosha balancing properties.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('compact')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'compact' ? 'bg-primary text-surface' : 'bg-surface-container text-primary hover:bg-primary/10'}`}
            >
              <span className="material-symbols-outlined">view_list</span>
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'detailed' ? 'bg-primary text-surface' : 'bg-surface-container text-primary hover:bg-primary/10'}`}
            >
              <span className="material-symbols-outlined">view_module</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="mb-10">
        <Card variant="low" size="md">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative max-w-xl">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40">
                search
              </span>
              <input
                type="text"
                placeholder="Search the Herb Library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 placeholder:text-primary/30 text-primary transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-6 items-center">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="font-label text-xs font-bold text-primary/60 uppercase tracking-widest mr-2">
                  Categories:
                </span>
                {CATEGORIES.slice(0, 6).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-medium transition-all ease-calm
                      ${selectedCategory === category
                        ? 'bg-primary text-on-primary shadow-ambient'
                        : 'bg-surface-container-high text-primary hover:bg-primary/10'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Dosha Filter */}
              <div className="flex items-center gap-3 ml-auto">
                <span className="font-label text-xs font-bold text-primary/60 uppercase tracking-widest">
                  Dosha:
                </span>
                <div className="relative">
                  <select
                    value={selectedDosha}
                    onChange={(e) => setSelectedDosha(e.target.value)}
                    className="bg-surface-container border border-primary/20 rounded-lg px-3 py-2 pr-8 text-sm text-primary font-medium transition-colors cursor-pointer appearance-none focus:ring-2 focus:ring-primary/20"
                  >
                    {DOSHAS.map((dosha) => (
                      <option key={dosha} value={dosha}>{dosha}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-sm">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">info</span>
                <span className="text-xs text-secondary font-medium">
                  {filteredHerbs.length} {filteredHerbs.length === 1 ? 'herb' : 'herbs'} found
                </span>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Botanical Grid - Vertical Cards */}
      <section>
        {viewMode === 'compact' ? (
          <div className="space-y-4">
            {filteredHerbs.map((herb) => (
              <HerbCardVertical key={herb.id} herb={herb} compact={true} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHerbs.map((herb) => (
              <HerbCardVertical key={herb.id} herb={herb} compact={false} />
            ))}
          </div>
        )}
      </section>

      {/* Empty State */}
      {filteredHerbs.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-primary/20 text-8xl mb-6 block">
            search_off
          </span>
          <h3 className="font-headline text-2xl text-primary mb-2">No herbs found</h3>
          <p className="text-on-surface-variant mb-6">
            Try adjusting your filters or search query
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedCategory('All Botanicals')
              setSelectedDosha('All Doshas')
              setSearchQuery('')
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </MainLayout>
  )
}
