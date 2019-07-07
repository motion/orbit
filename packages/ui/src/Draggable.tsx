import { FullScreen, FullScreenProps } from 'gloss'
import React, { useEffect, useRef, useState } from 'react'
import { useGet } from './hooks/useGet'

export type DraggableProps = Omit<FullScreenProps, 'onChange'> & {
  disable?: boolean
  defaultX?: number
  defaultY?: number
  minX?: number
  minY?: number
  maxX?: number
  maxY?: number
  onChange?: (pos: { top: number; left: number }, diffTop: number, diffLeft: number) => any
}

// TODO hate destructuring games like this
export function Draggable({ onChange, ...props }: DraggableProps) {
  const { ref, top, left } = useDraggable({ onChange, ...props })
  return <FullScreen ref={ref} top={top} left={left} {...props} />
}

export function useDraggable(props: DraggableProps) {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({
    top: props.defaultY,
    left: props.defaultX,
  })
  const getOnChange = useGet(props.onChange)
  const getPosition = useGet(position)

  useEffect(() => {
    if (props.disable) return
    let startPos = {
      top: 0,
      left: 0,
    }
    let endPos = null

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
      endPos = next
      if (getOnChange()) {
        getOnChange()(next, diffTop, diffLeft)
      } else {
        setPosition(next)
      }
    }

    const onMouseUp = () => {
      setPosition(endPos)
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
  }, [props.disable, ref])

  return { ref, ...position }
}
