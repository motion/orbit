import { gloss } from '@o/gloss'

import { Image } from './Image'

export const Avatar = gloss(Image, {
  display: 'inline-flex',
  borderRadius: 100,
  width: 64,
  height: 64,
  userSelect: 'none',
}).theme(({ size }) => ({
  width: size,
  height: size,
}))
