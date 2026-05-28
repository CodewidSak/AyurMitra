/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'headline': ['Noto Serif', 'Playfair Display', 'Georgia', 'serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'label': ['Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Noto Serif', 'Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // The Verdant Editorial - Exact colors from DESIGN.md
        'background': '#f5fbf7',
        'surface': '#f5fbf7',
        'surface-container': '#e9efeb',
        'surface-container-low': '#eff5f1',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e3eae6',
        'surface-container-highest': '#dee4e0',
        'surface-variant': '#dee4e0',
        'surface-bright': '#f5fbf7',
        'surface-dim': '#d5dbd8',
        
        'primary': '#0f5238',
        'primary-container': '#2d6a4f',
        'primary-fixed': '#b1f0ce',
        'primary-fixed-dim': '#95d4b3',
        
        'secondary': '#0e6c4a',
        'secondary-container': '#a0f4c8',
        'secondary-fixed': '#a0f4c8',
        'secondary-fixed-dim': '#85d7ad',
        
        'tertiary': '#334f00',
        'tertiary-container': '#466900',
        'tertiary-fixed': '#b7f555',
        'tertiary-fixed-dim': '#9dd83b',
        
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        
        'outline': '#707973',
        'outline-variant': '#bfc9c1',
        
        'on-primary': '#ffffff',
        'on-primary-container': '#a8e7c5',
        'on-primary-fixed': '#002114',
        'on-primary-fixed-variant': '#0e5138',
        
        'on-secondary': '#ffffff',
        'on-secondary-container': '#19724f',
        'on-secondary-fixed': '#002113',
        'on-secondary-fixed-variant': '#005236',
        
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#afec4d',
        'on-tertiary-fixed': '#121f00',
        'on-tertiary-fixed-variant': '#334f00',
        
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        
        'on-surface': '#171d1b',
        'on-surface-variant': '#404943',
        'on-background': '#171d1b',
        
        'inverse-surface': '#2b322f',
        'inverse-on-surface': '#ecf2ee',
        'inverse-primary': '#95d4b3',
        
        'surface-tint': '#2c694e',
      },
      borderRadius: {
        'DEFAULT': '0.25rem',
        'md': '0.75rem',  // 12px for standard elements
        'lg': '1rem',
        'xl': '1.5rem',   // 24px for soft hero elements
        '2xl': '2rem',
        '3xl': '3rem',
        'full': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        // Tinted Ambient Shadows using primary green
        'ambient': '0px 12px 32px rgba(15, 82, 56, 0.08)',
        'ambient-lg': '0px 20px 48px rgba(15, 82, 56, 0.12)',
        'ambient-xl': '0px 24px 64px rgba(15, 82, 56, 0.16)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionTimingFunction: {
        'calm': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      letterSpacing: {
        'widest-plus': '0.2em',
        'ultra-wide': '0.4em',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0f5238 0%, #2d6a4f 100%)',
      },
    },
  },
  plugins: [],
}
