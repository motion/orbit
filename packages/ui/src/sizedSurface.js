// @flow
import React from 'react'
import Surface from './surface'

const LINE_HEIGHT = 30

export default class SizedSurface extends React.Component {
  static defaultProps = {
    size: 1,
  }

  render() {
    const { props } = this
    const { sizeHeight, sizeRadius, sizeFont, sizePadding, ...rest } = props

    // sizes
    const height = sizeHeight && props.size * LINE_HEIGHT
    const fontSize = sizeFont && height * 0.45
    const borderRadius = sizeRadius && height / 3.4
    const padding = sizePadding && (props.wrapElement ? 0 : [0, height / 3.5])

    const pass = {
      borderRadius,
      height,
      fontSize,
      padding,
    }

    return <Surface {...pass} {...rest} />
  }
}
