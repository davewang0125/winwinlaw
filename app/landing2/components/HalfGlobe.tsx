'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const globeRef = useRef<THREE.Group>(null)
  const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null)
  const [textureLoaded, setTextureLoaded] = useState(false)

  // Load Earth texture
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    console.log('Loading Earth texture from /textures/earth-blue-marble.jpg')

    loader.load(
      '/textures/earth-blue-marble.jpg',
      (texture) => {
        console.log('✅ Earth texture loaded successfully!', texture)
        console.log('Texture dimensions:', texture.image?.width, 'x', texture.image?.height)
        setEarthTexture(texture)
        setTextureLoaded(true)
      },
      (progress) => {
        console.log('Loading progress:', progress)
      },
      (error) => {
        console.error('❌ Error loading texture:', error)
        setTextureLoaded(false)
      }
    )
  }, [])

  // Auto-rotate the globe
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.003
    }
  })

  const globeRadius = 2.5

  return (
    <group ref={globeRef}>
      {/* Full Globe with Earth texture */}
      <mesh>
        <sphereGeometry args={[globeRadius, 64, 64]} />
        {earthTexture ? (
          <meshStandardMaterial
            map={earthTexture}
          />
        ) : (
          <meshStandardMaterial
            color="#5099cc"
          />
        )}
      </mesh>

      {/* Subtle atmosphere glow */}
      {textureLoaded && (
        <mesh>
          <sphereGeometry args={[globeRadius + 0.05, 32, 32]} />
          <meshBasicMaterial
            color="#aaddff"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}

export default function HalfGlobe() {
  return (
    <div className="half-globe-container">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <directionalLight position={[-3, -2, -3]} intensity={0.6} />
        <hemisphereLight
          color="#ffffff"
          groundColor="#888888"
          intensity={0.6}
        />

        <Globe />

        {/* Camera controls - allow rotation */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          rotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  )
}
