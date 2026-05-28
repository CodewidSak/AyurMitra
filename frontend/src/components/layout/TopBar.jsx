import React from 'react'
import { useAuthStore } from '../../store/authStore'

export default function TopBar({ breadcrumb = null }) {
  const { user } = useAuthStore()

  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-20 bg-surface/90 backdrop-blur-md z-40 flex justify-between items-center px-12 shadow-ambient">
      {/* Breadcrumb / Status */}
      <div className="flex items-center space-x-4">
        {breadcrumb ? (
          <>
            <span className="font-label text-xs font-bold text-primary tracking-widest uppercase">
              {breadcrumb.section}
            </span>
            {breadcrumb.page && (
              <>
                <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                <span className="text-sm font-medium text-secondary">
                  {breadcrumb.page}
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <span className="font-label text-xs font-bold text-primary tracking-widest uppercase">
              System Status
            </span>
            <div className="h-2 w-2 rounded-full bg-tertiary"></div>
            <span className="text-sm font-medium text-secondary">
              All Systems Active
            </span>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-8">
        {/* Notifications */}
        <div className="relative group">
          <button className="material-symbols-outlined text-primary cursor-pointer hover:bg-primary/10 p-2 rounded-full transition-colors">
            notifications
          </button>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-primary leading-none">
              {user?.firstName || user?.username || 'User'}
            </p>
            <p className="text-[10px] text-secondary opacity-70 uppercase tracking-tighter">
              Member
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-primary/10">
            <span className="material-symbols-outlined text-primary text-2xl">
              account_circle
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
