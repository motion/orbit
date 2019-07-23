import { gloss } from 'gloss'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'

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
    collapsed?: boolean
  }

export const SizablePane = memo(
  ({ children, resizable, flex, collapsed, ...props }: SizablePaneProps) => {
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
      flex,
    }
    let borderElement = null

    if (type === 'row') {
      if (props.index > 0) {
        borderElement = <BorderLeft />
      }
      if (size !== -1) {
        sizeProps = {
          ...sizeProps,
          width: size,
          minWidth: flexSize * 0.5,
          maxWidth: props.parentSize,
        }
      }
      if (collapsed) {
        sizeProps = {
          ...sizeProps,
          flex: 'none',
          // "rows" collapsing would be odd
          // minWidth: 'auto',
          // width: 'auto',
        }
      }
    } else {
      if (props.index > 0) {
        borderElement = <BorderTop />
      }
      if (size !== -1) {
        sizeProps = {
          ...sizeProps,
          minHeight: flexSize * 0.5,
          height: size,
          maxHeight: props.parentSize,
        }
      }
      if (collapsed) {
        sizeProps = {
          ...sizeProps,
          minHeight: 'auto',
          height: 'auto',
          flex: 'none',
        }
      }
    }

    const childElement = <SectionPassProps flex={1}>{children}</SectionPassProps>

    if (resizable) {
      const resizableProp = resizable && { [type === 'row' ? 'right' : 'bottom']: true }
      element = (
        <Interactive
          data-is="SizablePane-Interactive"
          overflow="hidden"
          resizable={resizableProp}
          onResize={useCallback((w, h) => setSize(type === 'row' ? w : h), [type])}
          {...props}
          {...sizeProps}
        >
          {borderElement}
          {childElement}
        </Interactive>
      )
    } else {
      // const isLast = props.index === total - 1
      element = (
        <PaneChrome
          data-is="SizablePane-PaneChrome"
          {...props}
          {...sizeProps}
          maxWidth="100%"
          maxHeight="100%"
        >
          {borderElement}
          {childElement}
        </PaneChrome>
      )
    }

    return element
  },
)

const PaneChrome = gloss(View, {
  position: 'relative',
  overflow: 'hidden',
})
