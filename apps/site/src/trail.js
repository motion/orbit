import * as React from 'react'
import PropTypes from 'prop-types'
import { Spring, config as springConfig } from 'react-spring'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export default class Trail extends React.PureComponent {
  static propTypes = {
    native: PropTypes.bool,
    config: PropTypes.object,
    from: PropTypes.object,
    to: PropTypes.object,
    keys: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    ),
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.func),
      PropTypes.func,
    ]),
    render: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.func),
      PropTypes.func,
    ]),
  }

  state = {
    hold: false,
  }

  getValues() {
    return this.instance && this.instance.getValues()
  }

  async componentDidMount() {
    const { delay, children } = this.props
    if (delay) {
      this.setState({ hold: children.map(() => true) })
      const delays = Array.isArray(delay) ? delay : children.map(() => delay)
      for (const [index, delay] of delays.entries()) {
        await sleep(delay)
        const hold = [...this.state.hold]
        hold[index] = false
        this.setState({ hold })
      }
    }
    this.instance && this.instance.flush()
  }

  componentDidUpdate() {
    this.instance && this.instance.flush()
  }

  render() {
    const {
      children,
      render,
      from = {},
      to = {},
      native = false,
      config = springConfig.default,
      getProps,
      keys,
      onRest,
      ...extra
    } = this.props
    const animations = new Set()
    const hook = (index, animation) => {
      animations.add(animation)
      if (index === 0) {
        return undefined
      } else {
        return Array.from(animations)[index - 1]
      }
    }
    const props = { ...extra, native, config, from, to }
    const target = render || children
    return target.map((child, i) => {
      const attachedHook = animation => hook(i, animation)
      return (
        <Spring
          ref={ref => i === 0 && (this.instance = ref)}
          onRest={i === 0 ? onRest : null}
          key={keys[i]}
          {...props}
          attach={attachedHook}
          render={render && child}
          children={render ? children : child}
          hold={!this.state.hold ? true : this.state.hold[i]}
          {...(getProps ? getProps(i) : null)}
        />
      )
    })
  }
}
