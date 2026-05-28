import React, { useState } from 'react'
import { Card } from './Card'
import Badge from './Badge'
import Button from './Button'

// Herb images mapping
const HERB_IMAGES = {
  'Ashwagandha': 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=400&h=300&fit=crop',
  'Turmeric': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop',
  'Tulsi': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'Brahmi': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
  'Amalaki': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
  'Shatavari': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
  'Triphala': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop',
  'Guduchi': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'Neem': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
  'Arjuna': 'https://images.unsplash.com/photo-1609501676725-7186f734b2b0?w=400&h=300&fit=crop',
  'Shankhpushpi': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  'Manjistha': 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=300&fit=crop'
}

export default function HerbCardVertical({ herb, compact = false }) {
  const [showDetails, setShowDetails] = useState(false)
  const [imageError, setImageError] = useState(false)

  const herbImage = HERB_IMAGES[herb.name] || null

  if (compact) {
    return (
      <Card variant="default" size="sm" className="group hover:shadow-ambient transition-all duration-300 h-fit">
        <div className="flex items-start gap-4">
          {/* Herb Image */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            {herbImage && !imageError ? (
              <img 
                src={herbImage} 
                alt={herb.name} 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="material-symbols-outlined text-primary text-2xl">eco</span>
            )}
          </div>

          {/* Herb Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-headline text-lg text-primary font-semibold">{herb.name}</h3>
                <p className="text-xs italic text-primary/60 mb-1">{herb.latinName}</p>
              </div>
              <Badge variant="outline" size="sm" className="ml-2 flex-shrink-0">
                {herb.dosha}
              </Badge>
            </div>
            <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mb-3">
              {herb.description}
            </p>
            
            {/* Benefits Pills */}
            {herb.benefits && (
              <div className="flex flex-wrap gap-1 mb-3">
                {herb.benefits.slice(0, 3).map((benefit, index) => (
                  <span
                    key={index}
                    className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            )}

            {/* Efficacy Bar */}
            {herb.efficacy && (
              <div className="mb-3">
                <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  <span>Efficacy</span>
                  <span>{herb.efficacy}%</span>
                </div>
                <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary rounded-full transition-all duration-1000 ease-calm"
                    style={{ width: `${herb.efficacy}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-bold text-primary hover:text-primary-container transition-colors flex items-center"
            >
              {showDetails ? 'Show Less' : 'Learn More'}
              <span className="material-symbols-outlined text-sm ml-1">
                {showDetails ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-primary/10 space-y-3">
            {/* Usage */}
            {herb.usage && (
              <div>
                <p className="font-label text-xs uppercase tracking-wider text-secondary mb-1">Usage</p>
                <p className="text-xs text-on-surface-variant leading-relaxed">{herb.usage}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    )
  }

  // Vertical card layout
  return (
    <Card variant="default" size="md" className="group hover:shadow-ambient-lg transition-all duration-500 ease-calm h-fit">
      {/* Herb Image */}
      <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl mb-4 relative overflow-hidden">
        {herbImage && !imageError ? (
          <img 
            src={herbImage} 
            alt={herb.name} 
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-6xl opacity-20">eco</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="tertiary" size="sm">
            {herb.category}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Herb Info */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline text-xl text-primary font-semibold mb-1">{herb.name}</h3>
            <p className="text-xs italic text-primary/60">{herb.latinName}</p>
          </div>
          <Badge variant="outline" size="sm">
            {herb.dosha}
          </Badge>
        </div>

        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3">
          {herb.description}
        </p>

        {/* Benefits */}
        {herb.benefits && (
          <div>
            <p className="font-label text-xs uppercase tracking-wider text-secondary mb-2">Key Benefits</p>
            <div className="flex flex-wrap gap-2">
              {herb.benefits.slice(0, 4).map((benefit, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary/5 text-primary px-3 py-1 rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Efficacy */}
        {herb.efficacy && (
          <div>
            <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-wider mb-2">
              <span>Clinical Efficacy</span>
              <span>{herb.efficacy}%</span>
            </div>
            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-tertiary rounded-full transition-all duration-1000 ease-calm"
                style={{ width: `${herb.efficacy}%` }}
              />
            </div>
          </div>
        )}

        {/* Learn More Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full group/btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Show Less' : 'Learn More'}
          <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
            {showDetails ? 'expand_less' : 'arrow_forward'}
          </span>
        </Button>

        {/* Expandable Details */}
        {showDetails && (
          <div className="pt-4 border-t border-primary/10 space-y-3">
            {/* Usage */}
            {herb.usage && (
              <div>
                <p className="font-label text-xs uppercase tracking-wider text-secondary mb-2">Usage Instructions</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{herb.usage}</p>
              </div>
            )}
            
            {/* Additional Benefits */}
            {herb.benefits && herb.benefits.length > 4 && (
              <div>
                <p className="font-label text-xs uppercase tracking-wider text-secondary mb-2">Additional Benefits</p>
                <div className="flex flex-wrap gap-2">
                  {herb.benefits.slice(4).map((benefit, index) => (
                    <span
                      key={index}
                      className="text-xs bg-secondary/5 text-secondary px-3 py-1 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}