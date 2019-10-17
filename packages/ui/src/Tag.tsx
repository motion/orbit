//!
import React, { memo } from 'react'

import { memoIsEqualDeep } from './helpers/memoHelpers'
import { getSize } from './Sizes'
import { Surface, SurfaceProps } from './Surface'

export type TagProps = SurfaceProps

// tag often takes string/simple children so use memo
export const Tag = memoIsEqualDeep(({ size = 0.9, ...props }: TagProps) => {
  const sz = getSize(size)
  return (
    <Surface
      ellipse
      sizeRadius={0.9 * sz}
      sizeFont={1.15 * sz}
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
      hoverStyle={!!props.onClick ? undefined : null}
      activeStyle={!!props.onClick ? undefined : null}
      {...props}
    />
  )
})
