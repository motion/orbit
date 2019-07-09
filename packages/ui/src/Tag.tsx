import React from 'react'

import { SizedSurface, SizedSurfaceProps } from './SizedSurface'
import { getSize } from './Sizes'

export type TagProps = SizedSurfaceProps

export const Tag = ({ size = 0.9, ...props }: TagProps) => {
  const sz = getSize(size)
  return (
    <SizedSurface
      ellipse
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
      width="max-content"
      hoverStyle={!!props.onClick}
      activeStyle={!!props.onClick}
      {...props}
    />
  )
}
