import { FullScreen } from '@o/gloss'
import React, { useCallback, useState } from 'react'
import { useDraggablePosition } from './Draggable'
import { useRefGetter } from './hooks/useRefGetter'
import { Interactive, InteractiveProps } from './Interactive'

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
  const [state, setState] = useState({
    left: defaultLeft,
    top: defaultTop,
    width: defaultWidth,
    height: defaultHeight,
  })
  const getState = useRefGetter(state)
  const getOnResize = useRefGetter(restProps.onResize)
  const onResize = useCallback(
    (width, height, desW, desH, sides) => {
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
          console.log('set next', height, next.height, height - next.height)
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
    },
    [Math.random()],
  )

  const { ref } = useDraggablePosition({
    disable: disableDrag,
    onChange({ top, left }) {
      // TODO make it take into account initial pos
      const next = getState()
      const diff = top - next.top
      next.top += diff
      const diffLeft = left - next.left
      next.left += diffLeft
      setState({ ...next })
    },
  })

  return (
    <Interactive
      position="fixed"
      width={state.width}
      height={state.height}
      top={state.top}
      left={state.left}
      {...restProps}
      onResize={onResize}
    >
      <FullScreen ref={ref}>{children}</FullScreen>
    </Interactive>
  )
}
