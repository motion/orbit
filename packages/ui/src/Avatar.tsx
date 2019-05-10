import { gloss } from 'gloss'
import { selectDefined } from '@o/utils'

import { Image } from './Image'

export const Avatar = gloss(Image, {
  display: 'inline-flex',
  borderRadius: 100,
  userSelect: 'none',
}).theme(({ size, width, height }) => ({
  width: selectDefined(width, size),
  height: selectDefined(height, size),
}))

Avatar.defaultProps = {
  size: 64,
  tagName: 'img',
}
