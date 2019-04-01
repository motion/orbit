import { FullScreen } from '@o/gloss';
import { selectDefined } from '@o/utils';
import { clamp } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { animated, useSpring } from 'react-spring';
import { useGesture } from 'react-with-gesture';
import { Portal } from './helpers/portal';
import { useGet } from './hooks/useGet';
import { Interactive, InteractiveProps } from './Interactive';
import { Omit } from './types';
import { useVisiblity } from './Visibility';

// TODO:
// 1. new view <Draggable contain={[0, 0, window.innerWidth, window.innerHeight]} />
// 2. draggable prop here

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
    height,
    width,
    padding,
    ...restProps
  } = props
  const controlledSize = typeof height !== 'undefined'
  const controlledPosition = typeof props.top !== 'undefined'
  const isVisible = useVisiblity()
  const [state, setState] = useState({
    width: selectDefined(width, defaultWidth),
    height: selectDefined(height, defaultHeight),
  })
  const getState = useGet(state)
  const getProps = useGet(props)

  const [{ xy }, set] = useSpring(() => ({
    xy: [selectDefined(props.left, defaultLeft), selectDefined(props.top, defaultTop)],
  }))

  const onResize = useCallback((w, h, desW, desH, sides) => {
    const cb = getProps().onResize
    if (cb) {
      cb(w, h, desW, desH, sides)
    }
    const ns = getState()
    if (sides.right) {
      ns.width = w
    }
    if (sides.bottom) {
      ns.height = h
    }
    if (sides.top) {
      const diff = h - ns.height
      // top -= diff
      ns.height += diff
    }
    if (sides.left) {
      const diff = w - ns.width
      // left -= diff
      ns.width += diff
    }
    // if (top || left) {
    //   set({ xy: [top || xy.top, left || xy.left] })
    // }

    setState({ ...ns })
  }, [])

  let lastDelta = useRef([props.defaultTop, props.defaultLeft])
  const bind = useGesture(({ down, delta, velocity }) => {
    velocity = clamp(velocity, 1, 8)
    if (!down) {
      lastDelta.current = delta
    }
    const [x, y] = lastDelta.current
    set({
      xy: down ? [delta[0] + x, delta[1] + y] : lastDelta.current,
      config: { mass: velocity, tension: 500 * velocity, friction: 50 },
    })
  })

  // const { ref } = useDraggable({
  //   defaultX: defaultLeft,
  //   defaultY: defaultTop,
  //   disable: disableDrag,
  //   // dragBoundaryPad: padding,
  //   onChange(next) {
  //     if (controlledPosition) {
  //       return
  //     }
  //     console.log('setting', next.left, next.top)
  //     set({ xy: [next.left, next.top],
  //       config: { mass: velocity, tension: 500 * velocity, friction: 50 }
  //     })
  //     // const diff = next.top - state.top
  //     // state.top += diff
  //     // const diffLeft = next.left - state.left
  //     // state.left += diffLeft
  //     // setState({ ...state })
  //   },
  // })

  return (
    <Portal>
      <FullScreen pointerEvents="none">
        <animated.div
          style={{
            width: state.width,
            height: state.height,
            // @ts-ignore
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
            width="100%"
            height="100%"
            {...restProps}
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
