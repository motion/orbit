import { View } from '@o/ui'
import React from 'react'

// @ts-ignore
if (CSS.paintWorklet) {
  // @ts-ignore
  CSS.paintWorklet.addModule('/public/smooth-corners.js')
}

export const Squircle = ({ boxShadow, width, height, position, margin, ...props }) => (
  <View
    {...{
      width,
      height,
      position,
      margin,
    }}
  >
    <View
      zIndex={2}
      style={{
        'mask-image': 'paint(smooth-corners)',
        '-webkit-mask-image': 'paint(smooth-corners)',
      }}
      {...{
        width,
        height,
      }}
      {...props}
    />
    {!!boxShadow && (
      <View
        position="absolute"
        zIndex={0}
        borderRadius={width / 3.5}
        {...{
          width,
          height,
          boxShadow,
        }}
      />
    )}
  </View>
)
