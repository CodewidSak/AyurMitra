import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import BodyModel from './BodyModelSimple'

const BODY_PARTS = [
  { name: 'Head', color: '#0d9488' },
  { name: 'Chest', color: '#059669' },
  { name: 'Stomach', color: '#0891b2' },
  { name: 'Left Arm', color: '#7c3aed' },
  { name: 'Right Arm', color: '#7c3aed' },
  { name: 'Left Leg', color: '#dc2626' },
  { name: 'Right Leg', color: '#dc2626' },
]

export default function BodyNavigator({ onBodyPartSelect, selectedPart }) {
  const [viewMode, setViewMode] = useState('external')

  return (
    <div className="space-y-6">
      {/* Simple Control Panel */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">3D Body Navigator</h3>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('external')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'external'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            External View
          </button>
          <button
            onClick={() => setViewMode('internal')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              viewMode === 'internal'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Internal View
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-200" style={{ height: '500px' }}>
        <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-teal-50">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <BodyModel
              viewMode={viewMode}
              selectedPart={selectedPart}
              onPartSelect={onBodyPartSelect}
            />
          </Canvas>

          {/* Overlay Information */}
          {selectedPart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 z-10"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs border border-gray-200">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: BODY_PARTS.find(p => p.name === selectedPart)?.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedPart}</h4>
                    <p className="text-sm text-gray-600">Click to analyze symptoms</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* View Mode Indicator */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="capitalize">{viewMode} View</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Parts Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Body Part</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BODY_PARTS.map((part) => (
            <motion.button
              key={part.name}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onBodyPartSelect(part.name)}
              className={`
                relative p-4 rounded-xl transition-all duration-200
                border-2
                ${selectedPart === part.name
                  ? 'bg-teal-50 border-teal-300 shadow-lg'
                  : 'bg-white border-gray-200 hover:border-teal-200 hover:bg-teal-50'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: part.color }}
                >
                  ●
                </div>
                <span className={`text-sm font-medium ${
                  selectedPart === part.name ? 'text-teal-700' : 'text-gray-700'
                }`}>
                  {part.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}