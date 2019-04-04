import { gloss } from '@o/gloss'
import { View } from '@o/ui'

export const Image = gloss(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}
