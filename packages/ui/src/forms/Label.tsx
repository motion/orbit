import { gloss } from '@o/gloss'
import { Text } from '../text/Text'

export const Label = gloss(Text, {
  padding: 5,
})

Label.defaultProps = {
  tagName: 'label',
}
