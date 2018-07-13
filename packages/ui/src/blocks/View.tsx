import { view } from '@mcro/black'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export const View = view({})

View.theme = ({ scrollable, ...props }) => {
  return {
    ...propsToStyles(props),
    ...propsToTextSize(props),
  }
}
