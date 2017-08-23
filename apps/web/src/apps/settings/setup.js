import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

@view
export default class BarSetupPane {
  render({ item }) {
    const userIntegration = CurrentUser[item.data.type]

    return (
      <setup>
        <integrate if={!userIntegration}>
          <UI.Title size={2}>Authorize</UI.Title>
          <UI.Button
            icon={item.icon}
            onClick={() => CurrentUser.link(item.data.type)}
          >
            Authorize {item.data.name}
          </UI.Button>
        </integrate>
        <settings if={userIntegration}>
          <UI.Title size={2}>Settings</UI.Title>
        </settings>
        hello world
      </setup>
    )
  }

  static style = {
    setup: {
      padding: 20,
    },
  }
}
