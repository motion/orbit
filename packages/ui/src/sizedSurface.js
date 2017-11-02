// @flow
import * as React from 'react'
import Surface from './surface'

const LINE_HEIGHT = 30
const num = x => (x === true ? 1 : x || 1)

type Props = {
  size: number,
  sizeHeight: boolean | number,
  sizeFont?: boolean | number,
  sizePadding?: boolean | number,
  sizeMargin?: boolean | number,
  sizeRadius?: boolean | number,
}

export default function SizedSurface(props: Props) {
  const {
    sizeHeight,
    sizeMargin,
    sizeFont,
    sizePadding,
    sizeRadius,
    ...rest
  } = props

  const size = num(props.size)

  // sizes
  let height = sizeHeight
    ? Math.round(sizeHeight && size * LINE_HEIGHT * num(sizeHeight))
    : props.height || undefined

  // adjust for border x 2 (just looks good)
  if (props.inline) {
    height = height - 4
  }

  const pass = {}
  if (sizeHeight) {
    pass.height = height
  }
  if (sizeFont) {
    const fontSize = sizeFont && height * 0.45 * num(sizeFont)
    pass.fontSize = fontSize
  }
  if (sizePadding) {
    const padWithWrap = props.wrapElement ? 0 : height ? height / 3.5 : 8
    const padding = (sizePadding && [0, padWithWrap * num(sizePadding)]) || 0
    pass.padding = padding
  }
  if (sizeMargin) {
    const margin = (sizeMargin && num(sizeMargin) * 0.25) || 0
    pass.margin = margin
  }
  if (sizeRadius) {
    const radius = (sizeRadius && num(sizeRadius) * 8) || 0
    pass.borderRadius = radius
  }

  return <Surface {...pass} {...rest} />
}
