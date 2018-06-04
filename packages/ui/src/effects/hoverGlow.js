import * as React from 'react'
import { view } from '@mcro/black'
import $ from 'color'
import throttle from 'raf-throttle'

// type Props = {
//   width: number,
//   height: number,
//   color: Color,
//   zIndex: number,
//   resist: number,
//   scale: number,
//   opacity: number,
//   boundPct: number | string,
//   offsetTop: number,
//   offsetLeft: number,
//   clickable: boolean,
//   clickDuration: number,
//   clickScale: number,
//   duration: number,
//   overlayZIndex: number,
//   blur: number,
// }

// type State = {
//   track: boolean,
//   position: Object,
// }

@view.ui
export class HoverGlow extends React.PureComponent {
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
    mounted: false,
    track: false,
    parentNode: null,
    position: {},
    bounds: { width: 0, height: 0 },
  }

  parentNode = null
  rootRef = React.createRef()

  componentDidMount() {
    // @ts-ignore
    this.setTimeout(() => {
      this.follow()
    }, 100)
  }

  follow() {
    let parentNode
    if (this.props.parent) {
      parentNode = this.props.parent()
    } else if (this.rootRef) {
      const node = this.rootRef.current
      if (!node) {
        console.warn('no node?')
        return
      }
      parentNode = node.parentNode
    }
    if (parentNode) {
      this.setState({ parentRect: parentNode.getBoundingClientRect() })
      const bounds = parentNode.getBoundingClientRect()
      this.setState({ parentNode, bounds })
      const trackMouseTrue = throttle(() => this.trackMouse(true))
      const trackMouseFalse = throttle(() => this.trackMouse(false))
      this.on(parentNode, 'mouseenter', trackMouseTrue)
      this.on(parentNode, 'mousemove', this.move)
      this.on(parentNode, 'mouseleave', trackMouseFalse)
      if (this.props.clickable) {
        this.on(parentNode, 'mousedown', this.mouseDown)
      }
    }
    if (!this.props.hide) {
      // trigger it to show
      this.setState({ mounted: true })
    }
    const { restingPosition } = this.props
    if (restingPosition) {
      this.setState({
        position: { x: -restingPosition[0], y: -restingPosition[1] },
      })
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  // offset gives us offset without scroll, just based on parent
  move = e => {
    const x = e.clientX - this.state.parentRect.left
    const y = e.clientY - this.state.parentRect.top
    if (this.unmounted || !this.state.bounds) {
      return
    }
    this.setState({
      position: {
        x: x - this.state.bounds.width / 2,
        y: y - this.state.bounds.height / 2,
      },
    })
  }

  mouseDown = () => {
    this.setState({ clicked: true }, () => {
      this.setTimeout(() => {
        this.setState({ clicked: false })
      }, this.props.clickDuration)
    })
  }

  trackMouse = track => {
    if (this.unmounted) return
    this.setState({ willTrack: true })
    // @ts-ignore
    this.setTimeout(() => {
      this.setState({ track })
    })
  }

  render({
    boundPct,
    full,
    scale,
    color,
    clickable,
    borderRadius,
    borderLeftRadius,
    borderRightRadius,
    zIndex,
    resist,
    opacity,
    inverse,
    offsetTop,
    offsetLeft,
    width: propWidth,
    height: propHeight,
    size,
    clickDuration,
    clickScale,
    draggable,
    duration: _duration,
    durationIn,
    durationOut,
    parent,
    children,
    behind,
    background,
    gradient,
    backdropFilter,
    overflow,
    overlayZIndex,
    blur,
    hide,
    restingPosition,
    ...props
  }) {
    const show = !hide
    const durationArg = show ? durationOut : durationIn
    const duration = durationArg >= 0 ? durationArg : _duration
    const { track } = this.state
    if (!this.state.mounted) {
      console.log('return empty')
      return (
        <div
          $overlay
          key="hoverglow"
          ref={this.rootRef}
          style={{ opacity: 0 }}
        />
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
      const max = difference * (boundPct / 100) / 2
      const cur = Math.abs(coord)
      return Math.min(max, cur) * direction
    }
    const inversed = coord => {
      if (!inverse) return coord
      return -coord
    }
    const colorRGB = $(color).toString()
    const translateX = inversed(
      bounded(resisted(x), width * scale, this.state.bounds.width),
    )
    const translateY = inversed(
      bounded(resisted(y), height * scale, this.state.bounds.height),
    )
    const extraScale = clicked ? clickScale : 1
    console.log(width, height)
    const glow = (
      <div
        key="hoverglow"
        $overlay
        ref={this.rootRef}
        $$draggable={draggable}
        css={{
          borderLeftRadius: borderLeftRadius || borderRadius,
          borderRightRadius: borderRightRadius || borderRadius,
          overflow,
          zIndex: behind ? -1 : overlayZIndex,
        }}
        {...props}
      >
        <div
          $glow
          style={{
            zIndex: behind ? -1 : 1,
            opacity: 1,
            willChange:
              this.state.willTrack || this.state.track ? 'transform' : '',
            transition: `
              transform linear ${duration}ms
            `,
            transform: `
                translateX(${translateX + offsetLeft}px)
                translateY(${translateY + offsetTop}px)
              `,
          }}
        >
          <div
            $blur
            height={height}
            width={width}
            style={{
              transform: `scale(${scale * extraScale})`,
              opacity: hide ? 0 : opacity,
              width,
              height,
              marginLeft: -width / 2,
              marginTop: -height / 2,
              filter: blur ? `blur(${blur}px)` : '',
              backdropFilter,
              zIndex,
              background:
                background || gradient
                  ? `radial-gradient(${$(color).toString()}, transparent 70%)`
                  : colorRGB,
              borderRadius,
              transition: `
                  opacity linear ${duration}ms
                `,
            }}
          />
        </div>
      </div>
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

  static style = {
    overlay: {
      position: 'absolute',
      // transform: 'translateZ(0)',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      userSelect: 'none',
      // pointerEvents: 'none',
    },
    glow: {
      pointerEvents: 'none',
      position: 'absolute',
      top: '50%',
      left: '50%',
      // transform: 'translateZ(0)',
    },
  }
}

HoverGlow.acceptsHovered = 'show'
