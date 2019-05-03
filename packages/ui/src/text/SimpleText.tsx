import { Base, BaseProps, gloss } from '@o/gloss'
import { isDefined } from '@o/utils'
import React, { forwardRef } from 'react'

import { Config } from '../helpers/configure'
import { useScale } from '../Scale'

export type SimpleTextProps = BaseProps & {
  ellipse?: boolean
  selectable?: boolean
}

export const SimpleText = forwardRef(({ size = 1, ...props }: SimpleTextProps, ref) => {
  const scale = useScale()
  return (
    <SimpleTextElement
      applyPsuedoColors={isDefined(props.hoverStyle, props.activeStyle, props.focusStyle)}
      {...Config.defaultProps.text}
      ref={ref}
      size={size * scale}
      {...props}
    />
  )
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
  selectable: {
    userSelect: 'text',
  },
  pointable: {
    cursor: 'pointer',
  },
})
