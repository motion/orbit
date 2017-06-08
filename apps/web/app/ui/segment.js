import React from 'react'
import { string, object } from 'prop-types'
import { view, inject } from '@jot/black'
import { inject } from '~/helpers'
import Button from './button'
import { Provider } from 'react-tunnel'
import type { Color } from 'gloss'

const notUndefined = x => typeof x !== 'undefined'

@inject(context => ({ ui: context.ui }))
@view.ui
export default class Segment {
  props: {
    onChange?: Function,
    defaultActive?: number,
    onlyIcons?: boolean,
    size?: number,
    title?: string,
    stretch?: boolean,
    sync?: boolean,
    padded?: boolean,
    color: Color,
    ui?: Object,
  }

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
    size,
    children,
    active,
    title,
    stretch,
    sync,
    padded,
    ui,
    color,
    ...props
  }) {
    const curActive = typeof active === 'undefined' ? this.active : active
    let finalChildren = null

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

      finalChildren = realChildren.map((child, index) =>
        <Provider key={index} provide={getContext(index, realChildren.length)}>
          {() => child}
        </Provider>
      )
    } else if (Array.isArray(items)) {
      finalChildren = items.map((seg, index) => {
        const { text, id, icon, ...segmentProps } = typeof seg === 'object'
          ? seg
          : { text: seg, id: seg }

        return (
          <Provider
            key={index}
            provide={getContext(index, finalChildren.length)}
          >
            <Button
              active={(id || icon) === curActive}
              icon={onlyIcons ? text : icon}
              iconSize={size}
              iconColor={color}
              onChange={() => {
                this.select(id)
                onChange(seg)
              }}
              {...segmentProps}
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
        {finalChildren}
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
