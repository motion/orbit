import { view } from '@mcro/black'
import { propsToStyles } from '@mcro/gloss'
import { propsToTextSize } from '../helpers/propsToTextSize'

export const View = view({})

View.theme = ({ scrollable, ...props }) => {
  return {
    ...propsToStyles(props),
    ...propsToTextSize(props),
  }
}
