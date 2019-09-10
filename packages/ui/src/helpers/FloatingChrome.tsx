import { isEqual } from '@o/fast-compare'
import { Box } from 'gloss'
import React, { HTMLAttributes, RefObject, useEffect, useMemo, useState } from 'react'

import { Rect, usePosition } from '../hooks/usePosition'
import { ViewProps } from '../View/types'
import { View } from '../View/View'
import { Portal } from './portal'

// puts an item on top of render stack, but pinned to another items location

export type FloatingChromeProps = ViewProps & {
  target: RefObject<HTMLElement>
  measureKey?: number
}

export const FloatingChrome = (props: FloatingChromeProps) => {
  const { target, style, measureKey, zIndex = 150000000, ...rest } = props
  const [pos, setPos] = useState<Rect | null>(null)

  usePosition({
    ref: target,
    measureKey,
    onChange: next => {
      if (next) {
        setPos(cur => {
          if (!isEqual(cur, next)) {
            console.warn('UPDATING', target, next)
            return next
          }
        })
      }
    },
    debounce: 100,
  })

  return (
    <Portal style={useMemo(() => ({ zIndex }), [zIndex])}>
      <Box style={fullScreen}>
        <View
          style={{
            position: 'absolute',
            zIndex,
            background: 'red',
            ...pos,
            ...style,
          }}
          {...rest}
        />
      </Box>
    </Portal>
  )
}

const fullScreen = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
} as const
