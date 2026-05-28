import React, { useState } from 'react'
import { Card } from './Card'
import Badge from './Badge'
import Button from './Button'

export default function HerbCard({ herb, compact = false }) {
  const [showDetails, setShowDetails] = useState(false)

  if (compact) {
    return (
      <Card variant="default" size="sm" className="group hover:shadow-ambient transition-all duration-300">
        <div className="flex items-center gap-4">
          {/* Herb Image */}
          <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
            {herb.image ? (
              <img src={herb.image} alt={herb.name} className="w-12 h-12 object-cover rounded-lg" />
            ) : (
              <span className="material-symbols-outlined text-primary text-2xl">eco</span>
            )}
          </div>

          {/* Herb Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-headline text-lg text-primary font-semibold truncate">{herb.name}</h3>
              <Badge variant="outline" size="sm" className="ml-2 flex-shrink-0">
                {herb.dosha}
              </Badge>
            </div>
            <p className="text-xs italic text-primary/60 mb-2">{herb.latinName}</p>
            <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
              {herb.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary hover:text-surface transition-all duration-300 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-sm">
                {showDetails ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-primary/10 space-y-3">
            {/* Benefits */}
            <div>
              <p className="font-label text-xs uppercase tracking-wider text-secondary mb-2">Key Benefits</p>
              <div className="flex flex-wrap gap-1">
                {herb.benefits?.map((benefit, index) => (
                  <span
                    key={index}
                    className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Efficacy */}
            {herb.efficacy && (
              <div>
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

            {/* Usage */}
            {herb.usage && (
              <div>
                <p className="font-label text-xs uppercase tracking-wider text-secondary mb-1">Usage</p>
                <p className="text-xs text-on-surface-variant">{herb.usage}</p>
              </div>
            )}
          </div>
        )}
      </Card>
    )
  }

  // Full card layout
  return (
    <Card variant="default" size="md" className="group hover:shadow-ambient-lg transition-all duration-500 ease-calm">
      {/* Herb Image */}
      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl mb-4 relative overflow-hidden">
        {herb.image ? (
          <img src={herb.image} alt={herb.name} className="w-full h-full object-cover" />
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
              {herb.benefits.slice(0, 3).map((benefit, index) => (
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
      </div>
    </Card>
  )
}