// @flow
import React from 'react'
import { string, object } from 'prop-types'
import { view } from '@jot/black'
import { inject } from '~/helpers'
import Button from './button'
import { Provider } from 'react-tunnel'
import type { Color } from 'gloss'

const notUndefined = x => typeof x !== 'undefined'

export type Props = {
  items: Array<React$Element | Object>,
  onChange?: Function,
  defaultActive?: number,
  onlyIcons?: boolean,
  title?: string,
  stretch?: boolean,
  sync?: boolean,
  padded?: boolean,
  color: Color,
  ui?: Object,
  itemProps?: Object,
}

@inject(context => ({ ui: context.ui }))
@view.ui
export default class Segment {
  props: Props

  static defaultProps = {
    items: [],
    onChange: () => {},
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

  get active() {
    const hasState = this.state.active !== null
    if (this.props.sync) {
      return this.props.sync.get()
    }
    return hasState ? this.state.active : this.props.defaultActive
  }

  render({
    items,
    onChange,
    defaultActive,
    onlyIcons,
    children: children_,
    active,
    title,
    stretch,
    sync,
    padded,
    ui,
    color,
    itemProps,
    ...props
  }: Props) {
    let children = children_
    const ACTIVE = typeof active === 'undefined' ? this.active : active
    const getContext = (index: number, length: number) => ({
      ui: {
        ...ui,
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
          {() => (itemProps ? React.cloneElement(child, itemProps) : child)}
        </Provider>
      )
    } else if (Array.isArray(items)) {
      children = items.map((seg, index) => {
        const { text, id, icon, ...segmentProps } = typeof seg === 'object'
          ? seg
          : { text: seg, id: seg }

        return (
          <Provider key={index} provide={getContext(index, children.length)}>
            <Button
              active={(id || icon) === ACTIVE}
              icon={onlyIcons ? text : icon}
              iconColor={color}
              onChange={() => {
                this.select(id)
                onChange(seg)
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
        <title if={title}>{title}</title>
        {children}
      </segment>
    )
  }

  static style = {
    segment: {
      pointerEvents: 'auto',
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

  static theme = {
    reverse: {
      segment: {
        flexFlow: 'row-reverse',
      },
    },
    padded: {
      segment: {
        margin: ['auto', 5],
      },
    },
    vertical: {
      segment: {
        flexFlow: 'column',
      },
    },
  }
}
