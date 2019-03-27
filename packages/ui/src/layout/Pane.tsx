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
  flex?: number
  scrollable?: boolean
}

export function Pane({ scrollable, children, resizable, ...props }: PaneProps) {
  const { total, type, flexes } = useContext(LayoutContext)
  const [size, setSize] = useState(400)

  useEffect(
    () => {
      const totalFlex = flexes.reduce((a, b) => a + b, 0)
      const flex = flexes[props.index]
      const pct = flex / totalFlex
      setSize(props.parentSize * pct)
    },
    [props.index, props.parentSize, total, flexes],
  )

  let element = null
  let sizeProps = null
  let borderElement = null

  if (type === 'row') {
    if (props.index > 0) {
      borderElement = <BorderLeft />
    }
    sizeProps = {
      width: size,
      minWidth: props.parentSize * 0.25,
      maxWidth: props.parentSize * 0.8,
      overflowX: 'hidden',
      overflowY: scrollable ? 'auto' : 'hidden',
    }
  } else {
    if (props.index > 0) {
      borderElement = <BorderTop />
    }
    sizeProps = {
      minHeight: props.parentSize * 0.25,
      height: size,
      maxHeight: props.parentSize * 0.8,
      overflowY: 'hidden',
      overflowX: scrollable ? 'auto' : 'hidden',
    }
  }

  if (resizable) {
    const resizableProp = resizable && { [type === 'row' ? 'right' : 'bottom']: true }
    element = (
      <Interactive resizable={resizableProp} onResize={x => setSize(x)} {...sizeProps} {...props}>
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
