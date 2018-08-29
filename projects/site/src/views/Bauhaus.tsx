import * as React from 'react'
import Warp from 'warpjs'
import { findDOMNode } from 'react-dom'
import * as UI from '@mcro/ui'

export class Bauhaus extends React.Component<{
  showTriangle?: boolean
  showSquare?: boolean
  showCircle?: boolean
}> {
  componentDidMount() {
    const svg = findDOMNode(this).querySelector('svg')
    const warp = new Warp(svg)
    // Need to interpolate first, so angles remain sharp
    warp.interpolate(2)
    warp.transform(
      this.props.warp ||
        (([x, y]) => [x + 4 * Math.sin(x / 50), y - 4 * -Math.sin(x / 20)]),
    )
    warp.update()
  }

  render() {
    const {
      showTriangle,
      showSquare,
      showCircle,
      circleColor,
      warp,
      stroke = 'transprent',
      ...props
    } = this.props
    return (
      <UI.FullScreen
        transform={{ scale: 0.85, x: '62%', y: '-20%', z: 0 }}
        zIndex={0}
        pointerEvents="none"
        {...props}
      >
        <svg viewBox="0 0 303 251" style={{ overflow: 'visible' }}>
          {showCircle && (
            <circle
              cx="88.784"
              cy="141.382"
              r="88.784"
              style={{
                fill: circleColor || '#1bf5dc',
                stroke,
                strokeWidth: 2,
                mixBlendMode: 'multiply',
              }}
            />
          )}
          {showSquare && (
            <path
              d="M278.078,26.195l-161.04,-26.195l-26.195,161.04l161.04,26.195l26.195,-161.04Z"
              style={{
                fill: '#a949f8',
                stroke,
                strokeWidth: 2,
                mixBlendMode: 'multiply',
              }}
            />
          )}
          {showTriangle && (
            <path
              d="M170.608,63.772l131.392,155.722l-213.216,30.874l81.824,-186.596Z"
              style={{
                fill: '#facc11',
                stroke,
                strokeWidth: 2,
                mixBlendMode: 'multiply',
              }}
            />
          )}
        </svg>
      </UI.FullScreen>
    )
  }
}
