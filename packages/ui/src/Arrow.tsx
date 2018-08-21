import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import { Col } from './blocks/Col'
import { Color, ThemeObject } from '@mcro/gloss'

type Props = {
  size: number
  color?: Color
  towards?: 'top' | 'right' | 'bottom' | 'left'
  theme?: ThemeObject
  boxShadow?: any
  background?: Color
  opacity?: number
  border?: Array<any> | string
}

// why arrowOuter and arrow? Because chrome transform rotate destroy overflow: hidden, so we nest one more
const ArrowOuter = view({
  position: 'relative',
  overflow: 'hidden',
})

const ArrowInner = view({
  position: 'absolute',
  left: 0,
  borderRadius: 1,
  transform: { rotate: '45deg' },
})

export const Arrow = attachTheme(
  ({
    size = 16,
    towards = 'bottom',
    boxShadow,
    opacity,
    border,
    background,
    theme,
    ...props
  }: Props) => {
    const onBottom = towards === 'bottom'
    const innerTop = size * (onBottom ? -1 : 1)
    const transform = {
      right: { rotate: '90deg' },
      bottom: { rotate: '0deg' },
      left: { rotate: '-90deg', x: 0, y: -10 },
      top: { rotate: '0deg' },
    }[towards]
    const rotate = {
      left: '0deg',
      right: '0deg',
      bottom: '0deg',
      top: '0deg',
    }[towards]
    return (
      <Col {...props}>
        <ArrowOuter css={{ transform, width: size, height: size }}>
          <Col
            css={{
              transform: { rotate: rotate },
              width: size,
              height: size,
            }}
          >
            <ArrowInner
              css={{
                top: innerTop * 0.75,
                width: size,
                height: size,
                boxShadow,
                opacity,
                border,
                background: background || theme.background,
              }}
            />
          </Col>
        </ArrowOuter>
      </Col>
    )
  },
)
