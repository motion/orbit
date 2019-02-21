import { gloss } from '@mcro/gloss'
import { Text } from '../text/Text'

export const Label = gloss(Text, {
  padding: 5,
})

Label.defaultProps = {
  tagName: 'label',
}
