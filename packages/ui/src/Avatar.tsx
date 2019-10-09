import { gloss } from 'gloss'

import { Image } from './Image'
import { useScale } from './Scale'

export const Avatar = gloss(Image, {
  size: 64,
  tagName: 'img',
  display: 'inline-flex',
  borderRadius: 100,
  userSelect: 'none',
}).theme(({ size, width, height }) => {
  const scale = useScale()
  return {
    width: scale * width ?? size,
    height: scale * height ?? size,
  }
})
