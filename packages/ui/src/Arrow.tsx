import { ColorLike } from '@o/css'
import { Col, Contents, CSSPropertySet, gloss, ThemeContext } from '@o/gloss'
import * as React from 'react'

type Props = CSSPropertySet & {
  size: number
  color?: ColorLike
  towards?: 'top' | 'right' | 'bottom' | 'left'
  boxShadow?: any
  background?: ColorLike
  opacity?: number
  border?: Array<any> | string
}

export function Arrow({
  size = 16,
  towards = 'bottom',
  boxShadow,
  opacity,
  border,
  background,
  ...props
}: Props) {
  const theme = React.useContext(ThemeContext).activeTheme
  const onBottom = towards === 'bottom'
  const innerTop = size * (onBottom ? -1 : 1)
  const transformOuter = {
    right: { rotate: '90deg' },
    bottom: { rotate: '0deg' },
    left: { rotate: '-90deg' }, // x is -y here
    top: { rotate: '0deg' },
  }[towards]

  let width = size
  let height = size

  // add extra space so we dont clip shadows
  if (towards === 'left') {
    // were rotated so inverse...
    width = size * 4
    transformOuter['x'] = -size * 1.5
  }
  // TODO do for rest...

  return (
    <Contents {...props}>
      <ArrowOuter
        transformOrigin="top left"
        transform={transformOuter}
        width={width}
        height={height}
      >
        <ArrowMiddle width={size} height={size}>
          <ArrowInner
            {...{
              top: innerTop * 0.75,
              width: size,
              height: size,
              boxShadow,
              opacity,
              border,
              background: background || theme.background,
            }}
          />
        </ArrowMiddle>
      </ArrowOuter>
    </Contents>
  )
}

// why arrowOuter and arrow? Because chrome transform rotate destroy overflow: hidden, so we nest one more
const ArrowOuter = gloss(Col, {
  position: 'relative',
  overflow: 'hidden',
  alignItems: 'center',
})

const ArrowInner = gloss(Col, {
  position: 'absolute',
  borderRadius: 1,
  transform: { rotate: '45deg' },
})

const ArrowMiddle = gloss(Col)
