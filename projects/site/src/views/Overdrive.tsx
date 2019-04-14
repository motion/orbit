import React from 'react'
import ReactOverdrive from 'react-overdrive'

export const Overdrive = (props: {
  id: string
  children: any
  duration?: number
  animationDelay?: number
  easing?: string
  element?: string
}) => (
  <ReactOverdrive
    style={{
      zIndex: 10000000,
      display: 'flex',
      flexDirection: 'inherit',
      flexWrap: 'inherit',
      flexGrow: 'inherit',
    }}
    {...props}
  />
)
