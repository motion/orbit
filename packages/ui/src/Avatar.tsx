import { gloss, View } from '@o/gloss'

export const Avatar = gloss(View, {
  borderRadius: 100,
  width: 80,
  height: 80,
})

Avatar.defaultProps = {
  tagName: 'img',
}
