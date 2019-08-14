import { gloss, ThemeContext } from 'gloss'
import React, { useContext, useMemo } from 'react'

import { ViewProps } from './View/types'
import { View } from './View/View'

export type ArrowProps = ViewProps & {
  size: number
  towards?: 'top' | 'right' | 'bottom' | 'left'
}

const transforms = {
  right: { rotate: '90deg' },
  bottom: { rotate: '0deg' },
  left: { rotate: '-90deg' }, // x is -y here
  top: { rotate: '0deg' },
}

export const Arrow = ({
  size = 16,
  towards = 'bottom',
  boxShadow,
  opacity,
  border,
  background,
  ...props
}: ArrowProps) => {
  const theme = useContext(ThemeContext).activeTheme
  const onBottom = towards === 'bottom'
  const innerTop = size * (onBottom ? -1 : 1)
  const transformOuter = transforms[towards]

  let width = size
  let height = size

  // add extra space so we dont clip shadows
  if (towards === 'left') {
    // were rotated so inverse...
    width = size * 4
    transformOuter['x'] = -size * 1.5
  }

  const bg = background || theme.background
  const arrowInnerProps = useMemo(
    () => ({
      top: innerTop * 0.75,
      width: size,
      height: size,
      boxShadow,
      opacity,
      border,
      background: bg,
    }),
    [size, innerTop, bg, JSON.stringify({ boxShadow, opacity, border })],
  )

  return (
    <View {...props}>
      <ArrowOuter
        transformOrigin="top left"
        transform={transformOuter}
        width={width}
        height={height}
      >
        <ArrowMiddle width={size} height={size}>
          <ArrowInner {...arrowInnerProps} />
        </ArrowMiddle>
      </ArrowOuter>
    </View>
  )
}

// why arrowOuter and arrow? Because chrome transform rotate destroy overflow: hidden, so we nest one more
const ArrowOuter = gloss(View, {
  position: 'relative',
  overflow: 'hidden',
  alignItems: 'center',
})

const ArrowInner = gloss(View, {
  position: 'absolute',
  borderRadius: 1,
  transform: { rotate: '45deg' },
})

const ArrowMiddle = gloss(View)
