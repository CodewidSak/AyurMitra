import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, Eye, Trash2, Search, Filter } from 'lucide-react'

export default function ConsultationHistory({ history, onSelectConsultation }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBodyPart, setFilterBodyPart] = useState('all')

  const filteredHistory = history.filter(consultation => {
    const matchesSearch = consultation.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.bodyPart.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterBodyPart === 'all' || consultation.bodyPart === filterBodyPart
    return matchesSearch && matchesFilter
  })

  const bodyParts = [...new Set(history.map(h => h.bodyPart))]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Consultation History</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search consultations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterBodyPart}
              onChange={(e) => setFilterBodyPart(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ayur-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Body Parts</option>
              {bodyParts.map(part => (
                <option key={part} value={part}>{part}</option>
              ))}
            </select>
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Consultations Found</h3>
            <p className="text-gray-600">
              {history.length === 0 
                ? "You haven't had any consultations yet. Start your first consultation to see it here."
                : "No consultations match your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((consultation, index) => (
              <motion.div
                key={consultation.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-ayur-100 p-2 rounded-lg">
                        <MapPin className="text-ayur-600" size={16} />
                      </div>
                      <h3 className="font-semibold text-gray-900">{consultation.bodyPart}</h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(consultation.createdAt || new Date())}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">
                      <strong>Symptoms:</strong> {consultation.symptoms}
                    </p>
                    
                    {consultation.aiResponse && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {consultation.aiResponse.substring(0, 150)}...
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onSelectConsultation(consultation)}
                      className="bg-ayur-600 text-white p-2 rounded-lg hover:bg-ayur-700 transition"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}