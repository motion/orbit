import * as React from 'react'
import { findDOMNode } from 'react-dom'

const idFn = _ => _
const defaultSettings = {
  reverse: false,
  max: 35,
  perspective: 1000,
  easing: 'cubic-bezier(.03,.98,.52,.99)',
  scale: '1.1',
  speed: '1000',
  transition: true,
  axis: null,
  reset: true,
}

export class Tilt extends React.Component {
  static defaultProps = {
    onMouseEnter: idFn,
    onMouseMove: idFn,
    onMouseLeave: idFn,
  }

  state = {
    style: {},
    settings: {},
  }

  width = null
  height = null
  left = null
  top = null
  transitionTimeout = null
  updateCall = null
  element = null

  get reverse() {
    return this.state.settings.reverse ? -1 : 1
  }

  get settings() {
    return this.state.settings
  }

  static getDerivedStateFromProps(props) {
    return {
      settings: {
        ...defaultSettings,
        ...props.options,
      },
    }
  }

  componentDidMount() {
    this.element = findDOMNode(this)
  }

  componentWillUnmount() {
    clearTimeout(this.transitionTimeout)
    cancelAnimationFrame(this.updateCall)
  }

  reset() {
    window.requestAnimationFrame(() => {
      this.setState({
        style: {
          ...this.state.style,
          transform:
            'perspective(' +
            this.settings.perspective +
            'px) ' +
            'rotateX(0deg) ' +
            'rotateY(0deg) ' +
            'scale3d(1, 1, 1)',
        },
      })
    })
  }

  onMouseEnter = e => {
    this.updateElementPosition()
    this.setState({
      style: {
        ...this.state.style,
        willChange: 'transform',
      },
    })
    this.setTransition()
    return this.props.onMouseEnter(e)
  }

  onMouseMove = e => {
    e.persist()
    if (this.updateCall !== null) {
      window.cancelAnimationFrame(this.updateCall)
    }
    this.event = e
    this.updateCall = requestAnimationFrame(this.update.bind(this, e))
    return this.props.onMouseMove(e)
  }

  onMouseLeave = e => {
    this.setTransition()
    if (this.settings.reset) {
      this.reset()
    }
    return this.props.onMouseLeave(e)
  }

  setTransition() {
    clearTimeout(this.transitionTimeout)
    this.setState({
      style: {
        ...this.state.style,
        transition: this.settings.speed + 'ms ' + this.settings.easing,
      },
    })
    this.transitionTimeout = setTimeout(() => {
      this.setState({
        style: {
          ...this.state.style,
          transition: '',
        },
      })
    }, this.settings.speed)
  }

  getValues(e) {
    const x = (e.nativeEvent.clientX - this.left) / this.width
    const y = (e.nativeEvent.clientY - this.top) / this.height
    const _x = Math.min(Math.max(x, 0), 1)
    const _y = Math.min(Math.max(y, 0), 1)
    const tiltX = (
      this.reverse *
      (this.settings.max / 2 - _x * this.settings.max)
    ).toFixed(2)
    const tiltY = (
      this.reverse *
      (_y * this.settings.max - this.settings.max / 2)
    ).toFixed(2)
    const percentageX = _x * 100
    const percentageY = _y * 100
    return {
      tiltX,
      tiltY,
      percentageX,
      percentageY,
    }
  }

  updateElementPosition() {
    const rect = this.element.getBoundingClientRect()
    this.width = this.element.offsetWidth
    this.height = this.element.offsetHeight
    this.left = rect.left
    this.top = rect.top
  }

  update(e) {
    let values = this.getValues(e)
    this.setState({
      style: {
        ...this.state.style,
        transform:
          'perspective(' +
          this.settings.perspective +
          'px) ' +
          'rotateX(' +
          (this.settings.axis === 'x' ? 0 : values.tiltY) +
          'deg) ' +
          'rotateY(' +
          (this.settings.axis === 'y' ? 0 : values.tiltX) +
          'deg) ' +
          'scale3d(' +
          this.settings.scale +
          ', ' +
          this.settings.scale +
          ', ' +
          this.settings.scale +
          ')',
      },
    })
    this.updateCall = null
  }

  render() {
    const style = { ...this.props.style, ...this.state.style }
    return (
      <div
        style={style}
        className={this.props.className}
        onMouseEnter={this.onMouseEnter}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
      >
        {this.props.children}
      </div>
    )
  }
}
