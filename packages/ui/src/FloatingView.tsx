import { FullScreen } from '@o/gloss'
import { useForceUpdate } from '@o/use-store'
import { isDefined, selectDefined } from '@o/utils'
import memoize from 'memoize-weak'
import React, { useCallback, useEffect, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { useGesture } from 'react-with-gesture'

import { Portal } from './helpers/portal'
import { useGet } from './hooks/useGet'
import { useWindowSize } from './hooks/useWindowSize'
import { Interactive, InteractiveProps } from './Interactive'
import { Omit } from './types'
import { useVisibility } from './Visibility'

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
  edgePad?: [number, number]
  attach?: 'bottom right' | 'bottom left' | 'top left' | 'top right'
  usePosition?: (width: number, height: number) => [number, number]
}

const useWindowAttachments = {
  'bottom right': memoize((px: number, py: number) => (width: number, height: number) =>
    useWindowSize({ adjust: ([x, y]) => [x - width - px, y - height - py] }),
  ),
  'bottom left': memoize((px: number, py: number) => (_, height: number) =>
    useWindowSize({ adjust: ([x, y]) => [x + px, y - height - py] }),
  ),
  'top left': memoize((px: number, py: number) => (_, _2) =>
    useWindowSize({ adjust: ([x, y]) => [x + px, y + py] }),
  ),
  'top right': memoize((px: number, py: number) => (width: number, _) =>
    useWindowSize({ adjust: ([x, y]) => [x - width - px, y + py] }),
  ),
}

const instantConf = { config: { duration: 0 } }

export function FloatingView(props: FloatingViewProps) {
  let {
    defaultWidth = 100,
    defaultHeight = 100,
    defaultLeft = 0,
    defaultTop = 0,
    children,
    disableDrag,
    zIndex = 1200000,
    pointerEvents = 'auto',
    usePosition,
    attach,
    edgePad = [0, 0],
    ...restProps
  } = props

  if (attach) {
    usePosition = useWindowAttachments[attach](...edgePad)
  }

  const controlledSize = typeof props.height !== 'undefined'
  const controlledPosition = typeof props.top !== 'undefined'
  const isVisible = useVisibility()
  const getProps = useGet(props)
  const forceUpdate = useForceUpdate()

  // these go stale when uncontrolled, just used initially
  const width = selectDefined(props.width, defaultWidth)
  const height = selectDefined(props.height, defaultHeight)
  // this will be updated with internal dim
  const curDim = useRef({ width, height })

  const usePos = usePosition ? usePosition(curDim.current.width, curDim.current.height) : undefined

  const x = selectDefined(props.left, usePos ? usePos[0] : defaultLeft)
  const y = selectDefined(props.top, usePos ? usePos[1] : defaultTop)

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
    const at = curPos.current
    if (sides.right) {
      update({ width: w, ...instantConf })
    }
    if (sides.bottom) {
      update({ height: h, ...instantConf })
    }
    if (sides.top) {
      const diff = h - at.height
      const top = at.xy[1] - diff
      update({ xy: [at.xy[0], top], height: at.height + diff, ...instantConf })
    }
    if (sides.left) {
      const diff = w - at.width
      const left = at.xy[0] - diff
      update({ xy: [left, at.xy[1]], width: at.width + diff, ...instantConf })
    }
  }, [])

  const bindGesture = useGesture(next => {
    const { down, delta } = next
    if (controlledPosition || disableDrag) {
      return
    }
    const xy = lastDrop.current.xy
    const nextxy = [delta[0] + xy[0], delta[1] + xy[1]]
    if (down) {
      update({ xy: nextxy, ...instantConf }, true)
    } else {
      commit()
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
            transform: spring.xy.interpolate((x1, y1) => `translate3d(${x1}px,${y1}px,0)`),
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
