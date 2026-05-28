import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, X, Phone } from 'lucide-react'

export default function EmergencyAlert({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <AlertTriangle size={24} className="text-yellow-300" />
          <div>
            <h3 className="font-bold text-lg">Emergency Symptoms Detected</h3>
            <p className="text-red-100">
              Your symptoms may require immediate medical attention. Please consider contacting emergency services.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-50 transition"
          >
            <Phone size={16} />
            Call Emergency
          </motion.button>
          
          <button
            onClick={onClose}
            className="text-white hover:text-red-200 transition"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}