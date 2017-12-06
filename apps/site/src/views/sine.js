import * as React from 'react'

export default class SineWave extends React.Component {
  static defaultProps = {
    amplitude: 20,
    rarity: 1,
    freq: 0.05,
    phase: 50,
    color: '#000',
    strokeWidth: 1,
  }

  setRef = svg => {
    const {
      x,
      y,
      amplitude,
      rarity,
      freq,
      phase,
      color,
      strokeWidth,
    } = this.props

    if (svg) {
      //origin of axes
      var origin = { x: x || 0, y: y || amplitude + strokeWidth / 2 }
      for (var i = -100; i < 3100; i++) {
        var line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        )
        line.setAttribute('x1', (i - 1) * rarity + origin.x)
        line.setAttribute(
          'y1',
          Math.sin(freq * (i - 1 + phase)) * amplitude + origin.y
        )
        line.setAttribute('x2', i * rarity + origin.x)
        line.setAttribute(
          'y2',
          Math.sin(freq * (i + phase)) * amplitude + origin.y
        )
        line.setAttribute(
          'style',
          `stroke:${color};stroke-width:${strokeWidth}`
        )
        svg.appendChild(line)
      }
    }
  }

  render() {
    const {
      color,
      strokeWidth,
      x,
      y,
      amplitude,
      rarity,
      freq,
      phase,
      ...props
    } = this.props
    return (
      <svg
        {...props}
        css={{ height: amplitude * 2 + strokeWidth }}
        ref={this.setRef}
      />
    )
  }
}
