import { Label } from './form/Label'
import { view } from '@mcro/black'

export const SidebarLabel = view(Label, {
  padding: 10,
})

SidebarLabel.defaultProps = {
  fontSize: 12,
}
