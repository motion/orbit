import { CSSPropertySetStrict } from '@o/css'
import { AlphaColorProps, Base, gloss, GlossProps, TextSizeProps } from '@o/gloss'
import React, { forwardRef } from 'react'
import { useScale } from '../Scale'

export type SimpleTextProps = GlossProps<
  AlphaColorProps &
    TextSizeProps &
    CSSPropertySetStrict & {
      ellipse?: boolean
      children?: any
    }
>

export const SimpleText = forwardRef(({ size = 1, ...props }: SimpleTextProps, ref) => {
  const scale = useScale()
  return <SimpleTextElement ref={ref} size={size * scale} {...props} />
})

export const SimpleTextElement = gloss<SimpleTextProps>(Base, {
  display: 'inline-block',
  whiteSpace: 'normal',
  ellipse: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})
