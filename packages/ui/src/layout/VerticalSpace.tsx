import { gloss } from '@o/gloss'

export const VerticalSpace = gloss<{ small?: boolean }>({
  pointerEvents: 'none',
  height: 16,
  small: {
    height: 8,
  },
})
