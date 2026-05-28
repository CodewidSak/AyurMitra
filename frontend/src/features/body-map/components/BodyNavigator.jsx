import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PresentationControls, Environment, ContactShadows } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Eye, Layers, RotateCcw, ZoomIn } from 'lucide-react'
import BodyModel from './BodyModel'
import { GlassCard, GlassButton } from '../../../components/ui/GlassCard'

const BODY_PARTS = [
  { name: 'Head', color: '#0d9488', icon: '🧠' },
  { name: 'Chest', color: '#059669', icon: '🫁' },
  { name: 'Stomach', color: '#0891b2', icon: '🫃' },
  { name: 'Left Arm', color: '#7c3aed', icon: '💪' },
  { name: 'Right Arm', color: '#7c3aed', icon: '💪' },
  { name: 'Left Leg', color: '#dc2626', icon: '🦵' },
  { name: 'Right Leg', color: '#dc2626', icon: '🦵' },
]

export default function BodyNavigator({ onBodyPartSelect, selectedPart }) {
  const [viewMode, setViewMode] = useState('external')
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5])

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const resetCamera = () => {
    setCameraPosition([0, 0, 5])
  }

  return (
    <div className="space-y-6">
      {/* Professional Control Panel */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal-800">3D Body Navigator</h3>
          <div className="flex items-center gap-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={resetCamera}
              className="p-2"
            >
              <RotateCcw size={16} />
            </GlassButton>
            <GlassButton
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ZoomIn size={16} />
            </GlassButton>
          </div>
        </div>

        <div className="flex gap-2">
          <GlassButton
            variant={viewMode === 'external' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleViewModeChange('external')}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            External
          </GlassButton>
          <GlassButton
            variant={viewMode === 'internal' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleViewModeChange('internal')}
            className="flex items-center gap-2"
          >
            <Layers size={16} />
            Internal
          </GlassButton>
        </div>
      </GlassCard>

      {/* Professional 3D Viewer */}
      <GlassCard className="overflow-hidden" style={{ height: '600px' }}>
        <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-teal-50">
          <Canvas
            camera={{ position: cameraPosition, fov: 50 }}
            shadows
            gl={{ antialias: true, alpha: true }}
          >
            <PresentationControls
              enabled={true}
              global={false}
              cursor={true}
              snap={false}
              speed={1}
              zoom={1}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 3, Math.PI / 3]}
              azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
            >
              <BodyModel
                viewMode={viewMode}
                selectedPart={selectedPart}
                onPartSelect={onBodyPartSelect}
              />
            </PresentationControls>
            
            {/* Professional Environment */}
            <Environment preset="studio" />
            <ContactShadows
              opacity={0.4}
              scale={10}
              blur={1}
              far={10}
              resolution={256}
              color="#000000"
            />
          </Canvas>

          {/* Overlay Information */}
          {selectedPart && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 z-10"
            >
              <GlassCard className="p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: BODY_PARTS.find(p => p.name === selectedPart)?.color }}
                  />
                  <div>
                    <h4 className="font-semibold text-charcoal-800">{selectedPart}</h4>
                    <p className="text-sm text-charcoal-600">Click to analyze symptoms</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* View Mode Indicator */}
          <div className="absolute top-4 right-4 z-10">
            <GlassCard className="p-2">
              <div className="flex items-center gap-2 text-sm text-charcoal-700">
                {viewMode === 'external' ? <Eye size={16} /> : <Layers size={16} />}
                <span className="capitalize">{viewMode} View</span>
              </div>
            </GlassCard>
          </div>
        </div>
      </GlassCard>

      {/* Professional Body Parts Grid */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-charcoal-800 mb-4">Select Body Part</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BODY_PARTS.map((part) => (
            <motion.button
              key={part.name}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onBodyPartSelect(part.name)}
              className={`
                relative p-4 rounded-xl transition-all duration-200
                backdrop-blur-xl border border-white/20
                ${selectedPart === part.name
                  ? 'bg-teal-600/20 border-teal-400/40 shadow-glow'
                  : 'bg-white/10 hover:bg-white/20'
                }
              `}
            >
              <div className="flex flex-col items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: part.color }}
                >
                  {part.icon}
                </div>
                <span className={`text-sm font-medium ${
                  selectedPart === part.name ? 'text-teal-700' : 'text-charcoal-700'
                }`}>
                  {part.name}
                </span>
              </div>
              
              {selectedPart === part.name && (
                <motion.div
                  layoutId="selectedIndicator"
                  className="absolute inset-0 bg-teal-600/10 rounded-xl border-2 border-teal-400/50"
                />
              )}
            </motion.button>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
