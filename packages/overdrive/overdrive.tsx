import * as React from 'react'
import ReactDOM from 'react-dom'
import prefix from './prefix'
import PropTypes from 'prop-types'

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer
const components = {}

export default class Overdrive extends React.Component {
  animationDelayTimeout: any
  animationTimeout: any
  onShowLock?: boolean
  element?: any
  bodyElement?: HTMLElement
  props: {
    id: string
    style?: Object
    duration?: number
    animationDelay?: number
    element?: string
    onAnimationEnd?: Function
    children?: any
  }

  static defaultProps = {
    element: 'div',
    duration: 200,
  }

  state = {
    loading: true,
  }

  componentDidMount() {
    this.onShowLock = false
    this.onShow()
  }

  componentWillUnmount() {
    this.onHide()
    this.onShowLock = false
  }

  componentWillReceiveProps() {
    this.onShowLock = false
    this.onHide()
  }

  componentDidUpdate() {
    this.onShow()
  }

  animateEnd = () => {
    this.animationTimeout = null
    this.setState({ loading: false })
    this.props.onAnimationEnd && this.props.onAnimationEnd()
    window.document.body.removeChild(this.bodyElement)
  }

  onHide() {
    const { id } = this.props
    const prevElement = React.cloneElement(this.props.children)
    const prevPosition = this.getPosition()
    components[id] = {
      prevPosition,
      prevElement,
    }

    this.clearAnimations()

    setTimeout(() => {
      components[id] = false
    }, 100)
  }

  onShow() {
    if (this.onShowLock) {
      return
    }
    this.onShowLock = true
    const { id, animationDelay } = this.props
    if (components[id]) {
      const { prevPosition, prevElement } = components[id]
      components[id] = false
      if (animationDelay) {
        this.animationDelayTimeout = setTimeout(
          () => this.animate(prevPosition, prevElement),
          animationDelay,
        )
      } else {
        this.animate(prevPosition, prevElement)
      }
    } else {
      this.setState({ loading: false })
    }
  }

  animate = (prevPosition, prevElement) => {
    const { duration } = this.props
    prevPosition.top += window.pageYOffset || document.documentElement.scrollTop
    const nextPosition = this.getPosition(true)
    const noTransform = 'scaleX(1) scaleY(1) translateX(0px) translateY(0px)'
    const targetScaleX = prevPosition.width / nextPosition.width
    const targetScaleY = prevPosition.height / nextPosition.height
    const targetTranslateX = prevPosition.left - nextPosition.left
    const targetTranslateY = prevPosition.top - nextPosition.top
    if (
      targetScaleX === 1 &&
      targetScaleY === 1 &&
      targetTranslateX === 0 &&
      targetTranslateY === 0
    ) {
      this.setState({ loading: false })
      return
    }
    const transition = {
      transition: `transform ${duration / 1000}s, opacity ${duration / 1000}s`,
      transformOrigin: '0 0 0',
    }
    const sourceStart = React.cloneElement(prevElement, {
      key: '1',
      style: prefix({
        ...transition,
        ...prevPosition,
        opacity: 1,
        transform: noTransform,
      }),
    })
    const sourceEnd = React.cloneElement(prevElement, {
      key: '1',
      style: prefix({
        ...transition,
        ...prevPosition,
        margin: nextPosition.margin,
        opacity: 0,
        transform: `matrix(${1 / targetScaleX}, 0, 0, ${1 /
          targetScaleY}, ${-targetTranslateX}, ${-targetTranslateY})`,
      }),
    })
    const targetStart = React.cloneElement(this.props.children, {
      key: '2',
      style: prefix({
        ...transition,
        ...nextPosition,
        margin: prevPosition.margin,
        opacity: 0,
        transform: `matrix(${targetScaleX}, 0, 0, ${targetScaleY}, ${targetTranslateX}, ${targetTranslateY})`,
      }),
    })
    const targetEnd = React.cloneElement(this.props.children, {
      key: '2',
      style: prefix({
        ...transition,
        ...nextPosition,
        opacity: 1,
        transform: noTransform,
      }),
    })
    const start = (
      <div>
        {sourceStart}
        {targetStart}
      </div>
    )
    const end = (
      <div>
        {sourceEnd}
        {targetEnd}
      </div>
    )
    this.setState({ loading: true })
    const bodyElement = document.createElement('div')
    window.document.body.appendChild(bodyElement)
    this.bodyElement = bodyElement
    renderSubtreeIntoContainer(this, start, bodyElement)
    this.animationTimeout = setTimeout(() => {
      renderSubtreeIntoContainer(this, end, bodyElement)
      this.animationTimeout = setTimeout(this.animateEnd, duration)
    }, 64)
  }

  clearAnimations() {
    clearTimeout(this.animationDelayTimeout)
    clearTimeout(this.animationTimeout)
    if (this.animationTimeout) {
      this.animateEnd()
    }
  }

  getPosition(addOffset?: boolean) {
    const node = this.element
    const rect = node.getBoundingClientRect()
    const computedStyle = getComputedStyle(node)
    const marginTop = parseInt(computedStyle.marginTop, 10)
    const marginLeft = parseInt(computedStyle.marginLeft, 10)
    return {
      top:
        rect.top -
        marginTop +
        (addOffset ? 1 : 0) *
          (window.pageYOffset || document.documentElement.scrollTop),
      left: rect.left - marginLeft,
      width: rect.width,
      height: rect.height,
      margin: computedStyle.margin,
      padding: computedStyle.padding,
      borderRadius: computedStyle.borderRadius,
      position: 'absolute',
    }
  }

  setRef = c => {
    this.element = c && c.firstChild
  }

  render() {
    const {
      id,
      duration,
      animationDelay,
      style = {},
      children,
      element,
      ...rest
    } = this.props
    const newStyle = {
      ...style,
      opacity: this.state.loading ? 0 : 1,
    }
    const onlyChild = React.Children.only(children)
    return React.createElement(
      element,
      {
        ref: this.setRef,
        style: newStyle,
        ...rest,
      },
      onlyChild,
    )
  }
  s
}
