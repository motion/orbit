import { useForceUpdate } from '@o/use-store'
import { isDefined, selectDefined } from '@o/utils'
import { FullScreen } from 'gloss'
import memoize from 'memoize-weak'
import React, { useCallback, useEffect, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { useGesture } from 'react-with-gesture'

import { ActiveDraggables } from './Draggable'
import { Portal } from './helpers/portal'
import { useGet } from './hooks/useGet'
import { useWindowSize } from './hooks/useWindowSize'
import { Interactive, InteractiveProps } from './Interactive'
import { useVisibility } from './Visibility'

type Bounds = {
  top?: number
  left?: number
  right?: number
  bottom?: number
}

export type FloatingViewProps = Omit<InteractiveProps, 'padding' | 'width' | 'height'> & {
  width?: number
  height?: number
  padding?: number
  disableDrag?: boolean
  defaultTop?: number
  defaultLeft?: number
  defaultWidth?: number
  defaultHeight?: number
  zIndex?: number
  attach?: 'bottom right' | 'bottom left' | 'top left' | 'top right'
  usePosition?: (width: number, height: number) => [number, number]
  bounds?: Bounds
}

const useWindowAttachments = {
  'bottom right': memoize((bounds: Bounds) => (width: number, height: number) =>
    useWindowSize({
      adjust: ([x, y]) => [x - width - bounds.right, y - height - bounds.bottom],
      throttle: 100,
    }),
  ),
  'bottom left': memoize((bounds: Bounds) => (_, height: number) =>
    useWindowSize({
      adjust: ([x, y]) => [x + bounds.left, y - height - bounds.bottom],
      throttle: 100,
    }),
  ),
  'top left': memoize((bounds: Bounds) => (_, _2) =>
    useWindowSize({ adjust: ([x, y]) => [x + bounds.left, y + bounds.top], throttle: 100 }),
  ),
  'top right': memoize((bounds: Bounds) => (width: number, _) =>
    useWindowSize({
      adjust: ([x, y]) => [x - width - bounds.right, y + bounds.top],
      throttle: 100,
    }),
  ),
}

const instantConf = { config: { duration: 0 } }

const boundsContain = (
  bounds: Bounds,
  [windowWidth, windowHeight]: [number, number],
  left: number,
  top: number,
  curWidth: number,
  curHeight: number,
) => {
  const minX = bounds.left
  const maxX = windowWidth - bounds.right
  const minY = bounds.top
  const maxY = windowHeight - bounds.bottom
  const [x, xEnd] = fitBoundsDim(minX, maxX, left, left + curWidth)
  const [y, yEnd] = fitBoundsDim(minY, maxY, top, top + curHeight)
  return [x, y, xEnd - x, yEnd - y]
}

const fitBoundsDim = (low: number, high: number, curLow: number, curHigh: number) => {
  const shorten = curHigh - curLow - (high - low)
  if (shorten > 0) {
    curLow -= shorten
    curHigh -= shorten
  }
  if (curHigh > high) {
    const amt = curHigh - high
    curLow -= amt
    curHigh -= amt
  }
  if (curLow < low) {
    const amt = low - curLow
    curLow += amt
    if (shorten < 0) {
      curHigh += amt
    }
  }
  return [curLow, curHigh]
}

const defaultBounds = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

export function FloatingView(props: FloatingViewProps) {
  let {
    defaultWidth = 200,
    defaultHeight = 200,
    defaultLeft = 0,
    defaultTop = 0,
    children,
    disableDrag,
    zIndex = 1200000,
    pointerEvents = 'auto',
    usePosition,
    attach,
    bounds = defaultBounds,
    ...restProps
  } = props

  if (attach) {
    usePosition = useWindowAttachments[attach](bounds)
  }

  const windowSize = useWindowSize({ throttle: 100 })

  // todo dont let it go outside window!

  const controlledSize = typeof props.height !== 'undefined'
  const controlledPosition = typeof props.top !== 'undefined'
  const isVisible = useVisibility()
  const getProps = useGet(props)
  const forceUpdate = useForceUpdate()

  // these go stale when uncontrolled, just used initially
  let width = selectDefined(props.width, defaultWidth)
  let height = selectDefined(props.height, defaultHeight)

  // this will be updated with internal dim
  const curDim = useRef({ width, height })
  const usePos = usePosition ? usePosition(curDim.current.width, curDim.current.height) : undefined

  let x = selectDefined(props.left, usePos ? usePos[0] : defaultLeft)
  let y = selectDefined(props.top, usePos ? usePos[1] : defaultTop)

    // bounds adjust
  ;[x, y, width, height] = boundsContain(bounds, windowSize, x, y, width, height)

  const [spring, set] = useSpring(() => ({
    xy: [x, y],
    width,
    height,
  }))

  const curSpring = useGet(spring)
  const prevDim = useRef({ height: 0, width: 0 })

  // sync props

  const syncDimensionProp = (dim: 'width' | 'height' | 'xy', val: any) => {
    const prev = prevDim.current
    const cur = curSpring()[dim].getValue()
    if (Array.isArray(val) ? val.every(z => isDefined(z)) : isDefined(val)) {
      if (val !== cur) {
        prev[dim] = cur
        update({ [dim]: val })
      }
    } else if (prev[dim]) {
      set({ [dim]: prev[dim] })
    }
  }

  useEffect(() => syncDimensionProp('xy', [x, y]), [x, y])
  useEffect(() => syncDimensionProp('width', width), [width])
  useEffect(() => syncDimensionProp('height', height), [height])

  // component logic

  const pos = {
    xy: spring.xy.getValue(),
    width: spring.width.getValue(),
    height: spring.height.getValue(),
  }
  const curPos = useRef(pos)
  const lastDrop = useRef(pos)
  const interactiveRef = useRef(null)
  const commitTm = useRef(null)

  const update = useCallback((next: Partial<typeof pos> & any, preventCommit = false) => {
    curPos.current = { ...curPos.current, ...next }
    set(next)
    if (preventCommit) return
    clearTimeout(commitTm.current)
    commitTm.current = setTimeout(commit, 50)
  }, [])

  const commit = useCallback((next = null) => {
    lastDrop.current = { ...curPos.current, ...next }
    curDim.current = lastDrop.current
    if (next) {
      forceUpdate()
    }
  }, [])

  const onResize = useCallback((w, h, desW, desH, sides) => {
    const cb = getProps().onResize
    if (cb) {
      cb(w, h, desW, desH, sides)
    }
    const cur = curPos.current
    let { width, height } = cur
    let left = cur.xy[0]
    let top = cur.xy[1]

    if (sides.right) {
      width = w
    }
    if (sides.bottom) {
      height = h
    }
    if (sides.top) {
      const diff = h - cur.height
      top = cur.xy[1] - diff
      height = cur.height + diff
    }
    if (sides.left) {
      const diff = w - cur.width
      left = cur.xy[0] - diff
      width = cur.width + diff
    }

    update({ width, height, xy: [left, top], ...instantConf })
  }, [])

  const dragCancel = useRef(null)
  const bindGesture = useGesture(next => {
    const { down, delta, cancel } = next
    dragCancel.current = cancel
    ActiveDraggables.add(cancel)
    if (controlledPosition || disableDrag) {
      ActiveDraggables.remove(dragCancel.current)
      return
    }
    const xy = lastDrop.current.xy
    const nextxy = [delta[0] + xy[0], delta[1] + xy[1]]
    if (down) {
      update({ xy: nextxy, ...instantConf }, true)
    } else {
      commit()
      ActiveDraggables.remove(dragCancel.current)
    }
  })

  return (
    <Portal prepend>
      <FullScreen>
        <animated.div
          style={{
            pointerEvents: (isVisible ? pointerEvents : 'none') as any,
            zIndex,
            width: spring.width,
            height: spring.height,
            transform: spring.xy['to']((x1, y1) => `translate3d(${x1}px,${y1}px,0)`),
            position: 'fixed',
          }}
        >
          <Interactive
            ref={interactiveRef}
            opacity={isVisible ? 1 : 0}
            position="fixed"
            disabled={controlledSize}
            zIndex={zIndex + 1}
            {...restProps}
            width="100%"
            height="100%"
            onResize={onResize}
            onResizeEnd={commit}
          >
            <FullScreen
              className="ui-floating-view-content"
              {...bindGesture()}
              pointerEvents="inherit"
            >
              {children}
            </FullScreen>
          </Interactive>
        </animated.div>
      </FullScreen>
    </Portal>
  )
}
