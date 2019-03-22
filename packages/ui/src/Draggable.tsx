import { FullScreen, ViewProps } from '@o/gloss'
import React, { useEffect, useRef, useState } from 'react'
import { useRefGetter } from './hooks/useRefGetter'

export type DraggableProps = {
  disable?: boolean
  defaultX?: number
  defaultY?: number
  minX?: number
  minY?: number
  maxX?: number
  maxY?: number
}

export function Draggable(props: DraggableProps & ViewProps) {
  const { ref, top, left } = useDraggable(props)
  return <FullScreen ref={ref} top={top} left={left} {...props} />
}

export function useDraggable(
  props: DraggableProps & {
    onChange?: (pos: { top: number; left: number }) => any
  },
) {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({
    top: props.defaultY,
    left: props.defaultX,
  })
  const getOnChange = useRefGetter(props.onChange)
  const getPosition = useRefGetter(position)

  useEffect(
    () => {
      if (props.disable) return
      let startPos = {
        top: 0,
        left: 0,
      }

      const curPos = (e: MouseEvent) => ({
        top: e.pageY,
        left: e.pageX,
      })

      const onMouseMove = (e: MouseEvent) => {
        const diffTop = startPos.top - e.pageY
        const diffLeft = startPos.left - e.pageX
        const next = {
          top: getPosition().top - diffTop,
          left: getPosition().left - diffLeft,
        }
        if (getOnChange()) {
          getOnChange()(next)
        } else {
          setPosition(next)
        }
      }

      const onMouseUp = (e: MouseEvent) => {
        startPos = curPos(e)
        document.removeEventListener('mousemove', onMouseMove)
      }

      const onMouseDown = (e: MouseEvent) => {
        startPos = curPos(e)
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
