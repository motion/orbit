import { gloss, View } from '@o/gloss'
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
  scrollable?: boolean | 'x' | 'y'
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
    }
  } else {
    if (props.index > 0) {
      borderElement = <BorderTop />
    }
    sizeProps = {
      minHeight: props.parentSize * 0.25,
      height: size,
      maxHeight: props.parentSize * 0.8,
    }
  }

  // easy scrollable
  if (scrollable === true) {
    sizeProps.overflow = 'auto'
  } else if (scrollable === 'x') {
    sizeProps.overflowX = 'auto'
    sizeProps.overflowY = 'hidden'
  } else if (scrollable === 'y') {
    sizeProps.overflowY = 'auto'
    sizeProps.overflowX = 'hidden'
  } else {
    sizeProps.overflow = 'hidden'
  }

  if (resizable) {
    const resizableProp = resizable && { [type === 'row' ? 'right' : 'bottom']: true }
    element = (
      <Interactive
        overflow="hidden"
        resizable={resizableProp}
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
      <PaneChrome {...sizeProps} {...props}>
        {borderElement}
        {children}
      </PaneChrome>
    )
  }

  return <Suspense fallback={<Loading />}>{element}</Suspense>
}

const PaneChrome = gloss(View, {
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
})
