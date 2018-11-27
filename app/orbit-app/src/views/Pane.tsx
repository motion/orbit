import { view } from '@mcro/black'

export const Pane = view({
  height: 0,
  opacity: 0,
  pointerEvents: 'none',
  isShown: {
    height: 'auto',
    opacity: 1,
    pointerEvents: 'inherit',
  },
})
