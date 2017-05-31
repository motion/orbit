import React from 'react'
import { string, object } from 'prop-types'
import { view } from '~/helpers'
import Button from './button'
import { pickBy } from 'lodash'
import { Provider } from 'react-tunnel'

const notUndefined = x => typeof x !== 'undefined'

@view.ui class Segment {
  static Item = Button

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

  render() {
    let { color } = this.props
    const {
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
      ...props
    } = this.props

    const curActive = typeof active === 'undefined' ? this.active : active

    let finalChildren = null

    if (children) {
      const realChildren = React.Children
        .map(children, _ => _)
        .filter(child => !!child)

      finalChildren = realChildren.map((child, i) => (
        <Provider
          key={i}
          provide={{
            uiSegment: {
              first: i === 0,
              last: i === realChildren.length - 1,
            },
          }}
        >
          {() => child}
        </Provider>
      ))
    } else if (Array.isArray(items)) {
      finalChildren = items.map((seg, i) => {
        const { text, id, icon, ...segmentProps } = typeof seg === 'object'
          ? seg
          : { text: seg, id: seg }

        return (
          <Provider
            key={i}
            provide={{
              uiSegment: {
                first: i === 0,
                last: i === items.length - 1,
              },
            }}
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

    console.log('finalChildren is', finalChildren)

    return (
      <container {...props}>
        <title if={title}>{title}</title>
        {finalChildren}
      </container>
    )
  }

  static style = {
    container: {
      pointerEvents: 'auto',
      flexFlow: 'row',
      alignItems: 'center',
      userSelect: 'none',
    },
    title: {
      margin: ['auto', 5],
      opacity: 0.8,
      fontSize: 11,
    },
  }

  static theme = {
    reverse: {
      container: {
        flexFlow: 'row-reverse',
      },
    },
    padded: {
      container: {
        margin: ['auto', 5],
      },
    },
    vertical: {
      container: {
        flexFlow: 'column',
      },
    },
  }
}

Segment.Item = Button

export default Segment
