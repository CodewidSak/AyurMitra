import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient = 'from-green-500 to-emerald-600',
  onClick,
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`group relative bg-gradient-to-br ${gradient} rounded-3xl shadow-2xl shadow-green-500/30 p-8 cursor-pointer overflow-hidden`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative flex items-start justify-between mb-6">
        <motion.div 
          className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="text-white" size={28} />
        </motion.div>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="text-white/90" size={24} />
        </motion.div>
      </div>
      <h3 className="relative text-2xl font-black text-white mb-3">{title}</h3>
      <p className="relative text-white/90 text-sm leading-relaxed font-medium">{description}</p>
      
      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white/20 rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full"></div>
    </motion.div>
  )
}
