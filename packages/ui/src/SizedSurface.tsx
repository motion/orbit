import * as React from 'react'
import { Surface, SurfaceProps } from './Surface'

const LINE_HEIGHT = 28

export type SizedSurfaceProps = SurfaceProps & {
  flex?: any
  circular?: boolean
  sizeHeight?: boolean | number
  sizeFont?: boolean | number
  sizePadding?: boolean | number
  sizeMargin?: boolean | number
  sizeRadius?: boolean | number
  sizeIcon?: boolean | number
  height?: number
  inline?: boolean
}

const num = (x: number | boolean) => (x === true ? 1 : +x)

export function SizedSurface(props: SizedSurfaceProps) {
  const {
    size = 1,
    sizeHeight,
    sizeMargin,
    sizeFont,
    sizePadding,
    sizeRadius,
    sizeIcon,
    circular,
    ...rest
  } = props
  let iconPad = Math.round(LINE_HEIGHT * 0.2 * num(sizeHeight))
  // sizes
  let height =
    typeof sizeHeight !== 'undefined'
      ? Math.round(LINE_HEIGHT * num(sizeHeight) * size)
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
    const fontSize = LINE_HEIGHT * 0.45 * num(sizeFont) * size
    pass.fontSize = Math.round(fontSize)
  }
  if (sizePadding) {
    const padSize = num(sizePadding) * size
    const topPad = sizeHeight ? 0 : Math.round(padSize * 1.5)
    const sidePad = Math.round(9 * padSize)
    pass.padding = [topPad, sidePad]
    iconPad = sidePad * 0.45
  }
  if (sizeMargin) {
    const margin = num(sizeMargin) * 0.25 * size
    pass.margin = Math.round(margin)
  }
  if (sizeRadius) {
    const radius = num(sizeRadius) * 8 * size
    pass.borderRadius = Math.round(radius)
  }
  if (circular) {
    pass.width = height
    pass.borderRadius = size * 1000
  }
  // clamp radius to max, because we use it for Glint/Hoverglow in Surface and they need actual radius
  if (pass.borderRadius && typeof height === 'number') {
    pass.borderRadius = Math.round(Math.min(height / 2, pass.borderRadius))
  }
  // icon already tracks height so no need to size it from here
  if (sizeIcon) {
    pass.sizeIcon = num(sizeIcon)
  }
  return <Surface {...pass} size={size} iconPad={iconPad} {...rest} />
}
