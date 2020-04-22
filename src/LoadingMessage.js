import React from 'react'
import './LoadingMessage.css'

export default function LoadingMessage () {
  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <div className="Loader" />
      <span style={{ color: '#888' }}>Initializing...</span>
    </div>
  )
}
