import { gloss } from '@o/gloss'
import React from 'react'
import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'

export const Message = gloss<SizedSurfaceProps>(
  props => <SizedSurface sizeLineHeight={1.2} {...defaultProps} {...props} />,
  {
    userSelect: 'text',
    cursor: 'text',
    whiteSpace: 'normal',
    width: '100%',
  },
)

const defaultProps: Partial<SizedSurfaceProps> = {
  className: 'text',
  hoverStyle: false,
  activeStyle: false,
  flexDirection: 'row',
  pad: 'sm',
  sizeRadius: true,
  iconSize: 22,
  iconAfter: true,
  iconProps: {
    margin: 4,
  },
  elementProps: {
    display: 'block',
  },
}
