import { View } from '@o/gloss'
import React, { Suspense, useEffect, useState } from 'react'
import { BorderLeft } from '../Border'
import { Interactive, InteractiveProps } from '../Interactive'
import { Loading } from '../progress/Loading'

export function VerticalSplitPane({
  children,
  ...props
}: Partial<InteractiveProps> & { total?: number; index?: number; parentWidth?: number }) {
  const [size, setSize] = useState(400)

  useEffect(
    () => {
      setSize(props.parentWidth / 2)
    },
    [props.parentWidth],
  )

  const isResizable = props.index < props.total - 1
  let element = null

  if (isResizable) {
    element = (
      <Interactive
        resizable={isResizable && { right: true }}
        onResize={x => setSize(x)}
        width={size}
        minWidth={props.parentWidth * 0.25}
        maxWidth={props.parentWidth * 0.8}
        overflowY="auto"
        {...props}
      >
        {props.index > 0 && <BorderLeft />}
        {children}
      </Interactive>
    )
  } else {
    element = (
      <View flex={1} position="relative">
        {props.index > 0 && <BorderLeft />}
        {children}
      </View>
    )
  }

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}
