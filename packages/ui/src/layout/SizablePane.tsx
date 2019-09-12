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
    const isLast = props.index === total - 1

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

    let style: any = {
      [type === 'row' ? 'width' : 'height']: 'auto',
      flex,
    }

    let borderElement = null

    if (type === 'row') {
      if (props.index > 0) {
        borderElement = <BorderLeft />
      }
      if (size !== -1) {
        style = {
          ...style,
          maxWidth: isLast ? 'auto' : size,
          minWidth: size,
          // minWidth: flexSize * 0.5,
        }
      }
      if (collapsed) {
        style = {
          ...style,
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
        style = {
          ...style,
          minHeight: size,
          maxHeight: isLast ? 'auto' : flexSize * 10,
        }
      }
      if (collapsed) {
        style = {
          ...style,
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
          // has to be relative for the border
          position="relative"
          resizable={resizableProp}
          onResize={useCallback((w, h) => setSize(type === 'row' ? w : h), [type])}
          {...props}
          style={style}
        >
          {borderElement}
          {childElement}
        </Interactive>
      )
    } else {
      element = (
        <View
          data-is="SizablePane-PaneChrome"
          // has to be relative for the border
          // @ts-ignore
          position="relative"
          overflow="hidden"
          {...props}
          style={style}
        >
          {borderElement}
          {childElement}
        </View>
      )
    }

    return element
  },
)
