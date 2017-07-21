// @flow
import React from 'react'
import Surface from './surface'

const LINE_HEIGHT = 32
const adj = x => (x === true ? 1 : x)

export default class SizedSurface extends React.Component {
  static defaultProps = {
    size: 1,
    sizeHeight: true,
  }

  render() {
    const { props } = this
    const { sizeHeight, sizeMargin, sizeFont, sizePadding, ...rest } = props

    // sizes
    let height = Math.round(
      sizeHeight && props.size * LINE_HEIGHT * adj(sizeHeight)
    )
    const fontSize = sizeFont && height * 0.45 * adj(sizeFont)
    if (props.inline) {
      height = Math.round(height * 0.8)
    }
    const padWithWrap = props.wrapElement ? 0 : height / 3.5
    const padding = sizePadding && [0, padWithWrap * adj(sizePadding)]
    const margin = sizeMargin && adj(sizeMargin) * 0.25

    const pass = {
      height,
      fontSize,
      padding,
      margin,
    }

    return <Surface {...pass} {...rest} />
  }
}
