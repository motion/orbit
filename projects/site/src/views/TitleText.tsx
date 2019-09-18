import { getSizeRelative, Title, TitleProps } from '@o/ui'
import React from 'react'

const titleProps = {
  fontWeight: 800,
  selectable: true,
}

export const TitleText = (props: TitleProps) => {
  // automatically do a small size
  const size = props.size || 'lg'
  const smSize =
    props['sm-size'] || (typeof size === 'string' ? getSizeRelative(size as any, -1) : size)
  return <Title selectable {...titleProps} {...props} size={size} sm-size={smSize} />
}
