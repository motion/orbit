import { FullScreen } from '@o/gloss'
import { isDefined, selectDefined } from '@o/utils'
import React, { useCallback, useEffect, useRef } from 'react'
// @ts-ignore
import { animated, useSpring } from 'react-spring'
import { useGesture } from 'react-with-gesture'
import { Portal } from './helpers/portal'
import { useGet } from './hooks/useGet'
import { Interactive, InteractiveProps } from './Interactive'
import { Omit } from './types'
import { useVisiblity } from './Visibility'

export type FloatingViewProps = Omit<InteractiveProps, 'padding'> & {
  padding?: number
  disableDrag?: boolean
  defaultTop?: number
  defaultLeft?: number
  defaultWidth?: number
  defaultHeight?: number
  zIndex?: number
}

export function FloatingView(props: FloatingViewProps) {
  const {
    defaultWidth = 100,
    defaultHeight = 100,
    defaultLeft = 0,
    defaultTop = 0,
    children,
    disableDrag,
    zIndex = 1200000,
    ...restProps
  } = props
  const controlledSize = typeof props.height !== 'undefined'
  const controlledPosition = typeof props.top !== 'undefined'
  const isVisible = useVisiblity()
  const getProps = useGet(props)
  const [{ xy, width, height }, set] = useSpring(() => ({
    xy: [selectDefined(props.left, defaultLeft), selectDefined(props.top, defaultTop)],
    width: selectDefined(props.width, defaultWidth),
    height: selectDefined(props.height, defaultHeight),
  }))
  const curDim = useGet({ xy, width, height })
  const prevDim = useRef({ height: 0, width: 0 })

  // sync props

  const syncDimensionProp = (dim: 'width' | 'height') => {
    const prev = prevDim.current
    const cur = curDim()[dim].getValue()
    if (isDefined(props[dim])) {
      if (props[dim] !== cur) {
        prev[dim] = cur
        set({ [dim]: props[dim] })
      }
    } else if (prev[dim]) {
      set({ [dim]: prev[dim] })
    }
  }

  useEffect(() => syncDimensionProp('width'), [props.width])
  useEffect(() => syncDimensionProp('height'), [props.height])

  // component logic

  const pos = {
    xy: xy.getValue(),
    width: width.getValue(),
    height: height.getValue(),
  }
  const curPos = useRef(pos)
  const lastDrop = useRef(pos)
  const interactiveRef = useRef(null)

  const update = useCallback((next: Partial<typeof pos>, config: Object = { duration: 0 }) => {
    curPos.current = { ...curPos.current, ...next }
    set({
      ...next,
      config,
    })
  }, [])

  const commit = useCallback(() => {
    lastDrop.current = curPos.current
  }, [])

  const onResize = useCallback((w, h, desW, desH, sides) => {
    const cb = getProps().onResize
    if (cb) {
      cb(w, h, desW, desH, sides)
    }
    const at = curPos.current
    if (sides.right) {
      update({ width: w })
    }
    if (sides.bottom) {
      update({ height: h })
    }
    if (sides.top) {
      const diff = h - at.height
      const top = at.xy[1] - diff
      update({ xy: [at.xy[0], top], height: at.height + diff })
    }
    if (sides.left) {
      const diff = w - at.width
      const left = at.xy[0] - diff
      update({ xy: [left, at.xy[1]], width: at.width + diff })
    }
  }, [])

  const bindGesture = useGesture(next => {
    const { down, delta } = next
    if (controlledPosition || disableDrag) {
      return
    }
    const [x, y] = lastDrop.current.xy
    const nextxy = [delta[0] + x, delta[1] + y]
    // const velocity = clamp(next.velocity, 1, 8)
    // { config: { mass: velocity, tension: 500 * velocity, friction: 50 } }
    if (down) {
      update({ xy: nextxy })
    } else {
      commit()
    }
  })

  return (
    <Portal>
      <FullScreen>
        <animated.div
          style={{
            pointerEvents: isVisible ? 'auto' : 'none',
            zIndex: zIndex,
            width,
            height,
            transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
            position: 'relative',
          }}
        >
          <Interactive
            ref={interactiveRef}
            opacity={isVisible ? 1 : 0}
            position="absolute"
            disabled={controlledSize}
            zIndex={zIndex + 1}
            {...restProps}
            width="100%"
            height="100%"
            onResize={onResize}
            onResizeEnd={commit}
          >
            <FullScreen {...bindGesture()} pointerEvents="inherit">
              {children}
            </FullScreen>
          </Interactive>
        </animated.div>
      </FullScreen>
    </Portal>
  )
}
