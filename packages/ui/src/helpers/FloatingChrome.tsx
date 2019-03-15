import { FullScreen } from '@o/gloss'
import React, { RefObject, useEffect, useState } from 'react'
import { getRect, Rect, useScreenPosition } from '../hooks/useScreenPosition'
import { Portal } from './portal'

// puts an item on top of render stack, but pinned to another items location

export function FloatingChrome(props: {
  target: RefObject<HTMLElement>
  style?: any
  measureKey?: number
}) {
  const [style, setStyle] = useState<Rect | null>(null)
  const element = (
    <div
      className="testme"
      style={{
        position: 'absolute',
        zIndex: 10000000000000000000,
        ...style,
        ...props.style,
        background: 'green',
      }}
    />
  )

  useScreenPosition({
    ref: props.target,
    onChange: setStyle,
  })

  useEffect(
    () => {
      const rect = getRect(props.target.current.getBoundingClientRect())
      console.log('re measuer', rect)
      setStyle(rect)
    },
    [props.target, props.measureKey],
  )

  return (
    <Portal>
      <FullScreen>{element}</FullScreen>
    </Portal>
  )
}
