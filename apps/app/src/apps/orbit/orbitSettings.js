import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Setting } from '@mcro/models'
import { App, Electron } from '@mcro/all'
import * as Constants from '~/constants'
import r2 from '@mcro/r2'
import { partition } from 'lodash'
import Card from './orbitCard'

const integrations = [
  { id: 'google', name: 'Google Drive', icon: 'gdrive' },
  { id: 'github', name: 'Github', icon: 'github' },
  { id: 'slack', name: 'Slack', icon: 'slack' },
  { id: 'folder', name: 'Folder', icon: 'folder', oauth: false },
]

@view({
  store: class OrbitSettingsStore {
    settings = null
    selected = null
    refs = {}

    setSelected = id => {
      if (!id) return
      const ref = this.refs[id]
      if (!ref) return
      const position = {
        left: Electron.orbitState.position[0],
        top: ref.offsetTop + Electron.orbitState.position[1],
        width: ref.clientWidth,
        height: ref.clientHeight,
      }

      App.setPeekTarget({ id, position, type: 'setting' })
    }

    willMount() {
      this.getSettings()
    }

    getSettings = async () => {
      this.settings = await Setting.find()
    }

    checkAuths = async () => {
      const { error, ...authorizations } = await r2.get(
        `${Constants.API_URL}/getCreds`,
      ).json
      if (error) {
        console.log('no creds')
      }
      return authorizations
    }

    startOauth = id => {
      App.setAuthState({ openId: id })
      const checker = this.setInterval(async () => {
        const auth = await this.checkAuths()
        const oauth = auth && auth[id]
        if (!oauth) return
        clearInterval(checker)
        const setting = await Setting.findOne({ type: id })
        console.log('got oauth', oauth)
        setting.token = oauth.token
        setting.values = {
          ...setting.values,
          oauth,
        }
        setting.save()
        this.getSettings()
        App.setAuthState({ closeId: id })
      }, 1000)
    }
  },
})
export default class OrbitSettings {
  render({ store }) {
    if (!store.settings) {
      return null
    }
    const [activeIntegrations, inactiveIntegrations] = partition(
      integrations,
      integration =>
        store.settings &&
        store.settings.find(x => x.type === integration.id && x.token),
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
              store={store}
              length={allIntegrations.length}
              isActive={store.settings.find(
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
