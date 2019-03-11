import { View } from '@o/gloss'
import React, { useEffect, useState } from 'react'
import { BorderLeft } from '../Border'
import { Interactive, InteractiveProps } from '../Interactive'

export function VerticalSplitPane(
  props: Partial<InteractiveProps> & { index?: number; parentWidth?: number },
) {
  const [size, setSize] = useState(400)

  useEffect(
    () => {
      setSize(props.parentWidth / 2)
    },
    [props.parentWidth],
  )

  if (props.index === 1) {
    return (
      <View flex={1} position="relative">
        <BorderLeft />
        {props.children}
      </View>
    )
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
