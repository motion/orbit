import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Electron } from '@mcro/all'
import { partition } from 'lodash'
import Card from './orbitCard'

const integrations = [
  { id: 'google', name: 'Google Drive', icon: 'gdrive' },
  { id: 'github', name: 'Github', icon: 'github' },
  { id: 'slack', name: 'Slack', icon: 'slack' },
  { id: 'folder', name: 'Folder', icon: 'folder', oauth: false },
]

class SettingsStore {
  refs = {}

  showPeek(index) {
    const ref = this.refs[index]
    if (!ref) return
    const position = {
      left: Electron.orbitState.position[0],
      top: ref.offsetTop + Electron.orbitState.position[1],
      width: ref.clientWidth,
      height: ref.clientHeight,
    }
    App.setPeekTarget({
      id: this.props.appStore.results[index],
      position,
      type: 'setting',
    })
  }
}

@view.attach('appStore')
@view({
  store: SettingsStore,
})
export default class OrbitSettings {
  render({ store, appStore }) {
    if (!appStore.settings) {
      return null
    }
    const [activeIntegrations, inactiveIntegrations] = partition(
      integrations,
      integration =>
        appStore.settings &&
        appStore.settings.find(x => x.type === integration.id && x.token),
    )
    const allIntegrations = [...activeIntegrations, ...inactiveIntegrations]
    return (
      <pane css={{ padding: [0, 10] }}>
        <UI.Title fontWeight={200} fontSize={16} marginBottom={10}>
          Integrations
        </UI.Title>
        <cards>
          {allIntegrations.map((integration, index) => (
            <Card
              key={index}
              index={index}
              appStore={appStore}
              store={store}
              length={allIntegrations.length}
              isActive={appStore.settings.find(
                x => x.type === integration.id && x.token,
              )}
              {...integration}
            />
          ))}
        </cards>
      </pane>
    )
  }

  static style = {
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      userSelect: 'none',
      marginBottom: 20,
    },
  }
}
