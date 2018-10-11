import * as React from 'react'
import { view } from '@mcro/black'
import { UIContext } from './helpers/contexts'
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
  spaced?: boolean
}

@view.ui
export class SegmentedRow extends React.Component<SegmentedRowProps> {
  state = {
    active: null,
  }

  select = active => {
    this.setState({ active })
    if (this.props.sync) {
      this.props.sync.set(active)
    }
  }

  get active() {
    const hasState = this.state.active !== null
    if (this.props.sync) {
      return this.props.sync.get()
    }
    return hasState ? this.state.active : this.props.defaultActive
  }

  getContext = (index, length) =>
    this.props.spaced
      ? {}
      : {
          ...this.props.uiContext,
          inSegment: {
            first: index === 0,
            last: index === length - 1,
            index,
          },
        }

  render() {
    const { children: children_, stretch, itemProps: itemProps_, spaced, ...props } = this.props
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
            <UIContext.Provider key={index} value={this.getContext(index, realChildren.length)}>
              {itemProps
                ? React.cloneElement(finalChild, {
                    ...itemProps,
                    ...finalChild.props,
                  }) /* merge child props so they can override */
                : finalChild}
            </UIContext.Provider>
          )
        })
        .filter(Boolean)
    }
    return <Row {...props}>{children}</Row>
  }
}
