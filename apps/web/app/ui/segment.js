import React from 'react'
import { view } from '~/helpers'
import Button from './button'
import { pickBy } from 'lodash'

const notUndefined = x => typeof x !== 'undefined'

@view class Segment {
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
      slim,
      tiny,
      dark,
      chromeless,
      dim,
      stretch,
      sync,
      clickable,
      spaced,
      padded,
      ...props
    } = this.props

    const childProps = pickBy(
      {
        slim,
        dark,
        chromeless,
        dim,
        stretch,
        tiny,
        spaced,
        clickable: sync || onChange || clickable,
      },
      notUndefined
    )

    const curActive = typeof active === 'undefined' ? this.active : active

    let clonedChildren = null
    if (children) {
      const realChildren = React.Children
        .map(children, _ => _)
        .filter(child => !!child)
      clonedChildren = realChildren.map((child, i) =>
        React.cloneElement(child, {
          first: i === 0,
          last: i === realChildren.length - 1,
          segmented: true,
          ...(child.type && child.type.isSegment ? childProps : null),
        })
      )
    }

    if (dark && !color) {
      color = '#fff'
    }

    return (
      <container {...props}>
        <title if={title}>{title}</title>
        {Array.isArray(items) &&
          items.map((seg, i) => {
            const { text, id, icon, ...segmentProps } = typeof seg === 'object'
              ? seg
              : { text: seg, id: seg }

            return (
              <Button
                segmented
                key={i}
                first={i === 0}
                last={i === items.length - 1}
                active={(id || icon) === curActive}
                icon={onlyIcons ? text : icon}
                iconSize={size}
                iconColor={color}
                onChange={() => {
                  this.select(id)
                  onChange(seg)
                }}
                {...segmentProps}
                {...childProps}
              >
                {!onlyIcons && text}
              </Button>
            )
          })}
        {clonedChildren}
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
