import React from 'react'
import { motion } from 'framer-motion'

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  ...props 
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`
        relative backdrop-blur-xl bg-white/10 
        border border-white/20 rounded-2xl 
        shadow-glass shadow-glass-inset
        ${glow ? 'shadow-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-glass-gradient rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

export function GlassButton({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const variants = {
    primary: 'bg-teal-600/90 hover:bg-teal-500/90 text-white border-teal-400/30',
    secondary: 'bg-white/10 hover:bg-white/20 text-charcoal-800 border-white/30',
    ghost: 'bg-transparent hover:bg-white/10 text-charcoal-700 border-transparent'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative backdrop-blur-xl border rounded-xl
        font-semibold transition-all duration-200
        shadow-glass shadow-glass-inset
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-glass-gradient rounded-xl" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

export function BentoGrid({ children, className = '' }) {
  return (
    <div className={`grid grid-cols-12 gap-6 ${className}`}>
      {children}
    </div>
  )
}

export function BentoItem({ 
  children, 
  colSpan = 'col-span-4', 
  rowSpan = '', 
  className = '',
  ...props 
}) {
  return (
    <GlassCard 
      className={`${colSpan} ${rowSpan} p-6 ${className}`}
      {...props}
    >
      {children}
    </GlassCard>
  )
}