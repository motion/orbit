// @flow
import React from 'react'
import { view } from '@jot/black'
import { $, clr } from '/helpers'
import { throttle } from 'lodash'
import { offset } from '/views/helpers'
import resizer from 'element-resize-detector'
import type { Color } from 'gloss'

const Resize = resizer({ strategy: 'scroll' })

@view.ui
export default class HoverGlow {
  props: {
    color: Color,
    background?: Color,
    behind?: boolean,
    children?: Function,
    blur: number,
    gradient?: boolean,
  }

  static defaultProps = {
    width: 380,
    height: 200,
    color: [0, 0, 0],
    zIndex: 100,
    resist: 0,
    scale: 1,
    opacity: 0.025,
    boundPct: null,
    borderRadius: 100,
    shadowSize: null,
    shadowOffsetTop: 0,
    shadowOffsetLeft: 0,
    clickable: false,
    clickDuration: 150,
    clickScale: 2,
    transition: 1000,
    blur: 10,
  }

  state = {
    track: false,
    position: {},
  }

  rootRef = null
  bounds = {}

  componentDidMount() {
    this.setTimeout(this.follow)
  }

  follow = () => {
    let node

    if (this.props.parent) {
      node = this.props.parent()
    } else if (this.rootRef) {
      node = this.rootRef.parentNode
    }

    if (node) {
      this.node = node
      this.setBounds()
      this.on(node, 'mouseenter', this.trackMouse(true))
      this.on(node, 'mousemove', this.move)
      this.on(node, 'mouseleave', this.trackMouse(false))
      Resize.listenTo(node, this.setBounds)

      if (this.props.clickable) {
        this.on(node, 'click', this.click)
      }
    }
  }

  componentWillUnmount() {
    this.unmounted = true
    if (this.node) {
      Resize.removeAllListeners(this.node)
    }
  }

  setBounds = throttle(() => {
    this.bounds = this.node.getBoundingClientRect()
  }, 100)

  // offset gives us offset without scroll, just based on parent
  move = throttle(e => {
    const [x, y] = offset(e, this.node)
    if (this.unmounted) return
    this.setState({
      position: {
        x: x - this.bounds.width / 2,
        y: y - this.bounds.height / 2,
      },
    })
  }, 16)

  click = () => {
    this.setState({ clicked: true }, () => {
      this.setTimeout(() => {
        this.setState({ clicked: false })
      }, this.props.clickDuration)
    })
  }

  trackMouse = track => () => {
    this.setState({ track })
  }

  render({
    boundPct,
    full,
    scale,
    color,
    zIndex,
    resist,
    opacity,
    inverse,
    borderRadius,
    shadowSize,
    shadowOffsetTop,
    shadowOffsetLeft,
    width: propWidth,
    height: propHeight,
    size,
    clickDuration,
    clickScale,
    transition,
    parent,
    itemProps,
    children,
    style,
    behind,
    background,
    gradient,
    blur,
  }) {
    const setRootRef = this.ref('rootRef').set

    const { track } = this.state

    if ((!track && !children) || !track) {
      return <overlay ref={setRootRef} style={{ opacity: 0 }} />
    }

    // find width / height (full == match size of container)
    let width = size || propWidth
    let height = size || propHeight
    if (full) {
      width = this.bounds.width
      height = this.bounds.height
    }

    const shadowAmt = shadowSize === null ? width + height : shadowSize

    const { position: { x, y }, clicked } = this.state

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

    const colorRGB = clr(color).toString()
    const translateX = inversed(
      bounded(resisted(x), width * scale, this.bounds.width)
    )
    const translateY = inversed(
      bounded(resisted(y), height * scale, this.bounds.height)
    )

    const glow = (
      <overlay ref={setRootRef} style={style} {...itemProps}>
        <glow
          style={{
            zIndex: behind ? -1 : 0,
            opacity: 1,
            transform: `
                translateX(${translateX}px)
                translateY(${translateY}px)
                translateZ(0px)
              `,
          }}
        >
          <blur
            height={height}
            width={width}
            style={{
              transform: `scale(${scale *
                (clicked ? clickScale : 1)}) translateZ(0px)`,
              opacity: track ? opacity : 0,
              width,
              height,
              marginLeft: -width / 2,
              marginTop: -height / 2,
              zIndex,
              WebkitFilter: blur ? `blur(${blur}px)` : '',
              background: background || gradient
                ? `radial-gradient(${clr(color).toString()}, transparent 70%)`
                : colorRGB,
              borderRadius,
              transition: `
                  transform linear ${clickDuration / 2}ms,
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
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // zIndex: -1,
      // transition: 'opacity ease-in 20ms',

      pointerEvents: 'none',
      '&:active': {
        pointerEvents: 'none',
      },
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
