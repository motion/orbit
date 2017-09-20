import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import * as Panes from './panes'

@view
export default class BarSetupPane {
  render({ item }) {
    const integration = CurrentUser[item.data.type]
    const SettingPane = integration && Panes[item.data.type]

    return (
      <setup>
        <integrate if={!integration}>
          <UI.Title size={2}>Authorize</UI.Title>
          <UI.Button
            icon={item.icon}
            onClick={() => CurrentUser.link(item.data.type)}
          >
            Authorize {item.data.name}
          </UI.Button>
        </integrate>
        <settings if={integration && SettingPane}>
          <UI.Title size={1.5}>{item.data.name} Settings</UI.Title>
          <SettingPane integration={integration} />
        </settings>
      </setup>
    )
  }

  static style = {
    setup: {
      padding: 20,
      flex: 1,
    },
    settings: {
      flex: 1,
    },
  }
}
