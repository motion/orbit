import { gloss, InlineFlex } from '@o/gloss'

export const LinkText = gloss(InlineFlex, {
  userSelect: 'none',
  textAlign: 'center',
  transform: {
    y: 0.5,
  },
  '& a': {
    textDecoration: 'none',
  },
})