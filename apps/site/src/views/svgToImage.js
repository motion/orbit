import * as React from 'react'
import { findDOMNode } from 'react-dom'
const sleep = ms => new Promise(res => setTimeout(res, ms))

export class SVGToImage extends React.Component {
  state = {}
  async componentDidMount() {
    if (this.props.after) {
      await sleep(this.props.after)
    }
    const svg = findDOMNode(this).querySelector('svg')
    if (!svg) {
      console.log('no svg', this, svg)
      return
    }
    const svgString = new XMLSerializer().serializeToString(svg)
    const svgEncodedString = btoa(svgString)
    this.setState({ imgSrc: 'data:image/svg+xml;base64,' + svgEncodedString })
  }
  // to bitmap
  onImage = ref => {
    if (!ref) return
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.drawImage(ref, 0, 0)
    this.setState({
      imgSrc: null,
      src: canvas.toDataURL(),
      width: canvas.width,
      height: canvas.height,
    })
  }
  render() {
    if (!this.state.imgSrc) {
      return this.props.children
    }
    if (!this.state.src) {
      return (
        <img
          ref={this.onImage}
          src={this.state.imgSrc}
          css={{ width: '100%', height: '100%' }}
        />
      )
    }
    return <img {...this.state} />
  }
}
