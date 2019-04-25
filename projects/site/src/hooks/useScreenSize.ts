import { useMedia } from '@o/ui'

import { widths } from '../constants'

type ScreenSize = 'small' | 'medium' | 'large'

export function useScreenSize(): ScreenSize {
  const isSmall = useMedia({ maxWidth: widths.small })
  const isMedium = useMedia({ minWidth: widths.medium })
  const isLarge = useMedia({ minWidth: widths.large })
  return isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
}
