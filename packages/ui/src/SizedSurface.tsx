import * as React from 'react'
import { Surface, SurfaceProps } from './Surface'
import { forwardRef } from './helpers/forwardRef'

const LINE_HEIGHT = 28

export type SizedSurfaceProps = SurfaceProps & {
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

const num = x => (x === true ? 1 : x)

const SizedSurfaceInner = forwardRef((props: SizedSurfaceProps) => {
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
    pass.fontSize = fontSize
  }
  if (sizePadding) {
    const padSize = num(sizePadding) * size
    const padding = sizePadding
      ? [sizeHeight ? 0 : padSize * 1.5, 9 * padSize]
      : 0
    pass.padding = padding
  }
  if (sizeMargin) {
    const margin = num(sizeMargin) * 0.25 * size
    pass.margin = margin
  }
  if (sizeRadius) {
    const radius = num(sizeRadius) * 8 * size
    pass.borderRadius = radius
  }
  if (circular) {
    pass.width = height
    pass.borderRadius = size * 1000
    pass.noInnerElement = true
  }
  // clamp radius to max, because we use it for Glint/Hoverglow in Surface and they need actual radius
  if (pass.borderRadius) {
    pass.borderRadius = Math.min(height / 2, pass.borderRadius)
  }
  // icon already tracks height so no need to size it from here
  if (sizeIcon) {
    pass.sizeIcon = num(sizeIcon)
  }
  const iconPad = LINE_HEIGHT * 0.2 * num(sizeHeight)
  return <Surface {...pass} size={size} iconPad={iconPad} {...rest} />
})

export const SizedSurface = SizedSurfaceInner as React.SFC<SizedSurfaceProps>
