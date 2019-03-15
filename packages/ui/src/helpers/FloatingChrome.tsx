import { FullScreen } from '@o/gloss'
import React, { HTMLAttributes, RefObject, useEffect, useState } from 'react'
import { getRect, Rect, useScreenPosition } from '../hooks/useScreenPosition'
import { Portal } from './portal'

// puts an item on top of render stack, but pinned to another items location

export function FloatingChrome(
  props: {
    target: RefObject<HTMLElement>
    style?: any
    measureKey?: number
  } & HTMLAttributes<HTMLDivElement>,
) {
  const { target, style, measureKey, ...rest } = props
  const [pos, setPos] = useState<Rect | null>(null)
  const element = (
    <div
      className="testme"
      style={{
        position: 'absolute',
        zIndex: 10000000000000000000,
        ...pos,
        ...style,
      }}
      {...rest}
    />
  )

  useScreenPosition({
    ref: target,
    onChange: x => x.visible && setPos(x.rect),
  })

  useEffect(
    () => {
      const rect = getRect(target.current.getBoundingClientRect())
      setPos(rect)
    },
    [target, measureKey],
  )

  return (
    <Portal>
      <FullScreen>{element}</FullScreen>
    </Portal>
  )
}
