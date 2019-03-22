import { FullScreen, ViewProps } from '@o/gloss'
import React, { useEffect, useRef, useState } from 'react'
import { useRefGetter } from './hooks/useRefGetter'

export type DraggableProps = {
  disable?: boolean
  minX?: number
  minY?: number
  maxX?: number
  maxY?: number
}

export function Draggable(props: DraggableProps & ViewProps) {
  const { ref, top, left } = useDraggablePosition(props)
  return <FullScreen ref={ref} top={top} left={left} {...props} />
}

export function useDraggablePosition(
  props: DraggableProps & {
    onChange?: (pos: { top: number; left: number }) => any
  },
) {
  const ref = useRef<HTMLElement>(null)
  const getOnChange = useRefGetter(props.onChange)
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  })

  useEffect(
    () => {
      if (props.disable) return

      const onMouseMove = (e: MouseEvent) => {
        const next = {
          top: e.pageY,
          left: e.pageX,
        }
        if (getOnChange()) {
          getOnChange()(next)
        } else {
          setPosition(next)
        }
      }

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
      }

      const onMouseDown = () => {
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }

      ref.current.addEventListener('mousedown', onMouseDown)

      return () => {
        ref.current.removeEventListener('mousedown', onMouseDown)
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
      }
    },
    [props.disable, ref],
  )

  return { ref, ...position }
}
