import * as React from 'react'
import { view } from '@mcro/black'
import { View } from '../blocks/View'

const ClearClickableArea = view({
  padding: 5,
  '&:hover > *': {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
})

const ClearFrame = view(View, {
  fontSize: 16,
  lineHeight: 15,
  fontWeight: 600,
  width: 17,
  height: 17,
  borderRadius: 999,
  textAlign: 'center',
  backgroundColor: 'rgba(0,0,0,0.1)',
  color: '#fff',
  display: 'block',
})

export const ClearButton = ({
  onClick,
  onHover,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
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
