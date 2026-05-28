import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

// Professional 3D Human Body Model with Glass Material
function HumanBodyMesh({ viewMode, selectedPart, onPartClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(null)
  
  // Create professional glass material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 0.9,
    opacity: 0.3,
    metalness: 0,
    roughness: 0,
    ior: 1.5,
    thickness: 0.01,
    specularIntensity: 1,
    specularColor: new THREE.Color('#0d9488'),
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
  })

  // Glow material for selected parts
  const glowMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 0.7,
    opacity: 0.8,
    metalness: 0,
    roughness: 0,
    ior: 1.5,
    thickness: 0.02,
    emissive: new THREE.Color('#0d9488'),
    emissiveIntensity: 0.5,
    envMapIntensity: 1,
  })

  // Body parts geometry (simplified for demo)
  const bodyParts = {
    'Head': { position: [0, 1.6, 0], scale: [0.3, 0.4, 0.3], geometry: 'sphere' },
    'Chest': { position: [0, 1, 0], scale: [0.6, 0.4, 0.3], geometry: 'box' },
    'Stomach': { position: [0, 0.4, 0], scale: [0.5, 0.3, 0.25], geometry: 'box' },
    'Left Arm': { position: [-0.8, 1, 0], scale: [0.15, 0.6, 0.15], geometry: 'box' },
    'Right Arm': { position: [0.8, 1, 0], scale: [0.15, 0.6, 0.15], geometry: 'box' },
    'Left Leg': { position: [-0.25, -0.5, 0], scale: [0.2, 0.8, 0.2], geometry: 'box' },
    'Right Leg': { position: [0.25, -0.5, 0], scale: [0.2, 0.8, 0.2], geometry: 'box' },
  }

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <group ref={meshRef}>
      {Object.entries(bodyParts).map(([partName, config]) => (
        <mesh
          key={partName}
          position={config.position}
          scale={config.scale}
          material={selectedPart === partName ? glowMaterial : glassMaterial}
          onClick={() => onPartClick && onPartClick(partName)}
          onPointerOver={() => setHovered(partName)}
          onPointerOut={() => setHovered(null)}
        >
          {config.geometry === 'sphere' ? (
            <sphereGeometry args={[1, 32, 32]} />
          ) : (
            <boxGeometry args={[1, 1, 1]} />
          )}
          
          {/* Glow effect for selected part */}
          {selectedPart === partName && (
            <mesh scale={[1.1, 1.1, 1.1]}>
              {config.geometry === 'sphere' ? (
                <sphereGeometry args={[1, 32, 32]} />
              ) : (
                <boxGeometry args={[1, 1, 1]} />
              )}
              <meshBasicMaterial 
                color="#0d9488" 
                transparent 
                opacity={0.2}
                side={THREE.BackSide}
              />
            </mesh>
          )}
          
          {/* Hover label */}
          {hovered === partName && (
            <Html center>
              <div className="bg-charcoal-800/90 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm pointer-events-none">
                {partName}
              </div>
            </Html>
          )}
        </mesh>
      ))}
      
      {/* Internal organs (when viewMode is 'internal') */}
      {viewMode === 'internal' && (
        <group>
          {/* Heart */}
          <mesh position={[-0.1, 0.9, 0]} scale={[0.15, 0.2, 0.1]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshPhysicalMaterial 
              color="#dc2626" 
              transmission={0.3}
              opacity={0.8}
              emissive="#dc2626"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Lungs */}
          <mesh position={[-0.2, 1.1, 0]} scale={[0.12, 0.25, 0.15]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshPhysicalMaterial 
              color="#ec4899" 
              transmission={0.4}
              opacity={0.7}
            />
          </mesh>
          <mesh position={[0.2, 1.1, 0]} scale={[0.12, 0.25, 0.15]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshPhysicalMaterial 
              color="#ec4899" 
              transmission={0.4}
              opacity={0.7}
            />
          </mesh>
          
          {/* Liver */}
          <mesh position={[0.15, 0.6, 0]} scale={[0.2, 0.15, 0.1]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhysicalMaterial 
              color="#92400e" 
              transmission={0.3}
              opacity={0.8}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function BodyModel({ viewMode, selectedPart, onPartSelect }) {
  return (
    <>
      {/* Lighting setup for professional look */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} color="#0d9488" />
      
      {/* Environment for reflections */}
      <mesh visible={false}>
        <sphereGeometry args={[100, 60, 40]} />
        <meshBasicMaterial color="#f0f9ff" side={THREE.BackSide} />
      </mesh>
      
      <HumanBodyMesh 
        viewMode={viewMode}
        selectedPart={selectedPart}
        onPartClick={onPartSelect}
      />
    </>
  )
}
