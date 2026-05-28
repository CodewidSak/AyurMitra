import React from 'react'

export default function ProgressBar({ 
  value = 0, 
  max = 100,
  label,
  showValue = true,
  variant = 'botanical',
  size = 'md',
  className = '' 
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variants = {
    botanical: {
      track: 'bg-primary/10',
      indicator: 'bg-tertiary',
    },
    primary: {
      track: 'bg-primary/10',
      indicator: 'bg-primary',
    },
    secondary: {
      track: 'bg-secondary/10',
      indicator: 'bg-secondary-fixed-dim',
    },
  }

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs font-bold text-secondary uppercase tracking-tighter mb-2">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      
      <div className={`w-full ${variants[variant].track} rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className={`${variants[variant].indicator} ${sizes[size]} rounded-full transition-all ease-calm duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function CircularProgress({ 
  value = 0, 
  max = 100,
  size = 192,
  strokeWidth = 12,
  label,
  className = '' 
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {label && (
        <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-8">
          {label}
        </span>
      )}
      
      <div className="relative" style={{ width: size, height: size }}>
        <svg 
          className="transform -rotate-90" 
          width={size} 
          height={size}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-primary/10"
          />
          
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-tertiary transition-all ease-calm duration-500"
          />
        </svg>
        
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-primary">{value}</span>
          <span className="text-[10px] uppercase font-bold text-secondary opacity-60">
            / {max}
          </span>
        </div>
      </div>
    </div>
  )
}
