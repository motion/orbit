import { gloss } from 'gloss'
import React, { memo, useLayoutEffect, useRef } from 'react'

import { useDebounceValue } from './hooks/useDebounce'
import { useNodeSize } from './hooks/useNodeSize'
import { SliderProps } from './Slider'
import { Stack, StackProps } from './View/Stack'
import { ProvideVisibility, useVisibility } from './Visibility'

type SliderPaneProps = StackProps &
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
      <ProvideVisibility visible={isActive}>
        <SliderPaneChrome
          width={width}
          height={fixHeightToTallest && currentHeight ? currentHeight : '100%'}
          nodeRef={ref}
          padding={[verticalPad, framePad, verticalPad]}
          isActive={isActive}
          display={display}
          {...props}
        >
          {children}
        </SliderPaneChrome>
      </ProvideVisibility>
    )
  },
)

const SliderPaneChrome = gloss<StackProps & { isActive?: boolean }>(Stack, {
  position: 'absolute',
  top: 0,
  left: 0,
  minHeight: 50,
  pointerEvents: 'none',
  opacity: 0,
  transform: {
    x: 20,
  },
  conditional: {
    isActive: {
      pointerEvents: 'inherit',
      opacity: 1,
      transform: {
        x: 0,
      },
    },
  },
})
