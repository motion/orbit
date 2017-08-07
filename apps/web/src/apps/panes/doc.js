import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PaneCard from './views/card'

@view
export default class BarDocPane {
  render({ highlightIndex, activeIndex, paneProps }) {
    return (
      <PaneCard
        id="24"
        title="Product Page Sprint Planning Meeting Aug 25th"
        icon="doc"
      >
        <UI.Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita
          voluptatum, adipisci eaque velit sunt tempore esse.
        </UI.Text>
      </PaneCard>
    )
  }

  static style = {}
}
