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
    // sizes
    const height =
      typeof props.height === 'undefined'
        ? props.size * LINE_HEIGHT
        : props.height
    const fontSize =
      typeof props.fontSize === 'undefined' ? height * 0.45 : props.fontSize
    const borderRadius =
      typeof props.borderRadius === 'undefined'
        ? height / 4
        : props.borderRadius

    const pass = {
      borderRadius,
      height,
      fontSize,
      padding:
        typeof props.padding !== 'undefined'
          ? props.padding
          : props.wrapElement ? 0 : [0, height / 4],
    }

    return <Surface {...props} {...pass} />
  }
}
