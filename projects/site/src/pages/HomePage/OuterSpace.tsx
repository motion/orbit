import React from 'react'

export function OuterSpace() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.5,
      }}
    >
      <iframe style={{ border: 0, height: '100%' }} src="/public/stars.html" />
    </div>
  )
}
