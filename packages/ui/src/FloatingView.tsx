import { FullScreen } from '@o/gloss'
import { selectDefined } from '@o/utils'
import { clamp } from 'lodash'
import React, { useCallback, useRef } from 'react'
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
}

export function FloatingView(props: FloatingViewProps) {
  const {
    defaultWidth = 100,
    defaultHeight = 100,
    defaultLeft = 0,
    defaultTop = 0,
    children,
    disableDrag,
    padding,
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
  const getPos = useGet({
    left: xy.getValue()[0],
    top: xy.getValue()[1],
    width: width.getValue(),
    height: height.getValue(),
  })

  const onResize = useCallback((w, h, desW, desH, sides) => {
    const cb = getProps().onResize
    if (cb) {
      cb(w, h, desW, desH, sides)
    }
    const pos = getPos()
    if (sides.right) {
      set({ width: w })
    } else if (sides.bottom) {
      set({ height: h })
    } else if (sides.top) {
      const diff = h - pos.height
      const top = pos.top - diff
      const height = pos.height + diff
      set({ xy: [pos.left, top], height })
    } else if (sides.left) {
      const diff = w - pos.width
      const left = pos.left - diff
      const width = pos.width + diff
      set({ xy: [left, pos.top], width })
    }
  }, [])

  let lastDelta = useRef([props.defaultTop, props.defaultLeft])
  const bind = useGesture(({ down, delta, velocity }) => {
    if (controlledPosition) {
      return
    }
    velocity = clamp(velocity, 1, 8)
    if (!down) {
      lastDelta.current = delta
    }
    const [x, y] = lastDelta.current
    set({
      xy: down ? [delta[0] + x, delta[1] + y] : lastDelta.current,
      config: { duration: 0 },
      //{ mass: velocity, tension: 500 * velocity, friction: 50 },
    })
  })

  return (
    <Portal>
      <FullScreen pointerEvents="none">
        <animated.div
          style={{
            width,
            height,
            transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
            position: 'relative',
          }}
        >
          <Interactive
            pointerEvents={isVisible ? 'auto' : 'none'}
            opacity={isVisible ? 1 : 0}
            position="absolute"
            zIndex={12000000}
            disabled={controlledSize}
            padding={padding}
            {...restProps}
            width="100%"
            height="100%"
            onResize={onResize}
          >
            <FullScreen {...bind()} pointerEvents="inherit">
              {children}
            </FullScreen>
          </Interactive>
        </animated.div>
      </FullScreen>
    </Portal>
  )
}
