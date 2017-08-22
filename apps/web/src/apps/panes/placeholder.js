import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneCard from './views/card'

@view
export default class Placeholder {
  getLength = () => 0
  getChildSchema = row => null

  render({}) {
    return (
      <PaneCard $paneCard id={''} title={'not implemented yet'} icon={''}>
        <container />
      </PaneCard>
    )
  }

  static style = {}
}
