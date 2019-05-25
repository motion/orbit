import React from 'react'

import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { getSize } from './Sizes'

export const Tag = ({ size = 0.9, ...props }: SizedSurfaceProps) => {
  const sz = getSize(size)
  return (
    <SizedSurface
      sizeRadius={0.9 * sz}
      sizeFont={1.2 * sz}
      sizePadding={0.7 * sz}
      sizeHeight={0.8 * sz}
      sizeLineHeight={0.9 * sz}
      fontWeight={500}
      WebkitAppRegion="no-drag"
      flexDirection="row"
      borderWidth={0}
      justifyContent="center"
      alignItems="center"
      display="inline-flex"
      alignSelf="flex-start"
      hoverStyle={!!props.onClick}
      activeStyle={!!props.onClick}
      {...props}
    />
  )
}
