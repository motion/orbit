import { FullScreen } from 'gloss'
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { FloatingChrome } from './helpers/FloatingChrome'
import { isRightClick } from './helpers/isRightClick'
import { usePosition } from './hooks/usePosition'
import { getResizeCursor, ResizableSides } from './Interactive'
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

  usePosition({
    ref: parent || parentRef,
    preventMeasure: isVisible === false,
    debounce: 200,
    onChange: measure,
  })

  const isHoveringResize =
    isVisible &&
    !!resizingSides &&
    Object.keys(resizingSides).reduce((a, b) => a || resizingSides[b], false)

  // re-measure when hovering over a side starts
  useEffect(measure, [isHoveringResize])

  return (
    <FullScreen
      className="interactive-chrome"
      pointerEvents="none"
      ref={parentRef}
      onMouseEnter={measure}
    >
      <FloatingChrome
        className="interactive-floating-chrome"
        measureKey={measureKey}
        target={parentRef}
        {...rest}
        color={rest.color ? `${rest.color}` : null}
        onClick={useCallback(e => e.stopPropagation(), [])}
        onMouseDown={useCallback(
          e => {
            if (isRightClick(e)) return
            if (isHoveringResize) {
              e.preventDefault()
              e.stopPropagation()
            }
            rest.onMouseDown && rest.onMouseDown(e)
          },
          [isHoveringResize, rest.onMouseDown],
        )}
        style={useMemo(
          () => ({
            cursor: resizingSides ? getResizeCursor(resizingSides) : 'inherit',
            pointerEvents: (isHoveringResize ? 'auto' : 'none') as any,
            opacity: isHoveringResize ? 1 : 0.5,
          }),
          [isHoveringResize, resizingSides],
        )}
      />
    </FullScreen>
  )
}
