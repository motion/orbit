import { gloss, View } from '@mcro/gloss'

export const Avatar = gloss(View, {
  borderRadius: 100,
  width: 70,
  height: 70,
  transform: {
    scale: 1,
    rotate: '40deg',
  },
})

Avatar.defaultProps = {
  tagName: 'img',
}
