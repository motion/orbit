import { gloss } from '@mcro/gloss'

export const BottomControls = gloss({
  flexFlow: 'row',
  position: 'absolute',
  bottom: 16,
  right: 16,
  left: 16,
  alignItems: 'center',
  disabled: {
    pointerEvents: 'none',
    filter: 'grayscale(100%)',
    opacity: 0.8,
  },
  invisible: {
    pointerEvents: 'none',
    opacity: 0,
  },
})
