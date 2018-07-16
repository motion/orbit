import { view } from '@mcro/black'
import { View } from './View'

export const Image = view(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}
