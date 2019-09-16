import { createStoreContext, useReaction } from '@o/use-store'
import { idFn } from '@o/utils'
import { useMotionValue } from 'framer-motion'
import React from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

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
      <View {...props} nodeRef={ref} />
    </ParallaxContainerStore.ProvideStore>
  )
}

export type ParallaxViewProps = Omit<ViewProps, 'direction'> & {
  offset?: number
  speed?: number
  direction?: 'x' | 'y'
  debug?: boolean
}

export function ParallaxView({
  offset = 0,
  speed = -1,
  direction = 'y',
  debug,
  ...viewProps
}: ParallaxViewProps) {
  const ref = useRef(null)
  const store = ParallaxContainerStore.useStore({ react: false })
  const dirVal = useReaction(() => store[direction === 'y' ? 'top' : 'left'])
  const pctHeight = useMotionValue(1)
  const state = useRef({
    pctHeight: 0,
    parentSize: 0,
    nodeSize: { width: 0, height: 0 },
  })

  const update = () => {
    const nodeSize = Math.max(1, state.current.nodeSize[direction === 'y' ? 'height' : 'width'])
    let next = offset >= 0 ? nodeSize / store.height : nodeSize / store.height
    if (next >= 1) {
      next = 0.99
    }
    if (next <= 0) {
      // we went negative, assume child bigger than container
      next = 0.99
    }
    state.current.pctHeight = next
    pctHeight.set(next)
    // debug && console.log('next', scrollY, next, offset, nodeSize, store.height)
    // scrollY.set(scrollY.get())
  }

  useNodeSize({
    ref,
    throttle: 250,
    onChange({ width, height }) {
      state.current.nodeSize = { width, height }
      update()
    },
  })

  // update based on store changes
  useReaction(
    () => {
      state.current.parentSize = store[direction === 'y' ? 'height' : 'width']
      update()
    },
    {
      avoidRender: true,
      name: 'ParallaxView.parentSize',
    },
  )

  return (
    <Geometry>
      {(geometry, gref) => (
        <View
          nodeRef={composeRefs(gref, ref)}
          {...viewProps}
          animate
          transformOrigin="top center"
          {...{
            [direction]: geometry
              .useViewportScroll(direction)
              .mergeTransform([pctHeight], (scroll, _) => {
                return scroll
              })
              .transform([dirVal, dirVal + 1], [0, -1], { clamp: false })
              .transform([0, -1], [0, speed], { clamp: false })
              .transform(x => {
                // debug &&
                //   console.log(
                //     '>>',
                //     scrollY.get(),
                //     x,
                //     offset,
                //     state.current.pctHeight,
                //     store[direction === 'y' ? 'height' : 'width'],
                //   )
                return (
                  x +
                  offset * state.current.pctHeight * store[direction === 'y' ? 'height' : 'width']
                )
              }),
          }}
        />
      )}
    </Geometry>
  )
}

export const Parallax = {
  Container: ParallaxContainer,
  View: ParallaxView,
}
