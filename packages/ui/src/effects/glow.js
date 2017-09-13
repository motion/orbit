// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import $ from 'color'
import offset from '~/helpers/offset'
import { throttle } from 'lodash-decorators'
import type { Color } from 'gloss'

type Props = {
  width: number,
  height: number,
  color: Color,
  zIndex: number,
  resist: number,
  scale: number,
  opacity: number,
  boundPct: number | string,
  offsetTop: number,
  offsetLeft: number,
  clickable: boolean,
  clickDuration: number,
  clickScale: number,
  transition: number,
  overlayZIndex: number,
  blur: number,
}

type State = {
  track: boolean,
  position: Object,
}

@view.ui
class HoverGlow extends React.PureComponent<Props, State> {
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
    transition: 0,
    overlayZIndex: 1,
    blur: 15,
    // backdropFilter: 'contrast(100%)',
  }

  state = {
    track: false,
    position: {},
  }

  rootRef = null
  bounds = {}

  componentDidMount() {
    this.setState = this.setState.bind(this)
    this.setTimeout(() => {
      this.follow()
    })
  }

  follow() {
    let node

    if (this.props.parent) {
      node = this.props.parent()
    } else if (this.rootRef) {
      node = this.rootRef.parentNode
    }

    if (node) {
      this.node = node
      this.setBounds()
      this.on(node, 'mouseenter', () => {
        this.trackMouse(true)
      })
      this.on(node, 'mousemove', event => {
        this.move(event)
      })
      this.on(node, 'mouseleave', () => {
        this.trackMouse(false)
      })
      // Resize.listenTo(node, this.setBounds)

      if (this.props.clickable) {
        this.on(node, 'mousedown', event => {
          this.mouseDown(event)
        })
      }
    }

    if (this.props.show) {
      // trigger it to show
      this.setState({})
    }
  }

  componentWillUnmount() {
    this.unmounted = true
    if (this.node) {
      // Resize.removeAllListeners(this.node)
    }
  }

  setBounds() {
    this.bounds = this.node.getBoundingClientRect()
  }

  // offset gives us offset without scroll, just based on parent
  @throttle(14)
  move(e) {
    const [x, y] = offset(e, this.node)
    if (this.unmounted || !this.bounds) {
      console.log('no move', this)
      return
    }
    this.setState({
      position: {
        x: x - this.bounds.width / 2,
        y: y - this.bounds.height / 2,
      },
    })
  }

  mouseDown() {
    this.setState({ clicked: true }, () => {
      this.setTimeout(() => {
        this.setState({ clicked: false })
      }, this.props.clickDuration)
    })
  }

  @throttle(14)
  trackMouse(track) {
    if (this.unmounted) {
      return
    }
    this.setState({ track })
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
    transition,
    parent,
    children,
    behind,
    background,
    gradient,
    backdropFilter,
    overflow,
    overlayZIndex,
    blur,
    show,
    ...props
  }) {
    const setRootRef = this.ref('rootRef').set
    const { track } = this.state

    if (!show && !transition && ((!track && !children) || !track)) {
      return <overlay ref={setRootRef} style={{ opacity: 0 }} />
    }

    // find width / height (full == match size of container)
    let width = size || propWidth
    let height = size || propHeight
    if (full) {
      width = this.bounds.width
      height = this.bounds.height
    }

    const isNaNw = typeof width === 'number' && width === NaN
    const isNaNh = typeof height === 'number' && height === NaN

    if (isNaNw || isNaNh) {
      console.log('weird')
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
      bounded(resisted(x), width * scale, this.bounds.width)
    )
    const translateY = inversed(
      bounded(resisted(y), height * scale, this.bounds.height)
    )
    const extraScale = clicked ? clickScale : 1

    const glow = (
      <overlay
        ref={setRootRef}
        $$draggable={draggable}
        css={{
          borderLeftRadius: borderLeftRadius || borderRadius,
          borderRightRadius: borderRightRadius || borderRadius,
          overflow,
          zIndex: behind ? -1 : overlayZIndex,
        }}
        {...props}
      >
        <glow
          style={{
            zIndex: behind ? -1 : 1,
            opacity: 1,
            transition: `
              transform linear ${transition}ms
            `,
            transform: `
                translateX(${translateX + offsetLeft}px)
                translateY(${translateY + offsetTop}px)
                translateZ(0px)
              `,
          }}
        >
          <blur
            height={height}
            width={width}
            style={{
              transform: `scale(${scale * extraScale}) translateZ(0px)`,
              opacity: track || show ? opacity : 0,
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
                  opacity linear ${transition}ms
                `,
            }}
          />
        </glow>
      </overlay>
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
      transform: 'translateZ(0)',
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
      transform: 'translateZ(0)',
    },
  }
}

HoverGlow.acceptsHovered = 'show'

export default HoverGlow
