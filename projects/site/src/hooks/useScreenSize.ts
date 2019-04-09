import { useMedia } from '@o/ui'

const widths = {
  small: 760,
  medium: 800,
  large: 1024,
}

export function useScreenSize(): 'small' | 'medium' | 'large' {
  const isSmall = useMedia({ maxWidth: widths.small })
  const isMedium = useMedia({ minWidth: widths.medium })
  const isLarge = useMedia({ minWidth: widths.large })
  return isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
}
