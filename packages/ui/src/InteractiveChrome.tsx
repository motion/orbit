import { FullScreen } from '@o/gloss'
import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { FloatingChrome } from './helpers/FloatingChrome'
import { isRightClick } from './helpers/isRightClick'
import { useScreenPosition } from './hooks/useScreenPosition'
import { getResizeCursor, ResizableSides } from './Interactive'
import { Omit } from './types'
import { ViewProps } from './View/View'
import { useVisibility } from './Visibility'

type InteractiveChromeProps = Omit<ViewProps, 'zIndex'> & {
  zIndex?: number
  parent?: RefObject<HTMLElement>
  resizingSides: ResizableSides
}

export const InteractiveChrome = ({ resizingSides, parent, ...rest }: InteractiveChromeProps) => {
  const parentRef = useRef<HTMLElement>(null)
  const [measureKey, setMeasureKey] = useState(0)
  const measure = useCallback(() => setMeasureKey(Math.random()), [])
  const isVisible = useVisibility()

  useScreenPosition({
    ref: parent || parentRef,
    preventMeasure: isVisible === false,
    debounce: 200,
    onChange: measure,
  })

  const isHoveringResize =
    !!resizingSides && Object.keys(resizingSides).reduce((a, b) => a || resizingSides[b], false)

  // re-measure when hovering over a side starts
  useEffect(() => {
    setMeasureKey(Math.random())
  }, [isHoveringResize])

  return (
    <FullScreen
      className="interactive-chrome"
      pointerEvents="none"
      ref={parentRef}
      onMouseEnter={measure}
    >
      <FloatingChrome
        measureKey={measureKey}
        target={parentRef}
        {...rest}
        onMouseDown={e => {
          console.log('mouse down')
          if (isRightClick(e)) return
          if (isHoveringResize) {
            console.warn('no more bad click')
            e.preventDefault()
            e.stopPropagation()
          }
          rest.onMouseDown && rest.onMouseDown(e)
        }}
        style={{
          cursor: resizingSides ? getResizeCursor(resizingSides) : 'inherit',
          pointerEvents: (isHoveringResize ? 'all' : 'none') as any,
          opacity: isHoveringResize ? 1 : 0,
          background: 'green',
        }}
      />
    </FullScreen>
  )
}
