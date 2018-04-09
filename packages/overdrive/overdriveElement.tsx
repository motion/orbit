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
    naturalChild: HTMLElement
    parentElement?: HTMLElement
    style?: Object
    duration?: number
    animationDelay?: number
    element?: string
    onAnimationEnd?: Function
    children?: any
  }

  static defaultProps = {
    element: 'div',
    duration: 1000,
  }

  state = {
    loading: true,
    children: null,
  }

  get hiddenElement() {
    return document.body
  }

  get scrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop
  }

  componentDidMount() {
    this.setState({ children: this.getChildren() })
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

  getChildren = (willTransition?: boolean) => {
    const { children } = this.props
    return typeof children === 'function'
      ? children({ willTransition })
      : children
  }

  onHide() {
    if (!this.state.children || !this.element) {
      return
    }
    const { id } = this.props
    const prevElement = this.state.children
    const prevPosition = this.getPosition(this.element)
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
    this.setState(
      {
        children: this.getChildren(true),
      },
      () => this.startAnimate(prevPosition, prevElement),
    )
  }

  startAnimate(prevPosition, prevElement) {
    const { duration } = this.props
    prevPosition.top += this.scrollTop
    const nextPosition = this.getPosition(this.element, true)
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
    const noTransform = 'scaleX(1) scaleY(1) translateX(0px) translateY(0px)'
    const transition = {
      transition: `transform ${duration}ms, opacity ${duration}ms`,
      transformOrigin: '0 0 0',
    }
    const sourceStart = React.cloneElement(prevElement, {
      key: '1',
      children: null,
      style: prefix({
        ...transition,
        ...prevPosition,
        opacity: 1,
        transform: noTransform,
      }),
    })
    const sourceEnd = React.cloneElement(prevElement, {
      key: '1',
      children: null,
      style: prefix({
        ...transition,
        ...prevPosition,
        margin: nextPosition.margin,
        opacity: 0,
        transform: `matrix(${1 / targetScaleX}, 0, 0, ${1 /
          targetScaleY}, ${-targetTranslateX}, ${-targetTranslateY})`,
      }),
    })
    const targetStart = React.cloneElement(this.state.children, {
      key: '2',
      children: null,
      style: prefix({
        ...transition,
        ...nextPosition,
        margin: prevPosition.margin,
        opacity: 0,
        transform: `matrix(${targetScaleX}, 0, 0, ${targetScaleY}, ${targetTranslateX}, ${targetTranslateY})`,
      }),
    })
    const targetEnd = React.cloneElement(this.state.children, {
      key: '2',
      children: null,
      style: prefix({
        ...transition,
        ...nextPosition,
        opacity: 1,
        transform: noTransform,
      }),
    })
    this.setState({ loading: true })
    const bodyElement = document.createElement('div')
    this.hiddenElement.appendChild(bodyElement)
    this.bodyElement = bodyElement
    renderSubtreeIntoContainer(
      this,
      <React.Fragment>
        {sourceStart}
        {targetStart}
      </React.Fragment>,
      bodyElement,
    )
    this.animationTimeout = setTimeout(() => {
      renderSubtreeIntoContainer(
        this,
        <React.Fragment>
          {sourceEnd}
          {targetEnd}
        </React.Fragment>,
        bodyElement,
      )
      this.animationTimeout = setTimeout(this.animateEnd, duration)
    }, 0)
  }

  clearAnimations() {
    clearTimeout(this.animationDelayTimeout)
    clearTimeout(this.animationTimeout)
    if (this.animationTimeout) {
      this.animateEnd()
    }
  }

  animateEnd = () => {
    this.animationTimeout = null
    this.setState({ loading: false })
    this.props.onAnimationEnd && this.props.onAnimationEnd()
    this.bodyElement.parentNode.removeChild(this.bodyElement)
  }

  getPosition = (node, addOffset?: boolean) => {
    const rect = node.getBoundingClientRect()
    const computedStyle = getComputedStyle(node)
    const marginTop = parseInt(computedStyle.marginTop, 10)
    const marginLeft = parseInt(computedStyle.marginLeft, 10)
    return {
      top: rect.top - marginTop + (addOffset ? 1 : 0) * this.scrollTop,
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
      parentElement,
      naturalChild,
      ...rest
    } = this.props
    if (!this.state.children) {
      return null
    }
    const newStyle = {
      ...style,
      position: 'absolute',
      overflow: 'hidden',
      top: naturalChild.top,
      left: naturalChild.left,
      width: naturalChild.width,
      height: naturalChild.height,
      opacity: this.state.loading ? 0 : 1,
    }
    // return ReactDOM.unstable_createPortal(
    //   React.createElement(
    //     element,
    //     {
    //       ref: this.setRef,
    //       style: newStyle,
    //       ...rest,
    //     },
    //     React.Children.only(this.state.children),
    //   ),
    //   parentElement,
    // )
    return React.createElement(
      element,
      {
        ref: this.setRef,
        style: newStyle,
        ...rest,
      },
      React.Children.only(this.state.children),
    )
  }
}
