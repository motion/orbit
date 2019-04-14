import { useMedia } from '@o/ui'

const widths = {
  small: 680,
  medium: 720,
  large: 1024,
}

type ScreenSize = 'small' | 'medium' | 'large'

export function useScreenSize(): ScreenSize {
  const isSmall = useMedia({ maxWidth: widths.small })
  const isMedium = useMedia({ minWidth: widths.medium })
  const isLarge = useMedia({ minWidth: widths.large })
  return isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
}
