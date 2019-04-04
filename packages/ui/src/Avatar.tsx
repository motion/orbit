import { gloss } from '@o/gloss'
import { View } from './View/View'

export const Avatar = gloss(View, {
  borderRadius: 100,
  width: 80,
  height: 80,
})

Avatar.defaultProps = {
  tagName: 'img',
}
