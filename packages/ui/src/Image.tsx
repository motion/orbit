import { view } from '@mcro/black'
import { View } from './blocks/View'

export const Image = view(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}
