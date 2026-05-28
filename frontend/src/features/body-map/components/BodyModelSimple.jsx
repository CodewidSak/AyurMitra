import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BodyModel({ viewMode, selectedPart, onPartSelect }) {
  const groupRef = useRef()

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
    }
  })

  const getPartColor = (partName) => {
    if (selectedPart === partName) {
      return '#0d9488'
    }
    return '#4ecdc4'
  }

  const handlePartClick = (partName) => {
    if (onPartSelect) {
      onPartSelect(partName)
    }
  }

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh 
        position={[0, 1.5, 0]}
        onClick={() => handlePartClick('Head')}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color={getPartColor('Head')} 
          transparent
          opacity={selectedPart === 'Head' ? 1 : 0.8}
        />
      </mesh>

      {/* Chest */}
      <mesh 
        position={[0, 0.8, 0]}
        onClick={() => handlePartClick('Chest')}
      >
        <boxGeometry args={[0.4, 0.6, 0.3]} />
        <meshStandardMaterial 
          color={getPartColor('Chest')} 
          transparent
          opacity={selectedPart === 'Chest' ? 1 : 0.8}
        />
      </mesh>

      {/* Stomach */}
      <mesh 
        position={[0, 0.2, 0]}
        onClick={() => handlePartClick('Stomach')}
      >
        <boxGeometry args={[0.35, 0.5, 0.25]} />
        <meshStandardMaterial 
          color={getPartColor('Stomach')} 
          transparent
          opacity={selectedPart === 'Stomach' ? 1 : 0.8}
        />
      </mesh>

      {/* Left Arm */}
      <mesh 
        position={[-0.4, 0.8, 0]}
        onClick={() => handlePartClick('Left Arm')}
      >
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial 
          color={getPartColor('Left Arm')} 
          transparent
          opacity={selectedPart === 'Left Arm' ? 1 : 0.8}
        />
      </mesh>

      {/* Right Arm */}
      <mesh 
        position={[0.4, 0.8, 0]}
        onClick={() => handlePartClick('Right Arm')}
      >
        <boxGeometry args={[0.15, 0.7, 0.15]} />
        <meshStandardMaterial 
          color={getPartColor('Right Arm')} 
          transparent
          opacity={selectedPart === 'Right Arm' ? 1 : 0.8}
        />
      </mesh>

      {/* Left Leg */}
      <mesh 
        position={[-0.15, -0.8, 0]}
        onClick={() => handlePartClick('Left Leg')}
      >
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial 
          color={getPartColor('Left Leg')} 
          transparent
          opacity={selectedPart === 'Left Leg' ? 1 : 0.8}
        />
      </mesh>

      {/* Right Leg */}
      <mesh 
        position={[0.15, -0.8, 0]}
        onClick={() => handlePartClick('Right Leg')}
      >
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial 
          color={getPartColor('Right Leg')} 
          transparent
          opacity={selectedPart === 'Right Leg' ? 1 : 0.8}
        />
      </mesh>

      {/* Internal organs (when viewMode is 'internal') */}
      {viewMode === 'internal' && (
        <group>
          {/* Heart */}
          <mesh position={[-0.1, 0.9, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          
          {/* Lungs */}
          <mesh position={[-0.15, 1.0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          <mesh position={[0.15, 1.0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
        </group>
      )}
    </group>
  )
}