// @flow
import React from 'react'
import { view, inject } from '@mcro/black'
import type { ViewType } from '@mcro/black'
import Button from './button'
import { Provider } from 'react-tunnel'
import type { Color } from '@mcro/gloss'

@inject(context => ({ uiContext: context.uiContext }))
@view.ui
export default class Segment implements ViewType<Props> {
  props: Props & {
    active?: number,
    defaultActive?: number,
    controlled?: boolean,
    items: Array<React$Element<any> | Object>,
    children: React$Element<any>,
    onChange?: Function,
    onlyIcons?: boolean,
    title?: string,
    stretch?: boolean,
    sync?: { get(): number, set(value: number): void },
    padded?: boolean,
    color: Color,
    uiContext?: Object,
    itemProps?: Object,
  }

  state = {
    active: null,
  }

  select = active => {
    this.setState({ active })
    if (this.props.sync) {
      this.props.sync.set(active)
    }
  }

  get active(): number {
    const hasState = this.state.active !== null
    if (this.props.sync) {
      return this.props.sync.get()
    }
    return hasState ? this.state.active : this.props.defaultActive
  }

  render({
    items,
    controlled,
    onChange,
    defaultActive,
    onlyIcons,
    children: children_,
    active,
    title,
    stretch,
    sync,
    padded,
    uiContext,
    color,
    itemProps,
    ...props
  }: Props) {
    let children = children_
    const ACTIVE = typeof active === 'undefined' ? this.active : active
    const getContext = (index: number, length: number) => ({
      uiContext: {
        ...uiContext,
        inSegment: {
          first: index === 0,
          last: index === length - 1,
          index,
        },
      },
    })

    if (children) {
      const realChildren = React.Children
        .map(children, _ => _)
        .filter(child => !!child)

      children = realChildren.map((child, index) =>
        <Provider key={index} provide={getContext(index, realChildren.length)}>
          {() =>
            itemProps
              ? React.cloneElement(child, {
                  ...itemProps,
                  ...child.props,
                }) /* merge child props so they can override */
              : child}
        </Provider>
      )
    } else if (Array.isArray(items)) {
      children = items.map((seg, index) => {
        const { text, id, icon, ...segmentProps } =
          typeof seg === 'object' ? seg : { text: seg, id: seg }

        return (
          <Provider key={index} provide={getContext(index, children.length)}>
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
              {!onlyIcons && text}
            </Button>
          </Provider>
        )
      })
    }

    return (
      <segment {...props}>
        <title if={title}>
          {title}
        </title>
        {children}
      </segment>
    )
  }

  static style = {
    segment: {
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
      flex: 1,
    },
    title: {
      margin: ['auto', 5],
      opacity: 0.8,
      fontSize: 11,
    },
  }

  static theme = props => ({
    segment: {
      ...(props.reverse && {
        flexFlow: 'row-reverse',
      }),
      ...(props.padded && {
        margin: ['auto', 5],
      }),
      ...(props.column && {
        flexFlow: 'column',
      }),
    },
  })
}
