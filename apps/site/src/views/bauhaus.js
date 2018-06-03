import * as React from 'react'
import Warp from 'warpjs'

export class Bauhaus extends React.Component {
  componentDidMount() {
    const svg = document.getElementById('svg-element')
    const warp = new Warp(svg)
    // Need to interpolate first, so angles remain sharp
    warp.interpolate(4)
    warp.transform(([x, y]) => [x, y + 4 * Math.sin(x / 30)])
  }

  render() {
    return (
      <bahaus
        $$fullscreen
        css={{ transform: { scale: 0.54, x: '50%', y: '-13%' }, opacity: 0.2 }}
      >
        <svg id="svg-element" viewBox="0 0 303 251">
          <circle
            cx="88.784"
            cy="141.382"
            r="88.784"
            style={{ fill: '#00fbd1', 'mix-blend-mode': 'multiply' }}
          />
          <path
            d="M278.078,26.195l-161.04,-26.195l-26.195,161.04l161.04,26.195l26.195,-161.04Z"
            style={{ fill: '#d867ff', 'mix-blend-mode': 'multiply' }}
          />
          <path
            d="M170.608,63.772l131.392,155.722l-213.216,30.874l81.824,-186.596Z"
            style={{ fill: '#fffa2a', 'mix-blend-mode': 'multiply' }}
          />
        </svg>
      </bahaus>
    )
  }
}
