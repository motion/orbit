import { View } from '@o/ui'
import React from 'react'

// @ts-ignore
if (CSS.paintWorklet) {
  // @ts-ignore
  CSS.paintWorklet.addModule('/public/smooth-corners.js')
}

export const Squircle = props => (
  <View
    style={{
      'mask-image': 'paint(smooth-corners)',
      '-webkit-mask-image': 'paint(smooth-corners)',
    }}
    {...props}
  />
)
