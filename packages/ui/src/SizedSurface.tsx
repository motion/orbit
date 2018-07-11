import * as React from 'react'
import { Surface } from './Surface'

const LINE_HEIGHT = 30

type SizedSurfaceProps = {
  size: boolean | number
  sizeHeight?: boolean | number
  sizeFont?: boolean | number
  sizePadding?: boolean | number
  sizeMargin?: boolean | number
  sizeRadius?: boolean | number
  sizeIcon?: boolean | number
  height?: number
  inline?: boolean
  wrapElement?: boolean
}

export function SizedSurface(props: SizedSurfaceProps) {
  const {
    sizeHeight,
    sizeMargin,
    sizeFont,
    sizePadding,
    sizeRadius,
    sizeIcon,
    ...rest
  } = props
  const size = props.size === true ? 1 : props.size || 1
  const num = x => (x === true ? size : x * size)
  const base = size * LINE_HEIGHT
  // sizes
  let height =
    typeof sizeHeight !== 'undefined'
      ? Math.round(base * num(sizeHeight))
      : props.height || undefined
  // adjust for border x 2 (just looks good)
  if (props.inline) {
    height = height - 4
  }
  const pass = {} as any
  if (sizeHeight) {
    pass.height = height
  }
  if (sizeFont) {
    const fontSize = sizeFont && base * 0.45 * num(sizeFont)
    pass.fontSize = fontSize
  }
  if (sizePadding) {
    const padSize = num(sizePadding) * size
    const padWithWrap = props.wrapElement ? 0 : padSize * 4
    const padding =
      (sizePadding && [sizeHeight ? 0 : padSize * 2, padWithWrap * padSize]) ||
      0
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
  if (sizeIcon) {
    const iconSize = (sizeIcon && num(sizeIcon)) || 1
    pass.sizeIcon = iconSize
  }
  const iconPad = 8 * num(sizeHeight)
  return <Surface {...pass} iconPad={iconPad} {...rest} />
}
