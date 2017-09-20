// @flow
import * as React from 'react'
import Surface from './surface'

const LINE_HEIGHT = 30
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
  }

  render() {
    const { props } = this
    const { sizeHeight, sizeMargin, sizeFont, sizePadding, ...rest } = props

    // sizes
    const height = sizeHeight
      ? Math.round(sizeHeight && props.size * LINE_HEIGHT * adj(sizeHeight))
      : props.height || undefined
    const fontSize = sizeFont && height * 0.45 * adj(sizeFont)
    const padWithWrap = props.wrapElement ? 0 : height ? height / 3.5 : 8
    const padding = (sizePadding && [19, padWithWrap * adj(sizePadding)]) || 0
    const margin = (sizeMargin && adj(sizeMargin) * 0.25) || 0

    const pass = {}
    if (sizeHeight) {
      pass.height = height
    }
    if (sizeFont) {
      pass.fontSize = fontSize
    }
    if (sizePadding) {
      pass.padding = [5, 10]
    }
    if (sizeMargin) {
      pass.margin = margin
    }

    return <Surface {...pass} {...rest} />
  }
}
