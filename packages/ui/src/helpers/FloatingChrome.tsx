import { FullScreen } from '@o/gloss'
import React, { RefObject, useState } from 'react'
import { Rect, useScreenPosition } from '../hooks/useScreenPosition'
import { Portal } from './portal'

// puts an item on top of render stack, but pinned to another items location

export function FloatingChrome(props: {
  target: RefObject<HTMLElement>
  style?: any
  measureKey: number
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

  useScreenPosition(props.target, setStyle, [props.measureKey])

  return (
    <Portal>
      <FullScreen>{element}</FullScreen>
    </Portal>
  )
}
