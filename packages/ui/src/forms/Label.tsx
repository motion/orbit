import { gloss, SimpleText } from '@o/gloss'

export const Label = gloss(SimpleText, {
  padding: 5,
})

Label.defaultProps = {
  tagName: 'label',
  alpha: 0.5,
  ellipse: true,
}
