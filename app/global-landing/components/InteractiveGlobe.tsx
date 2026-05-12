'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { countryData, type Country } from './countryData'

interface CountryMarkerProps {
  country: Country
  onHover: (country: Country | null) => void
  onClick: (country: Country) => void
  isHovered: boolean
  globeRadius: number
}

function CountryMarker({ country, onHover, onClick, isHovered, globeRadius }: CountryMarkerProps) {
  const markerRef = useRef<THREE.Mesh>(null)

  // Convert lat/lng to 3D position
  const position = useMemo(() => {
    const phi = (90 - country.lat) * (Math.PI / 180)
    const theta = (country.lng + 180) * (Math.PI / 180)

    const x = -(globeRadius * Math.sin(phi) * Math.cos(theta))
    const z = globeRadius * Math.sin(phi) * Math.sin(theta)
    const y = globeRadius * Math.cos(phi)

    return [x, y, z] as [number, number, number]
  }, [country.lat, country.lng, globeRadius])

  useFrame((state) => {
    if (markerRef.current) {
      const scale = isHovered ? 1.5 : 1
      markerRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)

      if (isHovered && markerRef.current.material instanceof THREE.MeshStandardMaterial) {
        markerRef.current.material.emissiveIntensity =
          0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3
      }
    }
  })

  const markerSize = useMemo(() => {
    const baseSize = 0.02
    const sizeMultiplier = Math.log(country.professionals + 1) / 10
    return baseSize + sizeMultiplier * 0.015
  }, [country.professionals])

  return (
    <group position={position}>
      <mesh
        ref={markerRef}
        onPointerEnter={() => onHover(country)}
        onPointerLeave={() => onHover(null)}
        onClick={() => onClick(country)}
      >
        <sphereGeometry args={[markerSize, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? '#00ffff' : '#00d4ff'}
          emissive={isHovered ? '#00ffff' : '#0088ff'}
          emissiveIntensity={isHovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Pulse ring effect */}
      {isHovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[markerSize * 1.5, markerSize * 2, 32]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null)
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const globeRadius = 2

  useFrame((state) => {
    if (globeRef.current) {
      // Gentle auto-rotation when not being manipulated
      globeRef.current.rotation.y += 0.001
    }
  })

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country)
    console.log('Selected country:', country)
  }

  return (
    <group>
      {/* Main Globe */}
      <Sphere ref={globeRef} args={[globeRadius, 64, 64]}>
        <meshStandardMaterial
          color="#0a1628"
          emissive="#051020"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.95}
        />
      </Sphere>

      {/* Globe wireframe overlay */}
      <Sphere args={[globeRadius + 0.01, 32, 32]}>
        <meshBasicMaterial
          color="#1a3a52"
          wireframe
          transparent
          opacity={0.15}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[globeRadius + 0.1, 32, 32]}>
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Country markers */}
      {countryData.map((country) => (
        <CountryMarker
          key={country.code}
          country={country}
          onHover={setHoveredCountry}
          onClick={handleCountryClick}
          isHovered={hoveredCountry?.code === country.code}
          globeRadius={globeRadius}
        />
      ))}

      {/* Tooltip for hovered country */}
      {hoveredCountry && (
        <Html
          position={[0, globeRadius + 1, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
          }}
        >
          <div className="country-tooltip">
            <div className="tooltip-country">{hoveredCountry.name}</div>
            <div className="tooltip-professionals">
              {hoveredCountry.professionals.toLocaleString()} professionals
            </div>
            <div className="tooltip-code">{hoveredCountry.code}</div>
          </div>
        </Html>
      )}

      {/* Selected country info */}
      {selectedCountry && (
        <Html
          position={[0, -globeRadius - 1, 0]}
          center
          distanceFactor={8}
        >
          <div className="selected-country-card">
            <button
              className="close-btn"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedCountry(null)
              }}
            >
              ×
            </button>
            <div className="card-header">
              <div className="country-flag">{selectedCountry.code}</div>
              <div className="country-name">{selectedCountry.name}</div>
            </div>
            <div className="card-stats">
              <div className="card-stat">
                <div className="card-stat-value">
                  {selectedCountry.professionals.toLocaleString()}
                </div>
                <div className="card-stat-label">Legal Professionals</div>
              </div>
              <div className="card-stat">
                <div className="card-stat-value">
                  {Math.round((selectedCountry.professionals / 47892) * 100)}%
                </div>
                <div className="card-stat-label">Of Network</div>
              </div>
            </div>
            <button className="explore-btn">
              Explore Network →
            </button>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function InteractiveGlobe() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0088ff" />
      <spotLight
        position={[0, 5, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#00aaff"
      />

      {/* Globe */}
      <Globe />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={false}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
    </Canvas>
  )
}
