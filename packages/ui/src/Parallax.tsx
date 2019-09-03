import { createStoreContext, useForceUpdate } from '@o/use-store'
import { useMotionValue, useTransform, useViewportScroll } from 'framer-motion'
import { useLayoutEffect, useRef } from 'react'
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
    height = 0
    width = 0
    update(pos: Rect) {
      this.top = pos.top
      this.left = pos.left
      this.height = pos.height
      this.width = pos.width
      this.key = Math.random()
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
  const store = ParallaxContainerStore.useStore()
  const forceUpdate = useForceUpdate()
  const nodeSize = useNodeSize({
    ref,
  })
  const getKey = () => `${store.key}${nodeSize.height}${nodeSize.width}`
  const lastKey = useRef(getKey())
  const emptyMotion = useMotionValue(0)
  const { scrollY } = useViewportScroll()
  const dirVal = store[direction === 'y' ? 'top' : 'left']

  let shouldSwap = false
  const key = getKey()
  if (lastKey.current !== key) {
    shouldSwap = true
    lastKey.current = key
  }

  let pctHeight =
    offset >= 0 ? (store.height - nodeSize.height) / store.height : nodeSize.height / store.height

  if (pctHeight >= 1) {
    pctHeight = 0.99
  }

  let val = useTransform(shouldSwap ? emptyMotion : scrollY, [dirVal, dirVal + 1], [0, -1], {
    clamp: false,
  })
  val = useTransform(val, [0, -1], [0, speed], {
    clamp: false,
  })

  val = useTransform(
    val,
    x => x + offset * pctHeight * store[direction === 'y' ? 'height' : 'width'],
  )

  useLayoutEffect(() => {
    if (shouldSwap) {
      forceUpdate()
    }
  }, [shouldSwap])

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
