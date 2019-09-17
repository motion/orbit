import { createStoreContext } from '@o/use-store'
import { idFn } from '@o/utils'
import { useMotionValue } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import React from 'react'

import { Geometry } from './Geometry'
import { composeRefs } from './helpers/composeRefs'
import { useNodeSize } from './hooks/useNodeSize'
import { Rect, usePosition } from './hooks/usePosition'
import { ViewProps } from './View/types'
import { View } from './View/View'

const ParallaxContainerStore = createStoreContext(
  class ParallaxContainerStore {
    key = 0
    top = 0
    left = 0
    height = 10
    width = 10
    update(pos: Rect) {
      this.top = pos.top
      this.left = pos.left
      this.height = pos.height
      this.width = pos.width
      this.key = Math.random()
      this.refresh()
    }
    refresh = idFn as any
    setRefresh(cb: Function) {
      this.refresh = cb
    }
  },
)

export type ParallaxContainerProps = ViewProps

export function ParallaxContainer(props: ParallaxContainerProps) {
  const ref = React.useRef(null)
  const store = ParallaxContainerStore.useCreateStore()

  usePosition({
    ref,
    onChange(pos) {
      if (!pos) return
      store.update(pos)
    },
  })

  return (
    <ParallaxContainerStore.ProvideStore value={store}>
      <View position="relative" {...props} nodeRef={ref} />
    </ParallaxContainerStore.ProvideStore>
  )
}

export type ParallaxViewProps = Omit<ViewProps, 'direction'> & {
  offset?: number
  speed?: number
  direction?: 'x' | 'y'
  debug?: boolean
  clamp?: boolean
}

export function ParallaxView({
  offset = 0,
  speed = -1,
  direction = 'y',
  clamp = false,
  debug,
  ...viewProps
}: ParallaxViewProps) {
  const ref = useRef(null)
  const parent = ParallaxContainerStore.useStore()
  const offsetKey = direction === 'y' ? 'top' : 'left'
  const sizeKey = direction === 'y' ? 'height' : 'width'
  const dirVal = parent[offsetKey]
  const offsetPct = useMotionValue(1)
  const state = useRef({
    nodeSize: { width: 0, height: 0 },
  })

  const update = () => {
    const nodeSize = Math.max(1, state.current.nodeSize[sizeKey])
    const parentSize = Math.max(1, parent[sizeKey])
    let next = offset >= 0 ? (parentSize - nodeSize) / parentSize : nodeSize / parentSize
    if (next >= 1) {
      next = 0.99
    } else if (next < 0) {
      // we went negative, child bigger than container
      next = 0.99
    }
    offsetPct.set(next)
  }

  useNodeSize({
    ref,
    throttle: 250,
    onChange({ width, height }) {
      state.current.nodeSize = { width, height }
      update()
    },
  })

  return (
    <Geometry key={dirVal}>
      {(geometry, gref) => (
        <View
          nodeRef={composeRefs(gref, ref)}
          {...viewProps}
          animate
          transformOrigin="top center"
          {...{
            [direction]: geometry
              .useViewportScroll(direction)
              .transform([dirVal, dirVal + 1], [0, -1], { clamp: false })
              .transform([0, -1], [0, speed], { clamp: false })
              .mergeTransform([offsetPct], (pos, offsetPctVal) => {
                const offsetVal = offset * offsetPctVal * parent[sizeKey]
                const position = pos + offsetVal
                if (clamp) {
                  const min = 0
                  const max = parent[sizeKey] - state.current.nodeSize[sizeKey]
                  return Math.max(min, Math.min(max, position))
                }
                return position
              }),
          }}
        />
      )}
    </Geometry>
  )
}
