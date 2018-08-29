import * as React from 'react'
import PropTypes from 'prop-types'
import {
  controller,
  AnimatedValue,
  createAnimatedComponent,
  SpringAnimation,
  config,
} from 'react-spring'
import * as _ from 'lodash'

const AnimatedDiv = createAnimatedComponent('div')
const { Provider, Consumer } = React.createContext(null)

function getScrollType(horizontal) {
  return horizontal ? 'scrollLeft' : 'scrollTop'
}

const START_TRANSLATE_3D = 'translate3d(0px,0px,0px)'
const START_TRANSLATE = 'translate(0px,0px)'

export class ParallaxLayer extends React.PureComponent {
  static propTypes = {
    factor: PropTypes.number,
    offset: PropTypes.number,
    speed: PropTypes.number,
  }

  static defaultProps = {
    factor: 1,
    offset: 0,
    speed: 0,
  }

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
      // parent.update()
    }
  }

  lastFixedAt = false

  setPosition(height, parentScrollTop, immediate = false) {
    const isFixed = typeof this.props.scrollTop === 'number'
    if (isFixed && this.lastFixedAt === parentScrollTop) {
      return
    }
    if (isFixed) {
      this.lastFixedAt = parentScrollTop
    } else {
      this.lastFixedAt = false
    }
    const scrollTop = isFixed ? this.props.scrollTop : parentScrollTop
    const targetScroll = Math.floor(this.props.offset) * height
    const offset = height * this.props.offset + targetScroll * this.props.speed
    const to = parseFloat(-(scrollTop * this.props.speed) + offset)
    this.updateEffect(this.animatedTranslate, to, immediate)
    const distanceFromTarget = scrollTop + height - targetScroll
    const toPlain = distanceFromTarget / (height * this.props.offset)
    this.updateCustomEffects(toPlain, immediate)
  }

  setHeight(height, immediate = false) {
    const to = parseFloat(height * this.props.factor)
    this.updateEffect(this.animatedSpace, to, immediate)
  }

  updateEffect(effect, to, immediate) {
    const { config, impl } = this.parent.props
    if (!immediate) {
      controller(effect, { to, ...config }, impl).start()
    } else {
      effect.setValue(to)
    }
  }

  updateCustomEffects(to, immediate) {
    if (!this.effects) {
      return
    }
    for (const key of Object.keys(this.effects)) {
      this.updateEffect(this.effects[key], to, immediate)
    }
  }

  initialize() {
    const props = this.props
    const parent = this.parent
    const targetScroll = Math.floor(props.offset) * parent.space
    const offset = parent.space * props.offset + targetScroll * props.speed
    const to = parseFloat(-(parent.current * props.speed) + offset)
    this.animatedTranslate = new AnimatedValue(to)
    this.animatedSpace = new AnimatedValue(parent.space * props.factor)
    if (this.props.effects) {
      this.effects = {}
      for (const key of Object.keys(this.props.effects)) {
        this.effects[key] = new AnimatedValue(to)
      }
    }
  }

  renderLayer() {
    const {
      style,
      children,
      offset,
      speed,
      factor,
      className,
      effects,
      horizontal,
      scrollTop,
      ...props
    } = this.props
    const isHoriztonal = horizontal || this.parent.props.horizontal
    const translate3d = this.animatedTranslate.interpolate({
      range: [0, 1],
      output: isHoriztonal
        ? [START_TRANSLATE_3D, 'translate3d(1px,0,0)']
        : [START_TRANSLATE_3D, 'translate3d(0,1px,0)'],
    })
    const customEffects = {}
    if (effects) {
      for (const key of Object.keys(effects)) {
        customEffects[key] = this.effects[key].interpolate(effects[key])
      }
    }
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
          [horizontal ? 'width' : 'height']: this.animatedSpace,
          WebkitTransform: translate3d,
          MsTransform: translate3d,
          transform: translate3d,
          ...style,
          ...customEffects,
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

export class Parallax extends React.PureComponent {
  // TODO keep until major release
  static Layer = ParallaxLayer

  static propTypes = {
    pages: PropTypes.number.isRequired,
    config: PropTypes.object,
    horizontal: PropTypes.bool,
    impl: PropTypes.func,
  }

  static defaultProps = {
    config: config.slow,
    horizontal: false,
    impl: SpringAnimation,
  }

  state = { ready: false }
  layers = []
  space = 0
  current = 0
  offset = 0
  busy = false

  moveItems = () => {
    this.layers.forEach(layer => layer.setPosition(this.space, this.current))
    this.busy = false
  }

  scrollerRaf = () => requestAnimationFrame(this.moveItems)

  componentDidMount() {
    window.addEventListener('resize', this.updateRaf, false)
    this.props.scrollingElement.addEventListener('scroll', this.onScroll, false)
    this.current = this.props.container[getScrollType(this.props.horizontal)]
    this.offset = this.current / this.props.pageHeight
    this.update()
    this.setState({ ready: true })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateRaf, false)
    this.props.scrollingElement.removeEventListener(
      'scroll',
      this.onScroll,
      false,
    )
  }

  componentDidUpdate() {
    this.update()
  }

  onScroll = () => {
    if (this.props.paused) {
      return
    }
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
    if (!this.props.container) return
    this.space = this.props.pageHeight
    if (scrolling) {
      this.current = this.props.container[scrollType]
    } else {
      this.props.container[scrollType] = this.current = this.offset * this.space
    }
    if (this.content) {
      this.content.style[horizontal ? 'width' : 'height'] = `${this.space *
        this.props.pages}px`
    }
    this.layers.forEach(layer => {
      layer.setHeight(this.space, true)
      layer.setPosition(this.space, this.current, true)
    })
  }

  updateRaf = () => {
    requestAnimationFrame(this.update)
    // Some browsers don't fire on maximize
    setTimeout(this.update, 150)
  }

  scrollStop = () => {
    this.animatedScroll && this.animatedScroll.stopAnimation()
  }

  scrollTo(offset) {
    const { horizontal, config, impl } = this.props
    const scrollType = getScrollType(horizontal)
    this.scrollStop()
    this.offset = offset
    const target = this.props.container
    this.animatedScroll = new AnimatedValue(target[scrollType])
    this.animatedScroll.addListener(({ value }) => {
      target[scrollType] = value
    })
    controller(
      this.animatedScroll,
      { to: offset * this.space, ...config },
      impl,
    ).start()
  }

  render() {
    const {
      style,
      innerStyle,
      pages,
      className,
      children,
      horizontal,
      showAbsolute,
    } = this.props
    return (
      <>
        <div
          style={{
            WebkitTransform: START_TRANSLATE,
            MsTransform: START_TRANSLATE,
            transform: START_TRANSLATE_3D,
            ...style,
          }}
          className={className}
        >
          {this.state.ready ? (
            <div
              ref={node => (this.content = node)}
              style={{
                position: 'absolute',
                [horizontal ? 'height' : 'width']: '100%',
                WebkitTransform: START_TRANSLATE,
                MsTransform: START_TRANSLATE,
                transform: START_TRANSLATE_3D,
                [horizontal ? 'width' : 'height']: this.space * pages,
                ...innerStyle,
              }}
            >
              <Provider value={this}>{children}</Provider>
            </div>
          ) : null}
        </div>
        <div
          if={!showAbsolute}
          style={{ height: this.props.pageHeight * pages }}
        />
      </>
    )
  }
}
