import { Box } from 'gloss'
import React, { HTMLAttributes, memo, RefObject, useEffect, useState } from 'react'

import { getRect, Rect, usePosition } from '../hooks/usePosition'
import { Portal } from './portal'

// puts an item on top of render stack, but pinned to another items location

export const FloatingChrome = memo(function FloatingChrome(
  props: {
    zIndex?: number
    target: RefObject<HTMLElement>
    style?: any
    measureKey?: number
  } & HTMLAttributes<HTMLDivElement>,
) {
  const { target, style, measureKey, zIndex = 150000000, ...rest } = props
  const [pos, setPos] = useState<Rect | null>(null)
  const element = (
    <Box
      style={{
        position: 'absolute',
        zIndex,
        ...pos,
        ...style,
      }}
      {...rest}
    />
  )

  usePosition({
    ref: target,
    onChange: x => x.visible && setPos(x.rect),
  })

  useEffect(() => {
    const rect = getRect(target.current.getBoundingClientRect())
    setPos(rect)
  }, [target, measureKey])

  return (
    <Portal style={{ zIndex }}>
      <Box style={fullScreen as any}>{element}</Box>
    </Portal>
  )
})

const fullScreen = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
}
