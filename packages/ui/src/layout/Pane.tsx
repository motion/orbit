import { View } from '@o/gloss'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { BorderLeft, BorderTop } from '../Border'
import { Interactive, InteractiveProps } from '../Interactive'
import { Loading } from '../progress/Loading'
import { LayoutContext } from './Layout'

export type PaneProps = Partial<InteractiveProps> & {
  total?: number
  index?: number
  parentSize?: number
}

export function Pane({ children, resizable, ...props }: PaneProps) {
  const context = useContext(LayoutContext)
  const [size, setSize] = useState(400)

  useEffect(
    () => {
      setSize(props.parentSize / 2)
    },
    [props.parentSize],
  )

  let element = null
  let sizeProps = null
  let borderElement = null

  if (context.style === 'row') {
    if (props.index > 0) {
      borderElement = <BorderLeft />
    }
    sizeProps = {
      minWidth: props.parentSize * 0.25,
      width: size,
      maxWidth: props.parentSize * 0.8,
      overflowY: 'auto',
    }
  } else {
    if (props.index > 0) {
      borderElement = <BorderTop />
    }
    sizeProps = {
      minHeight: props.parentSize * 0.25,
      height: size,
      maxHeight: props.parentSize * 0.8,
      overflowX: 'auto',
    }
  }

  if (resizable) {
    element = (
      <Interactive
        resizable={resizable && { [context.style === 'row' ? 'right' : 'bottom']: true }}
        onResize={x => setSize(x)}
        {...sizeProps}
        {...props}
      >
        {borderElement}
        {children}
      </Interactive>
    )
  } else {
    element = (
      <View flex={1} position="relative">
        {borderElement}
        {children}
      </View>
    )
  }

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}
