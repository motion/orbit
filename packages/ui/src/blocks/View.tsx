import { view } from '@mcro/black'
import { propsToStyles } from '../helpers/propsToStyles'
import { propsToTextSize } from '../helpers/propsToTextSize'

export const View = view({})

View.theme = ({ fill, scrollable, debug, ...props }) => {
  return {
    height: fill ? '100%' : 'auto',
    overflow: scrollable ? 'auto' : 'visible',
    width: fill ? '100%' : 'auto',
    ...propsToStyles(props),
    ...propsToTextSize(props),
  }
}
