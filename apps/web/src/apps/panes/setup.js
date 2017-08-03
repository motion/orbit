import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class BarSetupPane {
  render({ ...props }) {
    console.log('pane props', props)
    return (
      <setup>
        <UI.Title size={2}>Setup</UI.Title>
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
