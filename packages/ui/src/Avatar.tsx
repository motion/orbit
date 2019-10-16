import { gloss } from 'gloss'

import { Image } from './Image'

export const Avatar = gloss(Image, {
  size: 64,
  display: 'inline-flex',
  borderRadius: 100,
  userSelect: 'none',
}).theme(({ size, width, height }) => {
  return {
    width: `calc(${(width ?? size)} * var(--scale))`,
    height: `calc(${(height ?? size)} * var(--scale))`,
  }
})
