import React from 'react'

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-ambient',
    secondary: 'bg-surface-container-high text-primary hover:bg-primary/10',
    tertiary: 'text-primary hover:bg-primary/5',
    outline: 'border border-primary/10 text-primary hover:bg-primary hover:text-on-primary',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`
        rounded-md font-medium transition-all ease-calm duration-300
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={20} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={20} />}
    </button>
  )
}
