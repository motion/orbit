import * as React from 'react'
import { MergeUIContext } from './helpers/contexts'
import { Color, CSSPropertySet } from '@mcro/css'
import { Row } from './blocks/Row'

type SegmentedRowProps = CSSPropertySet & {
  active?: number
  defaultActive?: number
  controlled?: boolean
  items?: Array<React.ReactNode | { text?: string; id?: string; icon?: string }>
  children: React.ReactNode
  onChange?: Function
  stretch?: boolean
  sync?: { get(): number; set(value: number): void }
  color?: Color
  uiContext?: Object
  itemProps?: Object
  spaced?: boolean | number
}

export const SegmentedRow = (props: SegmentedRowProps) => {
  const { children: children_, stretch, itemProps: itemProps_, spaced, ...rest } = props
  const [active, setActive] = React.useState(props.defaultActive)

  React.useEffect(() => {
    if (props.active !== active) {
      setActive(props.active)
    }
  })

  const select = (active: number) => {
    setActive(active)
    if (props.sync) {
      props.sync.set(active)
    }
    if (props.onChange) {
      props.onChange(active)
    }
  }

  const getContext = (index: number, length: number) => {
    return typeof props.spaced !== 'undefined'
      ? {}
      : {
          ...props.uiContext,
          inSegment: {
            first: index === 0,
            last: index === length - 1,
            index,
          },
        }
  }

  let itemProps = itemProps_ as any
  let children = children_
  if (spaced) {
    itemProps = itemProps || {}
    itemProps.marginLeft = typeof spaced === 'number' ? spaced : 5
  }
  if (stretch) {
    itemProps = itemProps || {}
    itemProps.flex = 1
  }
  const realChildren = children && React.Children.map(children, _ => _).filter(Boolean)
  if (realChildren.length > 1) {
    children = realChildren
      .map((child, index) => {
        if (!child) {
          return false
        }
        const finalChild =
          typeof child === 'string' || typeof child === 'number' ? <span>{child}</span> : child

        return (
          <MergeUIContext key={index} value={getContext(index, realChildren.length)}>
            {itemProps
              ? React.cloneElement(finalChild, {
                  ...itemProps,
                  ...finalChild.props,
                  onClick: finalChild.props.onClick || (() => select(index)),
                }) /* merge child props so they can override */
              : finalChild}
          </MergeUIContext>
        )
      })
      .filter(Boolean)
  }
  return <Row {...rest}>{children}</Row>
}
