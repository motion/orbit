import * as React from 'react'
import { view } from '@mcro/black'
import { View } from '../blocks/View'

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
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
})

export const ClearButton = props => (
  <ClearFrame debug {...props}>
    &times;
  </ClearFrame>
)
