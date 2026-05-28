import React, { useState } from 'react'

export default function Input({ 
  label, 
  type = 'text',
  error,
  className = '',
  ...props 
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0)
    if (props.onChange) {
      props.onChange(e)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="font-label text-xs uppercase tracking-widest text-primary font-bold block">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          className={`
            w-full bg-surface-container-low px-4 py-3 rounded-xl
            border-b-2 transition-all ease-calm
            focus:outline-none focus:ring-0
            placeholder:text-on-surface-variant/40
            ${error 
              ? 'border-error text-error' 
              : isFocused 
                ? 'border-primary' 
                : 'border-primary/20'
            }
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
    </div>
  )
}

export function Textarea({ 
  label, 
  error,
  className = '',
  rows = 4,
  ...props 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="font-label text-xs uppercase tracking-widest text-primary font-bold block">
          {label}
        </label>
      )}
      
      <textarea
        rows={rows}
        className={`
          w-full bg-surface-container-low px-4 py-3 rounded-xl
          border-b-2 transition-all ease-calm
          focus:outline-none focus:ring-0
          placeholder:text-on-surface-variant/40
          resize-vertical
          ${error ? 'border-error' : 'border-primary/20 focus:border-primary'}
        `}
        {...props}
      />
      
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
    </div>
  )
}

export function Select({ 
  label, 
  options = [],
  error,
  className = '',
  ...props 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="font-label text-xs uppercase tracking-widest text-primary font-bold block">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          className={`
            w-full bg-surface-container-low px-4 py-3 rounded-xl
            border-b-2 transition-all ease-calm
            focus:outline-none focus:ring-0
            appearance-none cursor-pointer
            ${error ? 'border-error' : 'border-primary/20 focus:border-primary'}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <span className="material-symbols-outlined absolute right-4 top-3 text-primary pointer-events-none">
          expand_more
        </span>
      </div>
      
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
    </div>
  )
}
