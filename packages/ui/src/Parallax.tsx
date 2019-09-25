import { createStoreContext, useReaction } from '@o/use-store'
import { idFn, isDefined } from '@o/utils'
import { MotionValue, useMotionValue } from 'framer-motion'
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import React from 'react'

import { AnimationStore, GeometryRenderer, GeometryStore, useGeometry } from './Geometry'
import { composeRefs } from './helpers/composeRefs'
import { elementOffset } from './helpers/elementOffset'
import { useNodeSize } from './hooks/useNodeSize'
import { Rect, usePosition } from './hooks/usePosition'
import { ViewProps } from './View/types'
import { View } from './View/View'

const rnd = x => Math.round(x * 100) / 100

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
      <View position="relative" border={[1, 'red']} {...props} nodeRef={ref} />
    </ParallaxContainerStoreContext.ProvideStore>
  )
}

type ParallaxMeasurements = {
  nodeMeasurements: { width: number; height: number; top: number; left: number }
  nodeSize: number
  parentSize: number
  frameSizePct: number
  parentEndPct: number
  parentStartPct: number
  parentSizePct: number
  nodeEndPct: number
  nodeStartPct: number
  nodeSizePct: number
}

type ParallaxItemProps = {
  offset?: number
  speed?: number
  clamp?: boolean | [number, number]
  min?: number
  max?: number
  align?: 'end' | 'start' | 'center'
  relativeTo?: 'node' | 'parent' | 'frame'
  stagger?: (x: ParallaxMeasurements) => number
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

const table = x =>
  console.table(
    Object.keys(x).reduce((acc, k) => {
      acc[k] = rnd(x[k])
      return acc
    }, {}),
  )

class ParallaxGeometryStore extends GeometryStore<ParallaxGeometryProps> {
  useParallaxIntersection(props?: ParallaxItemProps) {
    const {
      direction,
      speed,
      offset,
      clamp,
      min,
      max,
      version,
      align,
      measurements,
      relativeTo,
      stagger,
    } = {
      ...this.props,
      ...props,
    }
    let chain = this.useViewportScroll(direction === 'x' ? 'xProgress' : 'yProgress')
      // just use version to triger update
      .mergeTransform([version], pagePct => {
        if (speed === 0) return 0
        const {
          frameSizePct,
          parentEndPct,
          parentStartPct,
          nodeStartPct,
          nodeSizePct,
          parentSizePct,
        } = measurements.current

        let intersection = 0
        const parentCenter = parentEndPct - parentSizePct / 2
        const scrollCenter = pagePct + frameSizePct / 2

        const divisor = relativeTo === 'frame' ? frameSizePct : parentSizePct

        if (relativeTo === 'node') {
          intersection = 1 + (scrollCenter - nodeStartPct) / nodeSizePct
        } else {
          if (align === 'start') {
            intersection = 1 + (pagePct - parentStartPct) / divisor
          } else if (align === 'center') {
            intersection = 1 + (pagePct - parentCenter) / divisor
          } else {
            intersection = 1 + (pagePct - parentEndPct) / divisor
          }
        }

        if (stagger) {
          intersection -= stagger(measurements.current)
        }

        intersection *= speed
        intersection += offset
        if (isDefined(min)) intersection = Math.max(min, intersection)
        if (isDefined(max)) intersection = Math.max(max, intersection)
        if (clamp) {
          const [min, max] = clamp === true ? [0, 1] : clamp
          intersection = Math.max(min, Math.min(intersection, max))
        }
        return intersection
      })

    return chain
  }

  transforms = {
    scrollParentRelative: (x: number) => {
      const { measurements } = this.props
      const nodeSize = measurements.current.nodeSize
      const parentSize = measurements.current.parentSize
      return x + x * (parentSize - nodeSize)
    },
    scrollParentSize: (x: number) => {
      const { measurements } = this.props
      return x + measurements.current.parentSize
    },
    scrollNodeSize: (x: number) => {
      const { measurements } = this.props
      return x * measurements.current.nodeSize
    },
  }

  useParallax(props?: ParallaxItemProps) {
    return this.useParallaxIntersection(props).transform(this.transforms.scrollParentRelative)
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
    stagger,
    ...viewProps
  } = props
  const ref = useRef(null)
  const parent = useParallaxContainer({ react: false })
  const offsetKey = direction === 'y' ? 'top' : 'left'
  const sizeKey = direction === 'y' ? 'height' : 'width'
  const version = useMotionValue(0)
  const state = useRef<ParallaxMeasurements>({} as any)

  const update = () => {
    const bodySize = document.body[direction === 'y' ? 'clientHeight' : 'clientWidth']
    const windowSize = window[direction === 'y' ? 'innerHeight' : 'innerWidth']
    const mx = state.current
    const nodeMeasurements = mx.nodeMeasurements
    if (!nodeMeasurements) return
    mx.nodeSize = Math.max(1, nodeMeasurements[sizeKey])
    mx.parentSize = Math.max(1, parent[sizeKey])
    const bodyScrollable = bodySize - windowSize
    const parentBottom = parent[offsetKey] + parent[sizeKey]
    mx.parentEndPct = parentBottom / bodyScrollable
    mx.parentStartPct = parent[offsetKey] / bodyScrollable
    mx.parentSizePct = mx.parentEndPct - mx.parentStartPct
    const nodeBottom = nodeMeasurements[offsetKey] + nodeMeasurements[sizeKey]
    mx.nodeEndPct = nodeBottom / bodyScrollable
    mx.nodeStartPct = nodeMeasurements[offsetKey] / bodyScrollable
    mx.nodeSizePct = mx.nodeEndPct - mx.nodeStartPct
    mx.frameSizePct = windowSize / bodyScrollable
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
      const { top, left } = elementOffset(ref.current)
      state.current.nodeMeasurements = { width, height, top, left }
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
        stagger,
      }}
    >
      {(geometry, gref) => {
        return (
          <View
            {...viewProps}
            nodeRef={composeRefs(gref, ref, viewProps.nodeRef)}
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
