import { selectDefined } from '@o/utils'
import { gloss } from 'gloss'

import { Image } from './Image'
import { useScale } from './Scale'

export const Avatar = gloss(Image, {
  display: 'inline-flex',
  borderRadius: 100,
  userSelect: 'none',
}).theme(({ size, width, height }) => {
  const scale = useScale()
  return {
    width: scale * selectDefined(width, size),
    height: scale * selectDefined(height, size),
  }
})

Avatar.defaultProps = {
  size: 64,
  tagName: 'img',
}
