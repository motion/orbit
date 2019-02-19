import { gloss } from '@mcro/gloss'

export const VerticalSpace = gloss<{ small?: boolean }>({
  pointerEvents: 'none',
  height: 16,
  small: {
    height: 8,
  },
})
