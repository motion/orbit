import { useMedia } from '@o/ui'

const widths = {
  small: 760,
  medium: 800,
  large: 1024,
}

export function useMediaScreenMax(screen: 'small' | 'medium' | 'large') {
  return useMedia({ maxWidth: widths[screen] })
}
