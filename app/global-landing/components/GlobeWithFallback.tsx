'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const InteractiveGlobeFixed = dynamic(
  () => import('./InteractiveGlobeFixed').catch(() => {
    console.error('Failed to load InteractiveGlobeFixed')
    return { default: () => <div>Failed to load 3D globe</div> }
  }),
  {
    ssr: false,
    loading: () => null
  }
)

export default function GlobeWithFallback() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('Initializing 3D Globe...')

  useEffect(() => {
    // Update loading messages
    const messageTimeout1 = setTimeout(() => {
      setLoadingMessage('Loading Earth textures...')
    }, 2000)

    const messageTimeout2 = setTimeout(() => {
      setLoadingMessage('Rendering globe...')
    }, 4000)

    // Set a timeout to show error if it takes too long
    const timeout = setTimeout(() => {
      console.log('Globe loading timeout')
      setHasError(true)
      setIsLoading(false)
    }, 15000) // 15 second timeout for texture loading

    // Check if globe loaded
    const checkInterval = setInterval(() => {
      const canvas = document.querySelector('canvas')
      if (canvas) {
        console.log('Canvas found, globe loaded!')
        clearTimeout(timeout)
        clearTimeout(messageTimeout1)
        clearTimeout(messageTimeout2)
        clearInterval(checkInterval)
        setIsLoading(false)
      }
    }, 500)

    return () => {
      clearTimeout(timeout)
      clearTimeout(messageTimeout1)
      clearTimeout(messageTimeout2)
      clearInterval(checkInterval)
    }
  }, [])

  if (hasError) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h2>Unable to load 3D globe</h2>
        <p>Your browser may not support WebGL or there was an error loading the 3D visualization.</p>
        <p style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.7 }}>
          Try refreshing the page or using a different browser.
        </p>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p className="loading-text">{loadingMessage}</p>
          <p style={{ fontSize: '0.75rem', marginTop: '1rem', opacity: 0.6 }}>
            Loading high-resolution Earth map...
          </p>
        </div>
      )}
      <InteractiveGlobeFixed />
    </>
  )
}
