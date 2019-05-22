import { gloss } from 'gloss'
import React from 'react'

import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'

export const Message = gloss<SizedSurfaceProps>(
  props => <SizedSurface {...defaultProps} {...props} />,
  {
    userSelect: 'text',
    cursor: 'text',
    width: '100%',
  },
)

const defaultProps: Partial<SizedSurfaceProps> = {
  sizeLineHeight: 1.3,
  className: 'text',
  hoverStyle: false,
  activeStyle: false,
  flexDirection: 'row',
  pad: 'sm',
  sizeRadius: true,
  iconSize: 22,
  iconProps: {
    margin: 4,
  },
  elementProps: {
    display: 'block',
    whiteSpace: 'normal',
  },
}
