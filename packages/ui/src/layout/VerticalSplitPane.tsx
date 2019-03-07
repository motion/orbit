import { View } from '@o/gloss'
import React, { useState } from 'react'
import { Interactive, InteractiveProps } from '../Interactive'

export function VerticalSplitPane(
  props: Partial<InteractiveProps> & { index?: number; parentWidth?: number },
) {
  const [size, setSize] = useState(400)

  if (props.index === 1) {
    return <View flex={1} {...props} />
  }

  return (
    <Interactive
      resizable={props.index === 0 ? { right: true } : false}
      onResize={x => setSize(x)}
      width={size}
      minWidth={props.parentWidth * 0.25}
      maxWidth={props.parentWidth * 0.8}
      {...props}
    />
  )
}
