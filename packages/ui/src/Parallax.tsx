import { createStoreContext, useReaction } from '@o/use-store'
import { idFn } from '@o/utils'
import { MotionValue, useMotionValue } from 'framer-motion'
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import React from 'react'

import { AnimationStore, GeometryRenderer, GeometryStore, useGeometry } from './Geometry'
import { composeRefs } from './helpers/composeRefs'
import { useNodeSize } from './hooks/useNodeSize'
import { Rect, usePosition } from './hooks/usePosition'
import { ViewProps } from './View/types'
import { View } from './View/View'

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
}

const ParallaxContainerStoreContext = createStoreContext(ParallaxContainerStore)
export const useParallaxContainer = ParallaxContainerStoreContext.useStore

export type ParallaxContainerProps = ViewProps

export function ParallaxContainer(props: ParallaxContainerProps) {
  const ref = React.useRef(null)
  const store = ParallaxContainerStoreContext.useCreateStore()

  usePosition({
    ref,
    onChange(pos) {
      if (!pos) return
      store.update(pos)
    },
  })

  return (
    <ParallaxContainerStoreContext.ProvideStore value={store}>
      <View position="relative" {...props} nodeRef={ref} />
    </ParallaxContainerStoreContext.ProvideStore>
  )
}

type ParallaxMeasurements = {
  nodeMeasurements: { width: number; height: number }
  nodeSize: number
  parentSize: number
}

type ParallaxProps = {
  offset?: number
  speed?: number
  direction?: 'x' | 'y'
  clamp?: boolean | 'end' | 'start'
}

type ParallaxGeometryProps = ParallaxProps & {
  sizeKey: string
  nodeMove: MotionValue<number>
  parentEndPct: MotionValue<number>
  parent: ParallaxContainerStore
  measurements: RefObject<ParallaxMeasurements>
}

class ParallaxGeometryStore extends GeometryStore<ParallaxGeometryProps> {
  useParallax() {
    const { direction, speed, offset, clamp, parentEndPct, nodeMove, measurements } = this.props
    return this.useViewportScroll(direction === 'x' ? 'xProgress' : 'yProgress').mergeTransform(
      [nodeMove, parentEndPct],
      (pagePct, nodeMoveVal, parentEndPctVal) => {
        const parentPct = pagePct / parentEndPctVal

        const nodeSize = measurements.current.nodeSize
        let nodeOffsetVal = parentPct * nodeMoveVal

        if (offset) {
          const parentSize = measurements.current.parentSize
          nodeOffsetVal += parentSize * offset + nodeSize * offset
        }

        if (speed) {
          nodeOffsetVal *= speed
        }

        if (clamp) {
          console.table({
            nodeOffsetVal,
            nodeSize,
            pagePct,
            parentPct,
            nodeMoveVal,
            parentEndPctVal,
          })
        }

        return nodeOffsetVal
      },
    )
    // .transform([0, parentEndPct], [0, 1], { clamp: false })
    // .transform([0, -1], [0, speed], { clamp: false })
    // .mergeTransform([offsetPct], (pos, offsetPctVal) => {
    //   const offsetVal = offset * offsetPctVal * parent[sizeKey]
    //   const position = pos + offsetVal
    //   if (clamp) {
    //     console.log('pos', pos, offsetPctVal)
    //   }
    //   return position
    // })
  }
}

export function ParallaxGeometry({
  children,
  ...parallaxProps
}: { children: GeometryRenderer<ParallaxGeometryStore> } & ParallaxGeometryProps) {
  return useGeometry(children, ParallaxGeometryStore, parallaxProps)
}

export type ParallaxViewProps = Omit<ViewProps, 'direction'> &
  ParallaxProps & {
    parallaxAnimate?: (geometry: ParallaxGeometryStore) => { [key: string]: AnimationStore }
  }

export function ParallaxView(props: ParallaxViewProps) {
  const {
    offset = 0,
    speed = -1,
    direction = 'y',
    clamp = false,
    parallaxAnimate,
    ...viewProps
  } = props
  const ref = useRef(null)
  const parent = useParallaxContainer({ react: false })
  const offsetKey = direction === 'y' ? 'top' : 'left'
  const sizeKey = direction === 'y' ? 'height' : 'width'
  const nodeMove = useMotionValue(1)
  const parentEndPct = useMotionValue(0)
  const state = useRef<ParallaxMeasurements>({
    nodeMeasurements: { width: 0, height: 0 },
    nodeSize: 0,
    parentSize: 0,
  })

  const update = () => {
    const nodeSize = (state.current.nodeSize = Math.max(1, state.current.nodeMeasurements[sizeKey]))
    const parentSize = (state.current.parentSize = Math.max(1, parent[sizeKey]))

    // offsetPct
    const bodySize = document.body[direction === 'y' ? 'clientHeight' : 'clientWidth']
    const windowSize = window[direction === 'y' ? 'innerHeight' : 'innerWidth']
    // aim for center like scrollProgress
    const parentOffset = (parent[offsetKey] + parent[sizeKey]) / (bodySize - windowSize)
    parentEndPct.set(parentOffset)

    let next = offset >= 0 ? (parentSize - nodeSize) / parentSize : nodeSize / parentSize
    if (next >= 1) {
      next = 0.99
    } else if (next < 0) {
      // we went negative, child bigger than container
      next = 0.99
    }
    nodeMove.set(next * parentSize)
  }

  useReaction(
    () => [parent[sizeKey], parent[offsetKey]],
    update,
    {
      avoidRender: true,
    },
    [sizeKey, offsetKey],
  )

  useNodeSize({
    ref,
    throttle: 250,
    onChange({ width, height }) {
      state.current.nodeMeasurements = { width, height }
      update()
    },
  })

  return (
    <ParallaxGeometry
      {...{
        direction,
        speed,
        offset,
        clamp,
        parentEndPct,
        sizeKey,
        nodeMove,
        parent,
        measurements: state,
      }}
    >
      {(geometry, gref) => {
        return (
          <View
            nodeRef={composeRefs(gref, ref)}
            {...viewProps}
            animate
            transformOrigin="top center"
            {...(parallaxAnimate
              ? parallaxAnimate(geometry)
              : {
                  [direction]: geometry.useParallax(),
                })}
          />
        )
      }}
    </ParallaxGeometry>
  )
}
