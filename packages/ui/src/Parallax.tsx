import { createStoreContext, useReaction } from '@o/use-store'
import { idFn } from '@o/utils'
import { useTransform, useViewportScroll } from 'framer-motion'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import React from 'react'

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
}

export function ParallaxView({
  offset = 0,
  speed = -1,
  direction = 'y',
  ...viewProps
}: ParallaxViewProps) {
  const ref = useRef(null)
  const store = ParallaxContainerStore.useStore({ react: false })
  const { scrollY } = useViewportScroll()
  const dirVal = useReaction(() => store[direction === 'y' ? 'top' : 'left'])
  const state = useRef({
    pctHeight: 0,
    parentSize: 0,
    nodeSize: { width: 0, height: 0 },
  })

  const update = () => {
    const nodeSize = state.current.nodeSize[direction === 'y' ? 'height' : 'width']
    let pctHeight = offset >= 0 ? (store.height - nodeSize) / store.height : nodeSize / store.height
    if (pctHeight >= 1) {
      pctHeight = 0.99
    } else if (pctHeight < 0) {
      // we went negative, child bigger than container
      pctHeight = 0.99
    }
    state.current.pctHeight = pctHeight
    scrollY.set(scrollY.get())
  }

  useNodeSize({
    ref,
    throttle: 250,
    onChange({ width, height }) {
      console.log('node size', height, store.height)
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

  let val = useTransform(scrollY, [dirVal, dirVal + 1], [0, -1], {
    clamp: false,
  })
  val = useTransform(val, [0, -1], [0, speed], {
    clamp: false,
  })

  val = useTransform(
    val,
    x => x + offset * state.current.pctHeight * store[direction === 'y' ? 'height' : 'width'],
  )

  return (
    <View
      nodeRef={ref}
      {...viewProps}
      animate
      transformOrigin="top center"
      {...{ [direction]: val }}
    />
  )
}

export const Parallax = {
  Container: ParallaxContainer,
  View: ParallaxView,
}
