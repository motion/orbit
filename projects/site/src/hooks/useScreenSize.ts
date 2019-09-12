import { useMediaLayout, UseMediaOptions } from '@o/ui'

import { widths } from '../constants'

type ScreenSize = 'small' | 'medium' | 'large'

export const sizes = {
  tiny: { maxWidth: widths.xs },
  small: { maxWidth: widths.sm },
  medium: { minWidth: widths.md },
  large: { minWidth: widths.lg },
  short: { maxHeight: 900 },
}

export function useIsTiny(): boolean {
  return useMediaLayout(sizes.tiny)
}

export function useScreenSize(
  options?: UseMediaOptions<'small' | 'medium' | 'large'>,
): ScreenSize | undefined {
  const res = useMediaLayout([sizes.small, sizes.medium, sizes.large], options)
  if (!options || !options.onChange) {
    const [isSmall, isMedium, isLarge] = res
    return isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
  }
}

export function useScreenHeight(): 'short' | 'medium' {
  const [isShort, isSmall] = useMediaLayout([sizes.short, sizes.small])
  // only return "short" if its "fat" ie wider than it is tall
  return isShort && !isSmall ? 'short' : 'medium'
}

export const useScreenHeightVal = (short: any, normal: any) => {
  const screen = useScreenHeight()
  return screen === 'short' ? short : normal
}
