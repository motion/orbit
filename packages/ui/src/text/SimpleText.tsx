import { CSSPropertySetStrict } from '@o/css'
import { alphaColor, AlphaColorProps, gloss, propsToTextSize, TextSizeProps } from '@o/gloss'
import { GlossProps } from '@o/gloss/_/gloss'
import React from 'react'
import { useScale } from '../Scale'

const ellipseStyle = {
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

export type SimpleTextProps = GlossProps<
  AlphaColorProps &
    TextSizeProps &
    CSSPropertySetStrict & {
      ellipse?: boolean
      children?: any
    }
>

export function SimpleText({ size = 1, ...props }: SimpleTextProps) {
  const scale = useScale()
  return <SimpleTextElement size={size * scale} {...props} />
}

export const SimpleTextElement = gloss({
  display: 'inline-block',
  whiteSpace: 'normal',
}).theme((props: any, theme) => {
  const textProps = propsToTextSize(props)
  const color = props.color || theme.color
  return {
    ...(props.ellipse && ellipseStyle),
    ...props,
    ...textProps,
    ...alphaColor({ color }, props),
  }
})
