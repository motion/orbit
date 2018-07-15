import * as React from 'react'
import { view, on } from '@mcro/black'
import $ from '@mcro/color'
import throttle from 'raf-throttle'
import { Color } from '@mcro/css'

type ChildArgs = {
  translateX: number
  translateY: number
  glow: React.ReactNode
}

export type HoverGlowProps = {
  width: number
  height: number
  color: string
  zIndex: number
  resist: number
  scale: number
  opacity: number
  boundPct: number | string
  offsetTop: number
  offsetLeft: number
  clickable: boolean
  clickDuration: number
  clickScale: number
  duration: number
  overlayZIndex: number
  blur: number
  parent?: () => HTMLElement
  backdropFilter?: boolean
  restingPosition?: [number, number]
  full?: boolean
  borderRadius?: number
  borderLeftRadius?: number
  borderRightRadius?: number
  inverse?: boolean
  size?: number
  draggable?: boolean
  durationIn?: number
  durationOut?: number
  behind?: boolean
  background?: Color
  gradient?: string
  overflow?: boolean
  hide?: boolean
  children?: (a: ChildArgs) => React.ReactNode
}

const Overlay = view({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  userSelect: 'none',
})

const Glow = view({
  opacity: 1,
  pointerEvents: 'none',
  position: 'absolute',
  top: '50%',
  left: '50%',
})

@view.ui
export class HoverGlow extends React.Component<HoverGlowProps> {
  static acceptsHovered = 'show'

  static defaultProps = {
    width: 380,
    height: 200,
    color: [255, 255, 255],
    zIndex: 1,
    resist: 0,
    scale: 1,
    opacity: 0.025,
    boundPct: null,
    offsetTop: 0,
    offsetLeft: 0,
    clickable: false,
    clickDuration: 150,
    clickScale: 2,
    duration: 200,
    overlayZIndex: 1,
    blur: 15,
    backdropFilter: 'contrast(100%)',
    restingPosition: null,
  }

  state = {
    clicked: false,
    mounted: false,
    track: false,
    parentNode: null,
    position: { x: 0, y: 0 },
    bounds: { width: 0, height: 0 },
  }

  unmounted = false
  parentNode = null
  rootRef = React.createRef()

  componentDidMount() {
    on(
      this,
      setTimeout(() => {
        this.follow()
      }, 100),
    )
  }

