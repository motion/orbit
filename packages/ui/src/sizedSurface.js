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
    const { sizeHeight, sizeRadius, sizeFont, ...rest } = props
    // sizes
    const height =
      typeof props.height !== 'undefined'
        ? props.height
        : (sizeHeight && props.size * LINE_HEIGHT) || null
    const fontSize =
      typeof props.fontSize !== 'undefined'
        ? props.fontSize
        : (sizeFont && height * 0.45) || null
    const borderRadius =
      typeof props.borderRadius !== 'undefined'
        ? props.borderRadius
        : (sizeRadius && height / 4) || null

    const pass = {
      borderRadius,
      height,
      fontSize,
      padding:
        typeof props.padding !== 'undefined'
          ? props.padding
          : props.wrapElement ? 0 : [0, height / 3.4],
    }

    return <Surface {...rest} {...pass} />
  }
}
