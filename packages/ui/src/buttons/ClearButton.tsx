import * as React from 'react'
import { view } from '@mcro/black'
import { View } from '../blocks/View'
import { Icon } from '../Icon'

const ClearClickableArea = view({
  padding: 5,
  '&:hover > *': {
    backgroundColor: 'rgba(0,0,0,0.45)',
    color: [255, 255, 255],
  },
})

const ClearFrame = view(View, {
  fontSize: 14,
  lineHeight: 13,
  fontWeight: 600,
  width: 18,
  height: 18,
  borderRadius: 999,
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0,0,0,0.1)',
  color: [255, 255, 255, 0.8],
  cursor: 'default',
})

export const ClearButton = ({
  onClick = null,
  onHover = null,
  onMouseDown = null,
  onMouseUp = null,
  onMouseEnter = null,
  onMouseLeave = null,
  children = <Icon name="remove" size={8} margin="auto" />,
  ...props
}) => (
  <ClearClickableArea
    {...{
      onClick,
      onHover,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      onMouseLeave,
    }}
  >
    <ClearFrame {...props}>{children}</ClearFrame>
  </ClearClickableArea>
)
