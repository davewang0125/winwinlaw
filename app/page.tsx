'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirect to winwinlanding on mount
    window.location.href = '/winwinlanding/index.html'
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: 'linear-gradient(135deg, #f8f9fb 0%, #e8eef5 100%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #1a5490',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px',
        }} />
        <h1 style={{ color: '#1a5490', fontSize: '24px', margin: 0 }}>
          Redirecting to Win Win Law...
        </h1>
        <p style={{ color: '#6b6b6b', marginTop: '10px' }}>
          If you are not redirected, <a href="/winwinlanding/index.html" style={{ color: '#1a5490', fontWeight: 600 }}>click here</a>.
        </p>
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `
        }} />
      </div>
    </div>
  )
}
