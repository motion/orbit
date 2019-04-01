import { mergeDefined } from '@o/utils'
import React from 'react'
import { Surface, SurfaceProps, useSurfaceProps } from './Surface'

const LINE_HEIGHT = 28

export type SizedSurfaceProps = SurfaceProps & {
  flex?: any
  sizeHeight?: boolean | number
  sizeFont?: boolean | number
  sizePadding?: boolean | number
  sizeMargin?: boolean | number
  sizeRadius?: boolean | number
  sizeIcon?: boolean | number
}

const num = (x: number | boolean) => (x === true ? 1 : +x)

export const getSizedRadius = (size: number, sizeRadius: number | true) =>
  Math.round(num(sizeRadius) * 8 * size)

// always return even so things are always centered
const getHeight = (size: number, sizeHeight: number | boolean) => {
  const height = Math.round(LINE_HEIGHT * num(sizeHeight) * size)
  return height % 2 === 1 ? height : height + 1
}

export function SizedSurface(direct: SizedSurfaceProps) {
  const props = useSurfaceProps(direct)
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
  // sizes
  let height =
    typeof props.height === 'number'
      ? props.height
      : (typeof sizeHeight !== 'undefined' && getHeight(size, sizeHeight)) || undefined
  let iconPad = Math.round(LINE_HEIGHT * 0.3 * num(sizeHeight || 1))
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
    iconPad = iconPad * padSize
  }
  if (sizeMargin) {
    const margin = num(sizeMargin) * 0.25 * size
    pass.margin = Math.round(margin)
  }
  if (sizeRadius) {
    pass.borderRadius = getSizedRadius(size, sizeRadius)
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
  const realProps = mergeDefined(pass, rest)
  return <Surface iconPad={iconPad} {...realProps} size={size} />
}
