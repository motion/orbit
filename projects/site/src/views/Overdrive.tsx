import React from 'react'
import ReactOverdrive from 'react-overdrive'

export const Overdrive = ({
  style,
  ...props
}: {
  id: string
  children: any
  duration?: number
  animationDelay?: number
  easing?: string
  element?: string
  style?: Object
}) =>
  // disable for now
  props.children || (
    <ReactOverdrive
      style={{
        zIndex: 10000000,
        display: 'flex',
        flexDirection: 'inherit',
        flexWrap: 'inherit',
        flexGrow: 'inherit',
        alignItems: 'inherit',
        justifyContent: 'inherit',
        ...style,
      }}
      {...props}
    />
  )
