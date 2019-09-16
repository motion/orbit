import { mergeDefined } from '@o/utils'
import React from 'react'

import { LINE_HEIGHT } from './constants'
import { useScale } from './Scale'
import { useSurfaceProps } from './SizedSurfacePropsContext'
import { getSize } from './Sizes'
import { Size } from './Space'
import { Surface, SurfaceProps, SurfaceSpecificProps } from './Surface'

export type SizedSurfaceSpecificProps = SurfaceSpecificProps & {
  /** Controlled height, relative adjusted to size */
  sizeHeight?: boolean | number

  /** Controlled font size, relative adjusted to size */
  sizeFont?: boolean | number

  /** Controlled horizontal padding, relative adjusted to size */
  sizePadding?: boolean | number

  /** Controlled margin, relative adjusted to size */
  sizeMargin?: boolean | number

  /** Controlled border radius size, relative adjusted to size */
  sizeRadius?: boolean | number

  /** Controlled icon size, relative adjusted to size */
  sizeIcon?: boolean | number
}

export type SizedSurfaceProps = SurfaceProps & SizedSurfaceSpecificProps

const num = (x: number | boolean) => (x === true ? 1 : +x)
const clampRound = (x: number) => Math.round(x)

export const getSizedRadius = (size: number, sizeRadius: number | true) => {
  return clampRound(num(sizeRadius) * 6 * size)
}

export const useScaledSize = (size: Size) => {
  return useScale() * getSize(size)
}

export const useSurfaceHeight = (size: Size) => {
  return getHeight(useScaledSize(size), 1)
}

const getHeight = (size: number, sizeHeight: number | boolean) => {
  const height = clampRound(LINE_HEIGHT * num(sizeHeight) * size)
  // ensure even height so things center properly
  return height % 2 === 0 ? height : height + 1
}

export const SizedSurface = (direct: SizedSurfaceProps) => {
  const sizedSurfaceProps = useSizedSurfaceProps(direct)
  return <Surface {...sizedSurfaceProps} />
}

export function useSizedSurfaceProps(direct?: SizedSurfaceProps): SizedSurfaceProps {
  const props = useSurfaceProps(direct)
  const scale = useScale()
  const {
    size: ogSize,
    sizeHeight,
    sizeMargin,
    sizeFont,
    sizePadding,
    sizeRadius,
    sizeIcon,
    circular,
    ...rest
  } = props
  const size = scale * getSize(ogSize)
  // sizes
  let height =
    typeof props.height === 'number'
      ? props.height
      : (typeof sizeHeight !== 'undefined' && getHeight(size, sizeHeight)) || undefined
  let iconPadding = clampRound(LINE_HEIGHT * 0.22 * num(sizeHeight || 1))
  const pass = {
    size,
  } as any
  if (sizeHeight) {
    pass.height = height
  }
  if (sizeFont) {
    const fontSize = LINE_HEIGHT * 0.45 * num(sizeFont) * size
    pass.fontSize = clampRound(fontSize)
  }
  if (sizePadding) {
    const padSize = num(sizePadding) * size
    const topPad = sizeHeight ? 0 : clampRound(padSize * 1.5)
    const sidePad = clampRound(9 * padSize)
    pass.padding = [topPad, sidePad]
    pass.iconPadding = iconPadding * padSize
  }
  if (sizeMargin) {
    const margin = num(sizeMargin) * 0.25 * size
    pass.margin = clampRound(margin)
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
    pass.borderRadius = clampRound(Math.min(height / 2, pass.borderRadius))
  }
  // icon already tracks height so no need to size it from here
  if (sizeIcon) {
    pass.sizeIcon = num(sizeIcon)
  }
  return mergeDefined(pass, rest)
}
