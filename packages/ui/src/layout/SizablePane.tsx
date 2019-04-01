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

export function SizablePane({ scrollable, children, resizable, ...props }: SizablePaneProps) {
  const { total, type, flexes } = useContext(LayoutContext)
  const [size, setSize] = useState(-1)

  useEffect(() => {
    if (!props.parentSize || typeof props.index === 'undefined' || flexes.length === 0) {
      return
    }
    const totalFlex = flexes.reduce((a, b) => a + b, 0)
    const flex = flexes[props.index]
    const pct = flex / totalFlex
    setSize(props.parentSize * pct)
  }, [props.index, props.parentSize, total, flexes])

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
        minWidth: props.parentSize * 0.25,
        maxWidth: props.parentSize * 0.8,
      }
    }
  } else {
    if (props.index > 0) {
      borderElement = <BorderTop />
    }
    if (size !== -1) {
      sizeProps = {
        minHeight: props.parentSize * 0.25,
        height: size,
        maxHeight: props.parentSize * 0.8,
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
      <PaneChrome {...sizeProps} {...props}>
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
