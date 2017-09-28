import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'
import * as Panes from './panes'

@view.ui
export default class BarSetupPane {
  render({ item }) {
    if (!CurrentUser.authorizations) {
      return <null>No auths</null>
    }

    const integration = CurrentUser.authorizations[item.data.type]
    const SettingPane = Panes[item.data.type]

    return (
      <setup>
        <integrate>
          <UI.Title size={2} marginBottom={20}>
            Authorize {item.data.name}
          </UI.Title>
          <UI.Button
            size={2}
            icon={item.icon}
            onClick={() => CurrentUser.link(item.data.type)}
          >
            Authorize {item.data.name}
          </UI.Button>
        </integrate>
        <settings if={SettingPane}>
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
