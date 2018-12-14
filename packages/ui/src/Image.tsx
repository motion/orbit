import { View } from './blocks/View'
import { gloss } from '@mcro/gloss'

export const Image = gloss(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}
