import { View } from '@o/gloss'
import React, { Suspense, useEffect, useState } from 'react'
import { BorderLeft } from '../Border'
import { Interactive, InteractiveProps } from '../Interactive'
import { Loading } from '../progress/Loading'

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

  let element = null

  if (props.index > 1) {
    element = (
      <View position="relative" flex={1} overflow="hidden">
        <BorderLeft />
        <View flex={1} position="relative" overflowY="auto">
          {props.children}
        </View>
      </View>
    )
  } else {
    element = (
      <Interactive
        resizable={props.index === 0 ? { right: true } : false}
        onResize={x => setSize(x)}
        width={size}
        minWidth={props.parentWidth * 0.25}
        maxWidth={props.parentWidth * 0.8}
        overflowY="auto"
        {...props}
      />
    )
  }

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}
