// @flow
import React from 'react'
import Surface from './surface'

const LINE_HEIGHT = 30
const replaceWith = (into, outof) => obj => (obj === into ? outof : obj)
const apply = (obj, fn) => (Array.isArray(obj) ? obj.map(fn) : fn(obj))
const applyMultiply = (x, y) => apply(x, z => z * y)
const multiply = (val: any, size: number, replaceVal: any = 1) =>
  applyMultiply(replaceWith(true, replaceVal)(val), size)

const default1 = replaceWith(true, 1)

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
    const fontSize =
      props.fontSize || (sizeFont && height * 0.45 * default1(sizeFont))
    if (props.inline) {
      height = height * 0.8
    }
    const borderRadius =
      sizeRadius && height / 3.4 * multiply(props.radius, sizeRadius)
    const padWithWrap = props.wrapElement ? 0 : height / 3.5
    const padding =
      props.padding ||
      (sizePadding && [0, padWithWrap * multiply(props.padding, sizePadding)])
    const margin = sizeMargin && multiply(props.margin, sizeMargin) * 0.25

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
