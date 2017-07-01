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
    const height = props.height || props.size * LINE_HEIGHT
    const fontSize = props.fontSize || height * 0.45
    const borderRadius = props.borderRadius || height / 4

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
