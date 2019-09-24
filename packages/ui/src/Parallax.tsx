import { createStoreContext, useReaction } from '@o/use-store'
import { idFn, isDefined } from '@o/utils'
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
  parentEndPct: number
  parentStartPct: number
}

type ParallaxItemProps = {
  offset?: number
  speed?: number
  clamp?: boolean | 'end' | 'start'
  min?: number
  max?: number
  align?: 'end' | 'start' | 'center'
}

type ParallaxProps = ParallaxItemProps & {
  direction?: 'x' | 'y'
}

type ParallaxGeometryProps = ParallaxProps & {
  sizeKey: string
  version: MotionValue<number>
  parent: ParallaxContainerStore
  measurements: RefObject<ParallaxMeasurements>
}

class ParallaxGeometryStore extends GeometryStore<ParallaxGeometryProps> {
  useParallaxIntersection(props?: ParallaxItemProps) {
    const { direction, speed, offset, clamp, min, max, version, align, measurements } = {
      ...this.props,
      ...props,
    }
    return this.useViewportScroll(direction === 'x' ? 'xProgress' : 'yProgress').mergeTransform(
      // just use version to triger update
      [version],
      pagePct => {
        if (speed === 0) return 0
        const { parentEndPct, parentStartPct } = measurements.current
        let intersection = pagePct - parentStartPct
        const nodeSize = measurements.current.nodeSize
        const parentSize = measurements.current.parentSize
        const pctParent = parentSize / nodeSize
        intersection += speed * pctParent * intersection // * (parentSize / nodeSize)
        intersection += offset
        if (clamp) {
          intersection = Math.max(0, Math.min(intersection, 1))
        }
        if (isDefined(min)) intersection = Math.max(min, intersection)
        if (isDefined(max)) intersection = Math.max(max, intersection)
        return intersection
      },
    )
  }

  scrollTransform = (x: number) => {
    const { measurements } = this.props
    const nodeSize = measurements.current.nodeSize
    const parentSize = measurements.current.parentSize
    return x + x * (parentSize - nodeSize)
  }

  useParallax(props?: ParallaxItemProps) {
    return this.useParallaxIntersection(props).transform(this.scrollTransform)
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
    min,
    max,
    align,
    parallaxAnimate,
    ...viewProps
  } = props
  const ref = useRef(null)
  const parent = useParallaxContainer({ react: false })
  const offsetKey = direction === 'y' ? 'top' : 'left'
  const sizeKey = direction === 'y' ? 'height' : 'width'
  const version = useMotionValue(0)
  const state = useRef<ParallaxMeasurements>({
    nodeMeasurements: { width: 0, height: 0 },
    nodeSize: 0,
    parentSize: 0,
    parentEndPct: 0,
    parentStartPct: 0,
  })

  const update = () => {
    const bodySize = document.body[direction === 'y' ? 'clientHeight' : 'clientWidth']
    const windowSize = window[direction === 'y' ? 'innerHeight' : 'innerWidth']
    const measurements = state.current
    measurements.nodeSize = Math.max(1, measurements.nodeMeasurements[sizeKey])
    measurements.parentSize = Math.max(1, parent[sizeKey])
    const bodyScrollable = bodySize - windowSize
    const parentBottom = parent[offsetKey] + parent[sizeKey]
    measurements.parentEndPct = parentBottom / bodyScrollable
    measurements.parentStartPct = parent[offsetKey] / bodyScrollable
    console.log(parent[offsetKey], bodySize, windowSize)
    version.set(Math.random())
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
    throttle: 150,
    onChange({ width, height }) {
      if (clamp) {
        console.log('ok?', width, height)
      }
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
        version,
        sizeKey,
        parent,
        measurements: state,
        min,
        max,
        align,
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
