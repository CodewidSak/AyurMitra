import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/consultation', label: 'Consultations', icon: 'spa' },
  { path: '/results', label: 'Results', icon: 'analytics' },
  { path: '/remedies', label: 'Remedies', icon: 'eco' },
  { path: '/profile', label: 'Profile', icon: 'account_circle' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-primary/10 bg-surface flex flex-col py-6 z-50">
      {/* Branding */}
      <div className="px-8 mb-10">
        <h1 className="font-headline text-xl font-bold text-primary tracking-tight">
          AyurMitra
        </h1>
        <p className="font-label text-[10px] uppercase tracking-widest-plus text-secondary opacity-70 mt-1">
          Clinical Wellness
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-6 py-3 mx-2 rounded-md transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary text-surface font-bold' 
                  : 'text-secondary hover:bg-primary/5 hover:translate-x-1'
                }
              `}
            >
              <span className="material-symbols-outlined mr-3">
                {item.icon}
              </span>
              <span className="font-label text-sm uppercase tracking-wider">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 mt-auto space-y-4">
        <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-medium shadow-ambient hover:scale-[1.02] active:scale-95 transition-all ease-calm">
          Book Session
        </button>
        
        <div className="pt-6 border-t border-primary/5 space-y-1">
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-secondary opacity-60 hover:opacity-100 text-xs uppercase tracking-widest font-label transition-opacity"
          >
            <span className="material-symbols-outlined mr-3 text-lg">settings</span>
            Settings
          </Link>
          <Link
            to="/support"
            className="flex items-center px-4 py-2 text-secondary opacity-60 hover:opacity-100 text-xs uppercase tracking-widest font-label transition-opacity"
          >
            <span className="material-symbols-outlined mr-3 text-lg">help</span>
            Support
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-secondary opacity-60 hover:opacity-100 text-xs uppercase tracking-widest font-label transition-opacity hover:text-red-600"
          >
            <span className="material-symbols-outlined mr-3 text-lg">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
