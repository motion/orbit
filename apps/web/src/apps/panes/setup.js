import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class BarSetupPane {
  render({ activeItem }) {
    return (
      <setup>
        <UI.Title size={2}>
          {activeItem.title}
        </UI.Title>
        <UI.Form>
          <UI.Input size={2} placeholder="Username" />
          <UI.Input size={2} placeholder="Password" />
          <UI.Button size={2} type="submit">
            Setup
          </UI.Button>
        </UI.Form>
      </setup>
    )
  }

  static style = {
    setup: {
      padding: 20,
    },
  }
}
