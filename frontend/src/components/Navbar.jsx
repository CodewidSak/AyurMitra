import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, User, Home, Activity, Sparkles } from 'lucide-react'

export default function Navbar() {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-2 rounded-lg group-hover:shadow-md transition-shadow">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900">AyurMitra</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link 
              to="/dashboard" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/dashboard')
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            <Link 
              to="/consultation" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/consultation')
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Activity size={18} />
              <span className="hidden sm:inline">Consultation</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isActive('/profile')
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <User size={18} />
              <span className="hidden sm:inline">{user?.firstName || 'Profile'}</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all ml-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
