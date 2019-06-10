import { gloss } from 'gloss'
import React, { memo, useLayoutEffect, useRef } from 'react'

import { useDebounceValue } from './hooks/useDebounce'
import { useNodeSize } from './hooks/useNodeSize'
import { SliderProps } from './Slider'
import { Col, ColProps } from './View/Col'
import { useVisibility, Visibility } from './Visibility'

type SliderPaneProps = ColProps &
  Partial<SliderProps> & {
    index?: number
    width?: number
    onChangeHeight?: Function
    currentHeight?: number
    isActive?: boolean
    curFrame?: number
    onMountChange?: (isMounted: boolean) => any
  }

export const SliderPane = memo(
  ({
    children,
    onChangeHeight,
    width,
    fixHeightToTallest,
    currentHeight,
    verticalPad,
    framePad,
    isActive,
    onMountChange,
    ...props
  }: SliderPaneProps) => {
    const ref = useRef(null)
    const visiblity = useVisibility()
    const shouldHide = useDebounceValue(!isActive, 300)
    const display = 'inherit' || (shouldHide && !isActive ? 'none' : 'inherit')

    // console.log('shouldHide', isActive, shouldHide, display)

    useLayoutEffect(() => {
      if (onMountChange) {
        onMountChange(true)
        return () => {
          onMountChange(false)
        }
      }
    }, [])

    useNodeSize({
      disable: !visiblity,
      throttle: 200,
      ref,
      onChange({ height }) {
        if (onChangeHeight) {
          onChangeHeight(height)
        }
      },
    })

    return (
      <Visibility visible={isActive}>
        <SliderPaneChrome
          width={width}
          height={fixHeightToTallest && currentHeight ? currentHeight : '100%'}
          ref={ref}
          padding={[verticalPad, framePad, verticalPad]}
          isActive={isActive}
          display={display}
          {...props}
        >
          {children}
        </SliderPaneChrome>
      </Visibility>
    )
  },
)

const SliderPaneChrome = gloss<ColProps & { isActive?: boolean }>(Col, {
  position: 'absolute',
  top: 0,
  left: 0,
  minHeight: 50,
  pointerEvents: 'none',
  opacity: 0,
  transform: {
    x: 20,
  },
  isActive: {
    pointerEvents: 'inherit',
    opacity: 1,
    transform: {
      x: 0,
    },
  },
})
