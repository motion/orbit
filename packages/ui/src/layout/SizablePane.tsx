import { gloss } from '@o/gloss'
import React, { useContext, useEffect, useState } from 'react'
import { BorderLeft, BorderTop } from '../Border'
import { Interactive, InteractiveProps } from '../Interactive'
import { PaneTitleRowParentProps } from '../PaneTitleRow'
import { SectionPassProps } from '../Section'
import { View } from '../View/View'
import { LayoutContext } from './Layout'

export type SizablePaneProps = Partial<InteractiveProps> &
  PaneTitleRowParentProps & {
    total?: number
    index?: number
    parentSize?: number
    flex?: number
  }

export function SizablePane({ scrollable, children, resizable, flex, ...props }: SizablePaneProps) {
  const { total, type, flexes } = useContext(LayoutContext)
  const [size, setSize] = useState(-1)
  const [flexSize, setFlexSize] = useState(-1)

  useEffect(() => {
    if (!props.parentSize || typeof props.index === 'undefined' || flexes.length === 0) {
      return
    }
    const totalFlex = flexes.reduce((a, b) => a + b, 0)
    const flx = flexes[props.index]
    const pct = flx / totalFlex
    setFlexSize(props.parentSize * pct)
    setSize(props.parentSize * pct)
  }, [
    props.index,
    // only change first time parentSize changes, testing to see if it feels better
    // what may be better is preserving the current ratio rather than never updating
    props.parentSize,
    total,
    flexes,
  ])

  let element = null
  let sizeProps: any = {
    [type === 'row' ? 'width' : 'height']: 'auto',
  }
  let borderElement = null

  if (type === 'row') {
    if (props.index > 0) {
      borderElement = <BorderLeft />
    }
    if (size !== -1) {
      sizeProps = {
        width: size,
        minWidth: flexSize * 0.5,
        maxWidth: flexSize * 1.5,
      }
    }
  } else {
    if (props.index > 0) {
      borderElement = <BorderTop />
    }
    if (size !== -1) {
      sizeProps = {
        minHeight: flexSize * 0.5,
        height: size,
        maxHeight: flexSize * 1.5,
      }
    }
  }

  const childElement = <SectionPassProps flex={1}>{children}</SectionPassProps>

  if (resizable) {
    const resizableProp = resizable && { [type === 'row' ? 'right' : 'bottom']: true }
    element = (
      <Interactive
        scrollable={scrollable}
        overflow="hidden"
        resizable={resizableProp}
        onResize={x => setSize(x)}
        {...sizeProps}
        {...props}
      >
        {borderElement}
        {childElement}
      </Interactive>
    )
  } else {
    element = (
      <PaneChrome flex={flex || 1} {...sizeProps} maxWidth="100%" maxHeight="100%" {...props}>
        {borderElement}
        {childElement}
      </PaneChrome>
    )
  }

  return element
}

const PaneChrome = gloss(View, {
  position: 'relative',
  overflow: 'hidden',
})
