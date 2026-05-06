'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
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

      if (isHovered) {
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
  const globeGroupRef = useRef<THREE.Group>(null)
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<[number, number, number]>([0, 0, 0])
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null)
  const [bumpMap, setBumpMap] = useState<THREE.Texture | null>(null)
  const globeRadius = 2

  // Load Earth textures
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'

    console.log('Starting to load Earth textures...')

    // Try local texture first, then fallback to CDN
    const textureSources = [
      '/textures/earth-blue-marble.jpg',
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
      'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg'
    ]

    // Try first source (local)
    loader.load(
      textureSources[0],
      (texture) => {
        console.log('✅ Earth texture loaded successfully!')
        setEarthTexture(texture)
      },
      (progress) => {
        console.log('Loading texture...', Math.round((progress.loaded / progress.total) * 100) + '%')
      },
      (error) => {
        console.error('❌ Error loading Earth texture from source 1:', error)
        console.log('Trying alternative source...')

        // Try second source
        loader.load(
          textureSources[1],
          (texture) => {
            console.log('✅ Earth texture loaded from alternative source!')
            setEarthTexture(texture)
          },
          undefined,
          (error2) => {
            console.error('❌ Error loading from source 2:', error2)
            console.log('⚠️ Using fallback visualization')
          }
        )
      }
    )

    // Try to load bump map
    loader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png',
      (texture) => {
        console.log('✅ Bump map loaded!')
        setBumpMap(texture)
      },
      undefined,
      (error) => {
        console.log('⚠️ Bump map not loaded, using flat surface')
      }
    )
  }, [])

  useFrame(() => {
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y += 0.001
    }
  })

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country)

    // Calculate position for the popup (offset from marker)
    const phi = (90 - country.lat) * (Math.PI / 180)
    const theta = (country.lng + 180) * (Math.PI / 180)

    const offset = globeRadius + 0.5 // Position slightly away from globe
    const x = -(offset * Math.sin(phi) * Math.cos(theta))
    const z = offset * Math.sin(phi) * Math.sin(theta)
    const y = offset * Math.cos(phi)

    setSelectedPosition([x, y, z])
  }

  return (
    <group>
      {/* Rotating group for globe and markers */}
      <group ref={globeGroupRef}>
        {/* Main Globe */}
        <mesh>
        <sphereGeometry args={[globeRadius, 64, 64]} />
        {earthTexture ? (
          <meshStandardMaterial
            map={earthTexture}
            bumpMap={bumpMap}
            bumpScale={0.05}
            metalness={0.1}
            roughness={0.8}
          />
        ) : (
          // Stylized fallback if texture doesn't load
          <meshPhongMaterial
            color="#1a3d5c"
            emissive="#0a1628"
            emissiveIntensity={0.3}
            shininess={30}
            specular="#4a7ba7"
          />
        )}
      </mesh>

      {/* Globe wireframe overlay - show if no texture to give geographic feel */}
      {!earthTexture && (
        <>
          <mesh>
            <sphereGeometry args={[globeRadius + 0.01, 36, 18]} />
            <meshBasicMaterial
              color="#2a5a7a"
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
          {/* Add latitude lines */}
          <mesh>
            <sphereGeometry args={[globeRadius + 0.015, 4, 36]} />
            <meshBasicMaterial
              color="#3a6a8a"
              wireframe
              transparent
              opacity={0.4}
            />
          </mesh>
        </>
      )}

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[globeRadius + 0.15, 24, 24]} />
        <meshBasicMaterial
          color="#00aaff"
          transparent
          opacity={earthTexture ? 0.08 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>

        {/* Country markers - inside rotating group */}
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

        {/* Tooltip for hovered country - rotates with globe */}
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

        {/* Selected country info - rotates with globe */}
        {selectedCountry && (
          <Html
            position={selectedPosition}
            distanceFactor={6}
            style={{
              pointerEvents: 'auto',
            }}
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
                    {Math.round((selectedCountry.professionals / 94892) * 100)}%
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
      {/* End of rotating group */}
    </group>
  )
}

export default function InteractiveGlobeFixed() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lighting - optimized for Earth texture */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.3} color="#0088ff" />
        <hemisphereLight
          color="#ffffff"
          groundColor="#0a1628"
          intensity={0.4}
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
    </div>
  )
}
