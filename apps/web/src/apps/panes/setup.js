import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

@view
export default class BarSetupPane {
  render({ data }) {
    const userIntegration = CurrentUser[data.type]

    return (
      <setup>
        <integrate if={!userIntegration}>
          <UI.Title size={2}>Authorize</UI.Title>
          <UI.Button
            icon={data.type}
            onClick={() => CurrentUser.link(data.type)}
          >
            Authorize {data.name}
          </UI.Button>
        </integrate>

        <settings if={userIntegration}>
          <UI.Title size={2}>Settings</UI.Title>
        </settings>
      </setup>
    )
  }

  static style = {
    setup: {
      padding: 20,
    },
  }
}
