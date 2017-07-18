// @flow
import React from 'react'
import Surface from './surface'

const LINE_HEIGHT = 30
const replaceWith = (into, outof) => obj => (obj === into ? outof : obj)
const default1 = replaceWith(true, 1)

const apply = (obj: any, fn: Function) =>
  Array.isArray(obj) ? obj.map(fn) : fn(obj)
const applyMultiply = (x, y) => apply(x, z => z * y)
const multiply = (val: any, size: number) => applyMultiply(default1(val), size)

export default class SizedSurface extends React.Component {
  static defaultProps = {
    size: 1,
    sizeHeight: true,
  }

  render() {
    const { props } = this
    const {
      sizeHeight,
      sizeMargin,
      sizeRadius,
      sizeFont,
      sizePadding,
      ...rest
    } = props

    // sizes
    let height = sizeHeight && props.size * LINE_HEIGHT * default1(sizeHeight)
    const fontSize = sizeFont && height * 0.45 * default1(sizeFont)

    // do after fontSize calc
    if (props.inline) {
      height = height * 0.8
    }

    const borderRadius =
      sizeRadius && height / 3.4 * multiply(props.radius, sizeRadius)

    const sizePadding2 = props.wrapElement ? 0 : height / 3.5
    const padding =
      sizePadding && multiply(props.padding, sizePadding2 * sizePadding)

    const margin = sizeMargin && multiply(props.margin, sizeMargin * 0.25)

    const pass = {
      borderRadius,
      height,
      fontSize,
      padding,
      margin,
    }

    return <Surface {...pass} {...rest} />
  }
}
