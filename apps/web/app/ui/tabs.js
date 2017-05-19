import { view } from '~/helpers'
import React from 'react'
import Button from './button'

@view.ui
export default class Tabs {
  static Tab = Button

  state = {
    active: 0,
  }

  static defaultProps = {
    onChange: () => {},
  }

  onChange = (name, index) => {
    this.props.onChange(name, index)
    this.setState({ active: index })
  }

  getChildren = (children, props) => {
    const isArr = Array.isArray(children)
    const active = typeof this.props.active !== 'undefined'
      ? this.props.active
      : this.state.active

    const count = isArr ? children.length : React.Children.count(children)
    let width = null

    if (props.spread) {
      width = `${100 / count}%`
    }

    const getProps = (index, onChange) => ({
      ...props,
      width,
      index,
      active: active === index,
      onClick: onChange || this.onChange,
    })

    if (isArr && typeof children[0] === 'string') {
      return children.map((child, index) => (
        <Tab key={child} {...getProps(index)}>{child}</Tab>
      ))
    }

    return React.Children.map(children, (child, index) =>
      React.cloneElement(child, getProps(index, child.onChange))
    )
  }

  render() {
    const { children, active, spread, flat, after, ...props } = this.props

    return (
      <tabs {...props}>
        <inner>
          {this.getChildren(children, { flat, spread })}
        </inner>
        <after if={after}>
          {after}
        </after>
      </tabs>
    )
  }

  static style = {
    tabs: {
      padding: [5, 3],
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    inner: {
      flexFlow: 'row',
      flex: 1,
    },
  }

  static theme = {
    flat: {
      tabs: {
        borderBottom: [1, [0, 0, 0, 0.15]],
        background: [0, 0, 0, 0.05],
        padding: 0,
      },
    },
    spread: {
      tabs: {
        width: '100%',
      },
    },
  }
}
