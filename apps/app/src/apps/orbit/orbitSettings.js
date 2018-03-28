import { view, react } from '@mcro/black'
import * as UI from '@mcro/ui'
import { Setting } from '@mcro/models'
import OrbitIcon from './orbitIcon'
import { App, Electron } from '@mcro/all'
import * as Constants from '~/constants'
import r2 from '@mcro/r2'
import { partition } from 'lodash'

const integrations = [
  { id: 'google', name: 'Google Drive', icon: 'gdrive' },
  { id: 'github', name: 'Github', icon: 'github' },
  { id: 'slack', name: 'Slack', icon: 'slack' },
]

@UI.injectTheme
@view
class Card {
  render({ id, icon, name, index, length, theme, isActive, store }) {
    const { startOauth } = store
    const isSelected = store.selected === id
    const isOdd = index % 2 == 0
    return (
      <card
        key={index}
        $first={index === 0}
        $odd={isOdd}
        $lastRow={index >= length - 2}
        css={{
          background: isSelected ? [255, 255, 255, 0.5] : [255, 255, 255, 0.05],
          borderLeftRadius: isOdd ? 4 : 0,
          borderRightRadius: !isOdd ? 4 : 0,
        }}
        onClick={() => {
          if (!isActive) {
            return
          }
          store.setSelected(id)
        }}
        ref={ref => {
          if (!ref) return
          store.refs[id] = ref
        }}
      >
        <OrbitIcon $icon $iconActive={isActive} icon={icon} />
        <subtitle>
          <UI.Text fontWeight={600} fontSize={13} textAlign="center">
            {name}
          </UI.Text>
        </subtitle>
        <UI.Button
          if={!isActive}
          onClick={() => startOauth(id)}
          size={0.9}
          icon="uiadd"
          background="transparent"
          borderColor={theme.base.background.darken(0.05)}
          circular
          css={{
            position: 'absolute',
            top: 5,
            right: 5,
          }}
        />
      </card>
    )
  }

  static style = {
    card: {
      position: 'relative',
      width: '50%',
      padding: [15, 5],
      // margin: [0, 5, 0],
      alignItems: 'center',
      borderBottom: [4, [0, 0, 0, 0.1]],
      '&:hover': {
        background: [255, 255, 255, 0.1],
      },
      '&:active': {
        background: [255, 255, 255, 0.15],
      },
    },
    odd: {
      borderRight: [4, [0, 0, 0, 0.1]],
      paddingRight: 7,
    },
    lastRow: {
      borderBottom: 'none',
    },
    subtitle: {
      flex: 1,
      justifyContent: 'center',
    },
    icon: {
      marginBottom: 10,
      width: 40,
      height: 40,
      filter: 'grayscale(100%)',
      opacity: 0.5,
    },
    iconActive: {
      filter: 'none',
      opacity: 1,
    },
  }
}

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
    const [activeIntegrations, inactiveIntegrations] = partition(
      integrations,
      integration =>
        store.settings &&
        store.settings.find(x => x.type === integration.id && x.token),
    )
    return (
      <pane css={{ padding: [0, 10] }}>
        <UI.Title fontWeight={200} fontSize={16} marginBottom={10}>
          Integrations
        </UI.Title>
        <cards>
          {activeIntegrations.map((integration, index) => (
            <Card
              key={index}
              index={index}
              store={store}
              length={activeIntegrations.length}
              isActive
              {...integration}
            />
          ))}
        </cards>

        <UI.Title fontWeight={200} fontSize={16} marginBottom={10}>
          Inactive
        </UI.Title>
        <cards>
          {inactiveIntegrations.map((integration, index) => (
            <Card
              key={index}
              index={index}
              store={store}
              length={inactiveIntegrations.length}
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
