import { FullScreen, gloss } from '@o/gloss'
import React, { RefObject, useCallback, useRef, useState } from 'react'
import { FloatingChrome } from './helpers/FloatingChrome'
import { isRightClick } from './helpers/isRightClick'
import { useScreenPosition } from './hooks/useScreenPosition'
import { useThrottle } from './hooks/useThrottle'
import { horizontal, ResizableSides, vertical } from './Interactive'
import { Omit } from './types'
import { ViewProps } from './View/View'

type InteractiveChromeProps = Omit<ViewProps, 'zIndex'> & {
  zIndex?: number
  parent?: RefObject<HTMLElement>
  side: keyof ResizableSides
  hovered?: boolean
}

export const InteractiveChrome = ({ side, hovered, parent, ...rest }: InteractiveChromeProps) => {
  const chromeRef = useRef<HTMLElement>(null)
  const parentRef = useRef<HTMLElement>(null)
  const [measureKey, setMeasureKey] = useState(0)
  const [visible, setVisible] = useState(false)
  // fixes bug where clicking makes it go away
  const [intHovered, setIntHovered] = useState(false)
  const throttle = useThrottle()
  const onChange = useCallback(
    throttle(({ visible }) => {
      setMeasureKey(Math.random())
      setVisible(visible)
    }, 32),
    [],
  )

  useScreenPosition({
    ref: parent || parentRef,
    preventMeasure: true,
    onChange,
  })

  const shouldCover = intHovered || (visible && hovered)

  return (
    <FullScreen pointerEvents="none" ref={parentRef}>
      <InteractiveMeasure
        ref={chromeRef}
        onLeft={side === 'left'}
        onRight={side === 'right'}
        onBottom={side === 'bottom'}
        onTop={side === 'top'}
      />
      <FloatingChrome
        measureKey={measureKey}
        target={chromeRef}
        {...rest}
        onMouseEnter={() => setIntHovered(true)}
        onMouseLeave={e => {
          setIntHovered(false)
          rest.onMouseLeave && rest.onMouseLeave(e)
        }}
        onMouseDown={e => {
          if (isRightClick(e)) return
          if (shouldCover) {
            console.warn('no more bad click')
            e.preventDefault()
            e.stopPropagation()
          }
          rest.onMouseDown && rest.onMouseDown(e)
        }}
        style={{
          cursor: side === 'left' || side === 'right' ? 'ew-resize' : 'nw-resize',
          pointerEvents: (shouldCover ? 'all' : 'none') as any,
          opacity: shouldCover ? 1 : 0,
        }}
      />
    </FullScreen>
  )
}

const OFFSET = 0 // SIZE / 2

const InteractiveMeasure = gloss({
  position: 'absolute',
  pointerEvents: 'none',
  onLeft: {
    ...vertical,
    left: -OFFSET,
  },
  onRight: {
    ...vertical,
    right: -OFFSET,
  },
  onBottom: {
    ...horizontal,
    bottom: -OFFSET,
  },
  onTop: {
    ...horizontal,
    top: -OFFSET,
  },
})
