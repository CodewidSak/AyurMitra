import React, { useState } from 'react'
import { Plus, X, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { validators } from '../../../utils/validation'

const COMMON_SYMPTOMS = [
  'Pain', 'Swelling', 'Redness', 'Itching', 'Numbness',
  'Weakness', 'Stiffness', 'Burning', 'Tingling', 'Fatigue'
]

export default function SymptomForm({ onSubmit, isLoading, selectedBodyPart }) {
  const [symptoms, setSymptoms] = useState([])
  const [customSymptom, setCustomSymptom] = useState('')
  const [errors, setErrors] = useState({})

  const addSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      const newSymptoms = [...symptoms, symptom]
      setSymptoms(newSymptoms)
      // Clear error when symptom is added
      if (errors.symptoms) {
        setErrors(prev => ({ ...prev, symptoms: '' }))
      }
    }
  }

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom))
  }

  const addCustomSymptom = () => {
    const error = validators.symptomText(customSymptom)
    if (error) {
      setErrors(prev => ({ ...prev, customSymptom: error }))
      return
    }

    if (!symptoms.includes(customSymptom)) {
      const newSymptoms = [...symptoms, customSymptom]
      setSymptoms(newSymptoms)
      setCustomSymptom('')
      setErrors(prev => ({ ...prev, customSymptom: '' }))
      
      // Clear symptoms error if it exists
      if (errors.symptoms) {
        setErrors(prev => ({ ...prev, symptoms: '' }))
      }
    }
  }

  const handleSubmit = () => {
    const symptomsError = validators.symptoms(symptoms)
    const bodyPartError = validators.bodyPart(selectedBodyPart)

    const newErrors = {}
    if (symptomsError) newErrors.symptoms = symptomsError
    if (bodyPartError) newErrors.bodyPart = bodyPartError

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // For now, pass basic additional info - can be enhanced later
    const additionalInfo = {
      duration: 'Not specified',
      severity: 'Moderate',
      triggers: [],
      previousTreatments: []
    }

    onSubmit(symptoms, additionalInfo)
  }

  return (
    <div className="space-y-4">
      {/* Body Part Error */}
      {errors.bodyPart && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-3"
        >
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{errors.bodyPart}</span>
        </motion.div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Common Symptoms</label>
        <div className="grid grid-cols-2 gap-2">
          {COMMON_SYMPTOMS.map((symptom) => (
            <motion.button
              key={symptom}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addSymptom(symptom)}
              disabled={symptoms.includes(symptom) || symptoms.length >= 10}
              className={`p-2 rounded text-sm font-medium transition ${
                symptoms.includes(symptom)
                  ? 'bg-ayur-600 text-white'
                  : symptoms.length >= 10
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {symptom}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Symptom</label>
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={customSymptom}
              onChange={(e) => {
                setCustomSymptom(e.target.value)
                if (errors.customSymptom) {
                  setErrors(prev => ({ ...prev, customSymptom: '' }))
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
              placeholder="Enter symptom (2-50 characters)..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ayur-500 transition ${
                errors.customSymptom
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              disabled={symptoms.length >= 10}
            />
            {errors.customSymptom && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm mt-1 flex items-center gap-1"
              >
                <AlertCircle size={14} />
                {errors.customSymptom}
              </motion.p>
            )}
          </div>
          <button
            onClick={addCustomSymptom}
            disabled={symptoms.length >= 10 || !customSymptom.trim()}
            className="bg-ayur-600 hover:bg-ayur-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {symptoms.length}/10 symptoms selected
        </p>
      </div>

      {symptoms.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Selected Symptoms</label>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <motion.div
                key={symptom}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-ayur-100 text-ayur-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {symptom}
                <button
                  onClick={() => removeSymptom(symptom)}
                  className="hover:text-ayur-900 transition"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {errors.symptoms && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-3"
        >
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <span>{errors.symptoms}</span>
        </motion.div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || symptoms.length === 0 || !selectedBodyPart}
        className="w-full bg-ayur-600 hover:bg-ayur-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Getting Remedy...' : 'Get Ayurvedic Remedy'}
      </button>
    </div>
  )
}
