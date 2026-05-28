import React from 'react'

export function Card({ children, className = '', variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-surface-container-lowest border border-primary/5',
    low: 'bg-surface-container-low border border-primary/5',
    high: 'bg-surface-container-high border border-primary/10',
    primary: 'bg-primary text-surface shadow-ambient',
    secondary: 'bg-secondary-container/30 border border-secondary/10',
    outline: 'bg-surface border-2 border-primary/20',
  }

  const sizes = {
    sm: 'p-4 rounded-xl',
    md: 'p-6 rounded-2xl',
    lg: 'p-8 rounded-2xl',
    xl: 'p-10 rounded-3xl',
  }

  return (
    <div className={`${variants[variant]} ${sizes[size]} transition-all duration-300 ease-calm ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function CardTitle({ children, icon, className = '', size = 'md' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }

  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      {icon && (
        <div className="bg-primary/10 p-2 rounded-lg">
          <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
        </div>
      )}
      <h3 className={`font-headline ${sizes[size]} text-primary font-semibold`}>
        {children}
      </h3>
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t border-primary/10 ${className}`}>
      {children}
    </div>
  )
}

export default Card
