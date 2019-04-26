import { useMedia } from '@o/ui'

import { widths } from '../constants'

type ScreenSize = 'small' | 'medium' | 'large'

const sizes = {
  small: { maxWidth: widths.small },
  medium: { minWidth: widths.medium },
  large: { minWidth: widths.large },
  short: { maxHeight: 800 },
}

export function useScreenSize(): ScreenSize {
  const isSmall = useMedia(sizes.small)
  const isMedium = useMedia(sizes.medium)
  const isLarge = useMedia(sizes.large)
  return isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
}

export function useScreenHeight(): 'short' | 'medium' {
  const isShort = useMedia(sizes.short)
  const isSmall = useMedia(sizes.small)
  // only return "short" if its "fat" ie wider than it is tall
  return isShort && !isSmall ? 'short' : 'medium'
}

export const useScreenHeightVal = (short: any, normal: any) => {
  const screen = useScreenHeight()
  return screen === 'short' ? short : normal
}
