import { gloss, View } from '@mcro/gloss'

export const Image = gloss(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}
