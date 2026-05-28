import React from 'react'
import { motion } from 'framer-motion'
import { Check, Circle, ArrowRight } from 'lucide-react'

const steps = [
  { id: 1, title: 'Select Body Part', description: 'Choose the affected area' },
  { id: 2, title: 'Describe Symptoms', description: 'Add your symptoms and details' },
  { id: 3, title: 'AI Analysis', description: 'Processing your information' },
  { id: 4, title: 'Get Recommendations', description: 'Receive personalized remedies' }
]

export default function ConsultationProgress({ currentStep }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Consultation Progress</h3>
      
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-ayur-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <Check size={20} />
                ) : (
                  <Circle size={20} fill="currentColor" />
                )}
              </motion.div>
              
              <div className="text-center">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-24">
                  {step.description}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}