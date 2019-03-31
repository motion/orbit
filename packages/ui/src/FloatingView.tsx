import { FullScreen } from '@o/gloss'
import { selectDefined } from '@o/utils'
import React, { useCallback, useState } from 'react'
import { useDraggable } from './Draggable'
import { Portal } from './helpers/portal'
import { useGet } from './hooks/useGet'
import { Interactive, InteractiveProps } from './Interactive'
import { useVisiblity } from './Visibility'

// TODO:
// 1. new view <Draggable contain={[0, 0, window.innerWidth, window.innerHeight]} />
// 2. draggable prop here

export type FloatingViewProps = InteractiveProps & {
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
    top,
    left,
    height,
    width,
    ...restProps
  } = props
  const controlledSize = typeof height !== 'undefined'
  const controlledPosition = typeof top !== 'undefined'
  const isVisible = useVisiblity()
  const [state, setState] = useState({
    left: selectDefined(left, defaultLeft),
    top: selectDefined(top, defaultTop),
    width: selectDefined(width, defaultWidth),
    height: selectDefined(height, defaultHeight),
  })
  const getState = useGet(state)
  const getProps = useGet(props)
  const onResize = useCallback((width, height, desW, desH, sides) => {
    const onResize = getProps().onResize
    if (onResize) {
      onResize(width, height, desW, desH, sides)
    }
    const next = getState()
    if (sides.right) {
      next.width = width
    }
    if (sides.bottom) {
      next.height = height
    }
    if (sides.top) {
      const diff = height - next.height
      next.top -= diff
      next.height += diff
    }
    if (sides.left) {
      const diff = width - next.width
      next.left -= diff
      next.width += diff
    }
    setState({ ...next })
  }, [])

  const { ref } = useDraggable({
    defaultX: defaultLeft,
    defaultY: defaultTop,
    disable: disableDrag,
    onChange({ top, left }) {
      if (controlledPosition) {
        return
      }
      const diff = top - state.top
      state.top += diff
      const diffLeft = left - state.left
      state.left += diffLeft
      setState({ ...state })
    },
  })

  return (
    <Portal>
      <FullScreen pointerEvents="none">
        <Interactive
          pointerEvents={isVisible ? 'auto' : 'none'}
          opacity={isVisible ? 1 : 0}
          position="fixed"
          width={state.width}
          height={state.height}
          top={state.top}
          left={state.left}
          zIndex={12000000}
          disabled={controlledSize}
          {...restProps}
          onResize={onResize}
        >
          <FullScreen ref={ref} pointerEvents="inherit">
            {children}
          </FullScreen>
        </Interactive>
      </FullScreen>
    </Portal>
  )
}
