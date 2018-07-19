import * as React from 'react'
import { Surface, SurfaceProps } from './Surface'
import { forwardRef } from './helpers/forwardRef'

const LINE_HEIGHT = 30

export type SizedSurfaceProps = SurfaceProps & {
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

const SizedSurfaceInner = forwardRef((props: SizedSurfaceProps) => {
  const {
    sizeHeight,
    sizeMargin,
    sizeFont,
    sizePadding,
    sizeRadius,
    sizeIcon,
    ...rest
  } = props
  const size =
    !!props.size && typeof props.size === 'boolean' ? 1 : props.size || 1
  const num = x => (x === true ? 1 : 1 * size)
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
    const padWithWrap = props.wrapElement ? 0 : padSize * 4
    const padding =
      (sizePadding && [
        sizeHeight ? 0 : padSize * 1.7,
        padWithWrap * padSize,
      ]) ||
      0
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
  // icon already tracks height so no need to size it from here
  if (sizeIcon) {
    pass.sizeIcon = num(sizeIcon)
  }
  const iconPad = LINE_HEIGHT * 0.2 * num(sizeHeight)
  return <Surface {...pass} iconPad={iconPad} {...rest} />
})

export const SizedSurface = SizedSurfaceInner as React.SFC<SizedSurfaceProps>
