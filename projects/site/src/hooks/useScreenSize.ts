import { useMedia } from '@o/ui'

import { widths } from '../constants'

type ScreenSize = 'small' | 'medium' | 'large'

export const sizes = {
  tiny: { maxWidth: widths.tiny },
  small: { maxWidth: widths.small },
  medium: { minWidth: widths.medium },
  large: { minWidth: widths.large },
  short: { maxHeight: 900 },
}

export function useIsTiny(): boolean {
  return useMedia(sizes.tiny)
}

export function useScreenSize(): ScreenSize {
  const [isSmall, isMedium, isLarge] = useMedia([sizes.small, sizes.medium, sizes.large])
  return isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
}

export function useScreenHeight(): 'short' | 'medium' {
  const [isShort, isSmall] = useMedia([sizes.short, sizes.small])
  // only return "short" if its "fat" ie wider than it is tall
  return isShort && !isSmall ? 'short' : 'medium'
}

export const useScreenHeightVal = (short: any, normal: any) => {
  const screen = useScreenHeight()
  return screen === 'short' ? short : normal
}
