import { gloss } from '@mcro/gloss'

export const IconContainer = gloss({
  padding: 10,
  borderRadius: 8,
}).theme((_, theme) => ({
  background: theme.background,
  boxShadow: [
    ['inset', 0, 0, 0, 0.5, theme.borderColor.alpha(0.5)],
    [0, 0, 0, 3, theme.borderColor.alpha(0.25)],
  ],
  '&:hover': {
    background: theme.backgroundHover,
  },
}))
