import { throttle } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
// @ts-ignore
import { animated, config, Controller, Globals } from 'react-spring/renderprops'

const El = Globals.defaultElement
const AnimatedDiv = animated(El)
const { Provider, Consumer } = React.createContext(null)

function getScrollType(horizontal) {
  return horizontal ? 'scrollLeft' : 'scrollTop'
}

const START_TRANSLATE_3D = 'translate3d(0px,0px,0px)'
const START_TRANSLATE = 'translate(0px,0px)'

export class ParallaxLayer extends React.PureComponent<any> {
  static propTypes = {
    /** Size of a page, (1=100%, 1.5=1 and 1/2, ...) */
    factor: PropTypes.number,
    /** Determines where the layer will be at when scrolled to (0=start, 1=1st page, ...) */
    offset: PropTypes.number,
    /** shifts the layer in accordance to its offset, values can be positive or negative */
    speed: PropTypes.number,
  }

  static defaultProps = {
    factor: 1,
    offset: 0,
    speed: 0,
  }

  parent: any
  controller: any

  componentDidMount() {
    const parent = this.parent
    if (parent) {
      parent.layers = parent.layers.concat(this)
      parent.update()
    }
  }

  componentWillUnmount() {
    const parent = this.parent
    if (parent) {
      parent.layers = parent.layers.filter(layer => layer !== this)
      parent.update()
    }
  }

  setPosition(height, scrollTop, immediate = false) {
    const { config: conf } = this.parent.props
    const targetScroll = Math.floor(this.props.offset) * height
    const offset = height * this.props.offset + targetScroll * this.props.speed
    // @ts-ignore
    const to = parseFloat(-(scrollTop * this.props.speed) + offset)
    this.controller.update({ translate: to, config: conf, immediate })
  }

  setHeight(height, immediate = false) {
    const { config: conf } = this.parent.props
    // @ts-ignore
    const to = parseFloat(height * this.props.factor)
    this.controller.update({ space: to, config: conf, immediate })
  }

  initialize() {
    const props = this.props
    const parent = this.parent
    const targetScroll = Math.floor(props.offset) * parent.space
    const offset = parent.space * props.offset + targetScroll * props.speed
    // @ts-ignore
    const to = parseFloat(-(parent.current * props.speed) + offset)
    this.controller = new Controller({
      space: parent.space * props.factor,
      translate: to,
    })
  }

  renderLayer = () => {
    const { style, children, offset, speed, factor, className, ...props } = this.props
    const horizontal = this.parent.props.horizontal

    const translate3d = this.controller.interpolations.translate.interpolate(x =>
      horizontal ? `translate3d(${x}px,0,0)` : `translate3d(0,${x}px,0)`,
    )

    return (
      <AnimatedDiv
        {...props}
        className={className}
        style={{
          position: 'absolute',
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
          [horizontal ? 'height' : 'width']: '100%',
          [horizontal ? 'width' : 'height']: this.controller.interpolations.space,
          WebkitTransform: translate3d,
          MsTransform: translate3d,
          transform: translate3d,
          ...style,
        }}
      >
        {children}
      </AnimatedDiv>
    )
  }

  render() {
    return (
      <Consumer>
        {parent => {
          if (parent && !this.parent) {
            this.parent = parent
            this.initialize()
          }
          return this.renderLayer()
        }}
      </Consumer>
    )
  }
}

export class Parallax extends React.PureComponent<any> {
  // TODO keep until major release
  static Layer = ParallaxLayer

  static propTypes = {
    /** Determines the total space of the inner content where each page takes 100% of the visible container */
    pages: PropTypes.number.isRequired,
    /** Spring config (optional) */
    config: PropTypes.object,
    /** Allow content to be scrolled, or not */
    scrolling: PropTypes.bool,
    /** Scrolls horizontally or vertically */
    horizontal: PropTypes.bool,
  }

  static defaultProps = {
    config: config.slow,
    scrolling: true,
    horizontal: false,
  }

  state = { ready: false }
  layers = []
  current = 0
  offset = 0
  busy = false
  controller = new Controller({ scroll: 0 })
  space: any
  container: any
  content: any

  moveItems = () => {
    this.layers.forEach(layer => layer.setPosition(this.space, this.current))
    this.busy = false
  }

  scrollerRaf = () => Globals.requestFrame(this.moveItems)

  onScroll = () => {
    const { horizontal } = this.props
    if (!this.busy) {
      this.busy = true
      this.scrollerRaf()
      this.current = this.props.container[getScrollType(horizontal)]
    }
  }

  update = () => {
    const { scrolling, horizontal } = this.props
    const scrollType = getScrollType(horizontal)
    if (!this.container) return
    if (scrolling) {
      this.current = this.container[scrollType]
    } else {
      console.log('setting container scrolltop')
      this.container[scrollType] = this.current = this.offset * this.space
    }
    if (this.content) {
      this.content.style[horizontal ? 'width' : 'height'] = `${this.space * this.props.pages}px`
    }
    this.layers.forEach(layer => {
      layer.setHeight(this.space, true)
      layer.setPosition(this.space, this.current, true)
    })
  }

  updateRaf = throttle(() => {
    Globals.requestFrame(this.update)
    // Some browsers don't fire on maximize
    // setTimeout(this.update, 150)
  }, 100)

  scrollStop = () => this.controller.stop()

  scrollTo(offset) {
    const { horizontal } = this.props
    const scrollType = getScrollType(horizontal)
    this.scrollStop()
    this.offset = offset
    const target = this.container

    this.controller.update({
      scroll: offset * this.space,
      config: this.props.config,
      onFrame: ({ scroll }) => (target[scrollType] = scroll),
    })
  }

  componentDidMount() {
    this.space = this.props.pageHeight
    window.addEventListener('resize', this.updateRaf, false)
    this.props.scrollingElement.addEventListener('scroll', this.onScroll, false)
    this.update()
    this.setState({ ready: true })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateRaf, false)
    this.props.scrollingElement.removeEventListener('scroll', this.onScroll, false)
  }

  componentDidUpdate() {
    this.space = this.props.pageHeight
    this.update()
  }

  render() {
    const {
      style,
      innerStyle,
      pages,
      id,
      className,
      scrolling,
      children,
      horizontal,
      showAbsolute,
    } = this.props
    return (
      <>
        <El
          // ref={node => (this.container = node)}
          onWheel={scrolling ? this.scrollStop : null}
          onTouchStart={scrolling ? this.scrollStop : null}
          style={{
            WebkitTransform: START_TRANSLATE,
            MsTransform: START_TRANSLATE,
            transform: START_TRANSLATE_3D,
            ...style,
          }}
          id={id}
          className={className}
        >
          {this.state.ready && (
            <El
              ref={node => (this.content = node)}
              style={{
                position: 'absolute',
                [horizontal ? 'height' : 'width']: '100%',
                WebkitTransform: START_TRANSLATE,
                MsTransform: START_TRANSLATE,
                transform: START_TRANSLATE_3D,
                overflow: 'hidden',
                [horizontal ? 'width' : 'height']: this.props.pageHeight * pages,
                ...innerStyle,
              }}
            >
              <Provider value={this}>{children}</Provider>
            </El>
          )}
        </El>
        {!showAbsolute && <div style={{ height: this.props.pageHeight * pages }} />}
      </>
    )
  }
}
