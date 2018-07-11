import { view } from '@mcro/black'
import { propStyles } from '../helpers/propStyles'

export const View = view({})

View.theme = ({ fill, scrollable, ...props }) => ({
  height: fill ? '100%' : 'auto',
  overflow: scrollable ? 'auto' : 'visible',
  width: fill ? '100%' : 'auto',
  ...propStyles(props),
})
