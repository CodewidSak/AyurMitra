import React from 'react'
import { motion } from 'framer-motion'

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  bgColor = 'bg-green-50', 
  textColor = 'text-green-600',
  gradient = 'from-green-500 to-emerald-600',
  trend,
  trendValue,
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-green-200/50 p-6 overflow-hidden hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative flex items-center justify-between mb-4">
        <motion.div 
          className={`bg-gradient-to-br ${gradient} p-3.5 rounded-2xl shadow-lg shadow-green-500/40`}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className="text-white" size={22} />
        </motion.div>
        {trend && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring" }}
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </motion.span>
        )}
      </div>
      <p className="relative text-xs font-bold text-green-600 uppercase tracking-wider mb-2">{title}</p>
      <motion.p 
        className="relative text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
      >
        {value}
      </motion.p>
    </motion.div>
  )
}