  follow() {
    let parentNode
    if (typeof this.props.parent === 'function') {
      parentNode = this.props.parent()
    } else if (this.rootRef) {
      const node = this.rootRef.current
      if (!node) {
        return
      }
      parentNode = node.parentNode
    }
    if (parentNode) {
      this.setState({ parentRect: parentNode.getBoundingClientRect() })
      const bounds = parentNode.getBoundingClientRect()
      this.setState({ parentNode, bounds })
      // @ts-ignore
      const trackMouseTrue = throttle(() => this.trackMouse(true))
      // @ts-ignore
      const trackMouseFalse = throttle(() => this.trackMouse(false))
      on(this, parentNode, 'mouseenter', trackMouseTrue)
      on(this, parentNode, 'mousemove', this.move)
      on(this, parentNode, 'mouseleave', trackMouseFalse)
      if (this.props.clickable) {
        on(this, parentNode, 'mousedown', this.mouseDown)
      }
      const { restingPosition } = this.props
      if (restingPosition) {
        const [x, y] = restingPosition
        this.setMouseTo(x + bounds.left, y + bounds.top)
      }
    }
    if (!this.props.hide) {
      // trigger it to show
      this.setState({ mounted: true })
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  // offset gives us offset without scroll, just based on parent
  move = e => {
    this.setMouseTo(e.clientX, e.clientY)
  }

  setMouseTo = (x1, y1) => {
    const x = x1 - this.state.parentRect.left
    const y = y1 - this.state.parentRect.top
    // if (this.unmounted || !this.state.bounds) {
    //   console.log('bad')
    //   return
    // }
    this.setState({
      position: {
        x: x - this.state.bounds.width / 2,
        y: y - this.state.bounds.height / 2,
      },
    })
  }

  mouseDown = () => {
    this.setState({ clicked: true }, () => {
      on(
        this,
        setTimeout(() => {
          this.setState({ clicked: false })
        }, this.props.clickDuration),
      )
    })
  }

  trackMouse = track => {
    if (this.unmounted) return
    this.setState({ willTrack: true })
    on(
      this,
      setTimeout(() => {
        this.setState({ track })
      }),
    )
  }

  render() {
    const {
      boundPct,
      scale,
      color,
      clickable,
      clickDuration,
      parent,
      backdropFilter,
      restingPosition,
      zIndex,
      resist,
      opacity,
      offsetTop,
      offsetLeft,
      width: propWidth,
      height: propHeight,
      clickScale,
      duration: _duration,
      children,
      overlayZIndex,
      blur,
      full,
      borderRadius,
      borderLeftRadius,
      borderRightRadius,
      inverse,
      size,
      draggable,
      durationIn,
      durationOut,
      behind,
      background,
      gradient,
      overflow,
      hide,
      ...props
    } = this.props
    console.time('color')
    $(color).toString()
    console.timeEnd('color')
    const show = !hide
    const durationArg = show ? durationOut : durationIn
    const duration = durationArg >= 0 ? durationArg : _duration
    if (!this.state.mounted) {
      return (
        <Overlay key="hoverglow" ref={this.rootRef} style={{ opacity: 0 }} />
      )
    }
    // find width / height (full == match size of container)
    let width = size || propWidth
    let height = size || propHeight
    if (full) {
      width = this.state.bounds.width
      height = this.state.bounds.height
    }
    if (isNaN(width) || isNaN(height)) {
      console.warn('hoverglow NaN width or height', this.state)
      return null
    }
    const { position, clicked } = this.state
    const x = position.x || 0
    const y = position.y || 0
    // resists being moved (towards center)
    const resisted = coord => {
      if (resist === 0) return coord
      const resistAmt = 1 - resist / 100
      return coord * resistAmt
    }
    // bounds it within box x% size of parent
    const bounded = (coord, glowSize, parentSize) => {
      if (boundPct === null || boundPct > 100) return coord
      const difference = parentSize - glowSize
      const direction = coord / Math.abs(coord)
      const max = (difference * (boundPct / 100)) / 2
      const cur = Math.abs(coord)
      return Math.min(max, cur) * direction
    }
    const inversed = coord => {
      if (!inverse) return coord
      return -coord
    }
    const translateX = inversed(
      bounded(resisted(x), width * scale, this.state.bounds.width),
    )
    const translateY = inversed(
      bounded(resisted(y), height * scale, this.state.bounds.height),
    )
    const extraScale = clicked ? clickScale : 1
    const glow = (
      <Overlay
        key="hoverglow"
        ref={this.rootRef}
        css={{
          WebkitAppRegion: draggable ? 'drag' : 'no-drag',
          borderLeftRadius: borderLeftRadius || borderRadius,
          borderRightRadius: borderRightRadius || borderRadius,
          overflow,
          zIndex: behind ? -1 : overlayZIndex,
        }}
        {...props}
      >
        <Glow
          style={{
            zIndex: behind ? -1 : 1,
            willChange:
              this.state.willTrack || this.state.track ? 'transform' : '',
            transition: `
              transform linear ${duration}ms
            `,
            transform: `
                translateX(${translateX + offsetLeft}px)
                translateY(${translateY + offsetTop}px)
                translateZ(0px)
              `,
          }}
        >
          <div
            style={{
              transform:
                scale * extraScale !== 1
                  ? `scale(${scale * extraScale}) translateZ(0px)`
                  : 'translateZ(0px)',
              opacity: hide ? 0 : opacity,
              width,
              height,
              marginLeft: -width / 2,
              marginTop: -height / 2,
              filter: blur ? `blur(${blur}px)` : '',
              // backdropFilter,
              zIndex,
              background:
                background || gradient
                  ? `radial-gradient(${color}, transparent 70%)`
                  : color,
              borderRadius,
              transition: `
                  opacity linear ${duration}ms
                `,
            }}
          />
        </Glow>
      </Overlay>
    )
    if (!children) {
      return glow
    }
    // allow passthrough
    return children({
      translateX,
      translateY,
      glow,
    })
  }
}

HoverGlow.acceptsHovered = 'show'
