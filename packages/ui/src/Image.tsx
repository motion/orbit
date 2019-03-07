import { gloss, View } from '@o/gloss'

export const Image = gloss(View, {
  display: 'block',
})

Image.defaultProps = {
  tagName: 'img',
}
