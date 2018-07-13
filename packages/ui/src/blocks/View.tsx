import { view } from '@mcro/black'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export const View = view({})

View.theme = ({ fill, scrollable, ...props }) => {
  return {
    height: fill ? '100%' : undefined,
    width: fill ? '100%' : undefined,
    ...propsToStyles(props),
    ...propsToTextSize(props),
  }
}
