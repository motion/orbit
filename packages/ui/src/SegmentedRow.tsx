import * as React from 'react'
import { view } from '@mcro/black'
import { attachTheme } from '@mcro/gloss'
import { Button } from './Button'
import { Row } from './blocks/Row'
import { UIContext } from './helpers/contexts'
import { Color } from '@mcro/css'

type SegmentedRowProps = {
  active?: number
  defaultActive?: number
  controlled?: boolean
  items?: Array<React.ReactNode | { text?: string; id?: string; icon?: string }>
  children: React.ReactNode
  label?: React.ReactNode
  onChange?: Function
  onlyIcons?: boolean
  stretch?: boolean
  sync?: { get(): number; set(value: number): void }
  color?: Color
  uiContext?: Object
  itemProps?: Object
  spaced?: boolean
  theme?: Object
}

const Label = view({
  margin: ['auto', 5],
  opacity: 0.8,
  fontSize: 11,
})

// @ts-ignore
@attachTheme
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

  render() {
    const {
      items,
      controlled,
      onChange,
      defaultActive,
      onlyIcons,
      children: children_,
      active,
      label,
      stretch,
      sync,
      uiContext,
      color,
      itemProps: itemProps_,
      spaced,
      theme,
      ...props
    } = this.props
    let itemProps = itemProps_ as any
    let children = children_
    const ACTIVE = typeof active === 'undefined' ? this.active : active
    const getContext = (index, length) =>
      spaced
        ? {}
        : {
            ...uiContext,
            inSegment: {
              first: index === 0,
              last: index === length - 1,
              index,
            },
          }

    if (spaced) {
      itemProps = itemProps || {}
      itemProps.marginLeft = typeof spaced === 'number' ? spaced : 5
    }

    if (stretch) {
      itemProps = itemProps || {}
      itemProps.flex = 1
    }

    if (children) {
      const realChildren = React.Children.map(children, _ => _).filter(Boolean)

      children = realChildren
        .map((child, index) => {
          if (!child) {
            return false
          }
          const finalChild =
            typeof child === 'string' || typeof child === 'number' ? <span>{child}</span> : child

          return (
            <UIContext.Provider key={index} value={getContext(index, realChildren.length)}>
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
    } else if (Array.isArray(items)) {
      children = items.map((seg, index) => {
        // @ts-ignore
        const { text, id, icon, ...segmentProps } =
          typeof seg === 'object' ? seg : { text: seg, id: seg }
        // @ts-ignore
        if (segmentProps.flex) {
          // @ts-ignore
          return <div style={{ flex: segmentProps.flex }} />
        }
        return (
          <UIContext.Provider key={index} value={getContext(index, items.length)}>
            <Button
              active={(id || icon) === ACTIVE}
              icon={onlyIcons ? text : icon}
              iconColor={color}
              onChange={() => {
                this.select(id)
                if (controlled && onChange) {
                  onChange(seg)
                }
              }}
              {...segmentProps}
              {...itemProps}
            >
              {(!onlyIcons && text) || segmentProps['children']}
            </Button>
          </UIContext.Provider>
        )
      })
    }

    return (
      <Row {...props}>
        {label && <Label>{label}</Label>}
        {children}
      </Row>
    )
  }
}
