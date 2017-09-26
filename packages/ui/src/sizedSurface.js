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

export default function SizedSurface(props: Props) {
  const {
    sizeHeight,
    sizeMargin,
    sizeFont,
    sizePadding,
    sizeRadius,
    ...rest
  } = props

  // sizes
  const height = sizeHeight
    ? Math.round(sizeHeight && props.size * LINE_HEIGHT * adj(sizeHeight))
    : props.height || undefined
  const fontSize = sizeFont && height * 0.45 * adj(sizeFont)
  const padWithWrap = props.wrapElement ? 0 : height ? height / 3.5 : 8
  const padding = (sizePadding && [0, padWithWrap * adj(sizePadding)]) || 0
  const margin = (sizeMargin && adj(sizeMargin) * 0.25) || 0
  const radius = (sizeRadius && adj(sizeRadius) * 4) || 0

  const pass = {}
  if (sizeHeight) {
    pass.height = height
  }
  if (sizeFont) {
    pass.fontSize = fontSize
  }
  if (sizePadding) {
    pass.padding = padding
  }
  if (sizeMargin) {
    pass.margin = margin
  }
  if (sizeRadius) {
    pass.borderRadius = radius
  }

  return <Surface {...pass} {...rest} />
}
