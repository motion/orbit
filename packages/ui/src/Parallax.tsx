import { createStoreContext, useReaction } from '@o/use-store'
import { isDefined } from '@o/utils'
import { MotionValue, useMotionValue } from 'framer-motion'
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import React from 'react'

import { AnimationStore, GeometryRenderer, GeometryStore, useGeometry } from './Geometry'
import { composeRefs } from './helpers/composeRefs'
import { elementOffset } from './helpers/elementOffset'
import { useDebounce } from './hooks/useDebounce'
import { useNodeSize } from './hooks/useNodeSize'
import { Rect, usePosition } from './hooks/usePosition'
import { useResizeObserver } from './hooks/useResizeObserver'
import { ViewProps } from './View/types'
import { View } from './View/View'

const rnd = x => (typeof x === 'number' ? Math.round(x * 100) / 100 : x)

class ParallaxStore {
  bounds: Rect = {
    top: 0,
    left: 0,
    height: 10,
    width: 10,
  }
  update(next: Partial<Rect>) {
    this.bounds = {
      ...this.bounds,
      ...next,
    }
  }
}

const ParallaxStoreContext = createStoreContext(ParallaxStore)
export const useParallaxContainer = ParallaxStoreContext.useStore

export type ParallaxContainerProps = ViewProps

export function ParallaxContainer(props: ParallaxContainerProps) {
  const ref = React.useRef(null)
  const store = ParallaxStoreContext.useCreateStore()

  useNodeSize({
    ref,
    onChange(size) {
      store.update(size)
    },
  })

  usePosition({
    ref,
    onChange(pos) {
      if (!pos) return
      store.update(pos)
    },
  })

  return (
    <ParallaxStoreContext.ProvideStore value={store}>
      <View position="relative" {...props} nodeRef={ref} />
    </ParallaxStoreContext.ProvideStore>
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
  stagger?: number
}

type ParallaxProps = ParallaxItemProps & {
  direction?: 'x' | 'y'
}

type ParallaxGeometryProps = ParallaxProps & {
  sizeKey: string
  version: MotionValue<number>
  parent: ParallaxStore
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
          let subtractor =
            align === 'start' ? parentStartPct : align === 'center' ? parentCenter : parentEndPct
          intersection = 1 + (pagePct - subtractor) / divisor
        }
        intersection *= speed
        intersection += offset
        if (stagger) {
          intersection += 0.3 * stagger * nodeStartPct
        }
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
      const mx = this.props.measurements.current
      const nodeSize = mx.nodeSize
      const parentSize = mx.parentSize
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
    parallax?: (geometry: ParallaxGeometryStore) => { [key: string]: AnimationStore }
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
    parallax,
    stagger,
    ...viewProps
  } = props
  const ref = useRef(null)
  const parent = useParallaxContainer({ react: false })
  const offsetKey = direction === 'y' ? 'top' : 'left'
  const sizeKey = direction === 'y' ? 'height' : 'width'
  const version = useMotionValue(0)
  const state = useRef<ParallaxMeasurements>({} as any)
  const documentRef = useRef(document.body)

  const update = () => {
    const bodySize = document.body[direction === 'y' ? 'clientHeight' : 'clientWidth']
    const windowSize = window[direction === 'y' ? 'innerHeight' : 'innerWidth']
    const parentBounds = parent.bounds
    const mx = state.current
    const nodeMeasurements = mx.nodeMeasurements
    if (!nodeMeasurements) return
    mx.nodeSize = Math.max(1, nodeMeasurements[sizeKey])
    mx.parentSize = Math.max(1, parentBounds[sizeKey])
    const bodyScrollable = bodySize - windowSize
    const parentBottom = parentBounds[offsetKey] + parentBounds[sizeKey]
    mx.parentEndPct = parentBottom / bodyScrollable
    mx.parentStartPct = parentBounds[offsetKey] / bodyScrollable
    mx.parentSizePct = mx.parentEndPct - mx.parentStartPct
    const nodeBottom = nodeMeasurements[offsetKey] + nodeMeasurements[sizeKey]
    mx.nodeEndPct = nodeBottom / bodyScrollable
    mx.nodeStartPct = nodeMeasurements[offsetKey] / bodyScrollable
    mx.nodeSizePct = mx.nodeEndPct - mx.nodeStartPct
    mx.frameSizePct = windowSize / bodyScrollable
    version.set(Math.random())
  }

  const updateDb = useDebounce(update, 40)

  useEffect(() => {
    window.addEventListener('resize', updateDb)
    return () => {
      window.removeEventListener('resize', updateDb)
    }
  }, [])

  useResizeObserver({
    ref: documentRef,
    onChange: updateDb,
  })

  useReaction(
    () => parent.bounds,
    updateDb,
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
      updateDb()
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
            {...(parallax
              ? parallax(geometry)
              : {
                  [direction]: geometry.useParallax(),
                })}
          />
        )
      }}
    </ParallaxGeometry>
  )
}
