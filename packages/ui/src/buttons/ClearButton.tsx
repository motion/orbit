import * as React from 'react'
import { view } from '@mcro/black'
import { View } from '../blocks/View'

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
  width: 16,
  height: 16,
  borderRadius: 999,
  textAlign: 'center',
  backgroundColor: 'rgba(0,0,0,0.1)',
  color: [255, 255, 255, 0.8],
  display: 'block',
  cursor: 'default',
})

export const ClearButton = ({
  onClick = null,
  onHover = null,
  onMouseDown = null,
  onMouseUp = null,
  onMouseEnter = null,
  onMouseLeave = null,
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
    <ClearFrame {...props}>&times;</ClearFrame>
  </ClearClickableArea>
)
