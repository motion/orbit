import { gloss } from '@o/gloss'
import { View } from './View/View'

export const Image = gloss(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}
