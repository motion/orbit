// @flow
import * as React from 'react'
import Surface from './surface'

const LINE_HEIGHT = 32
const adj = x => (x === true ? 1 : x)

type Props = {
  size: number,
  sizeHeight: boolean | number,
  sizeFont?: boolean | number,
  sizePadding?: boolean | number,
  sizeMargin?: boolean | number,
}

export default class SizedSurface extends React.PureComponent<Props> {
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
