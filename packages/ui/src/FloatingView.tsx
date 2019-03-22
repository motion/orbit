import { FullScreen } from '@o/gloss'
import React, { useCallback, useState } from 'react'
import { useDraggable } from './Draggable'
import { Portal } from './helpers/portal'
import { useRefGetter } from './hooks/useRefGetter'
import { Interactive, InteractiveProps } from './Interactive'
import { useVisiblity } from './Visibility'

// TODO:
// 1. new view <Draggable contain={[0, 0, window.innerWidth, window.innerHeight]} />
// 2. draggable prop here

export type FloatingViewProps = InteractiveProps & {
  disableDrag?: boolean
}

export function FloatingView({
  defaultWidth = 100,
  defaultHeight = 100,
  defaultLeft = 0,
  defaultTop = 0,
  children,
  disableDrag,
  ...restProps
}: FloatingViewProps) {
  const isVisible = useVisiblity()

  const [state, setState] = useState({
    left: defaultLeft,
    top: defaultTop,
    width: defaultWidth,
    height: defaultHeight,
  })
  const getState = useRefGetter(state)
  const getOnResize = useRefGetter(restProps.onResize)
  const onResize = useCallback((width, height, desW, desH, sides) => {
    if (getOnResize()) {
      getOnResize()(width, height, desW, desH, sides)
    } else {
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
    }
  }, [])

  const { ref } = useDraggable({
    defaultX: defaultLeft,
    defaultY: defaultTop,
    disable: disableDrag,
    onChange({ top, left }) {
      const diff = top - state.top
      state.top += diff
      const diffLeft = left - state.left
      state.left += diffLeft
      setState({ ...state })
    },
  })

  const visibilityProps = {
    pointerEvents: isVisible ? 'auto' : 'none',
    opacity: isVisible ? 1 : 0,
  }

  return (
    <Portal>
      <FullScreen pointerEvents="none">
        <Interactive
          pointerEvents="auto"
          {...visibilityProps}
          position="fixed"
          width={state.width}
          height={state.height}
          top={state.top}
          left={state.left}
          zIndex={12000000}
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
