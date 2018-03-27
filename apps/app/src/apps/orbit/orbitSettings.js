import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '@mcro/models'
import OrbitIcon from './orbitIcon'
import { App } from '@mcro/all'
import * as Constants from '~/constants'
import r2 from '@mcro/r2'

const integrations = [
  { id: 'google', name: 'Google Drive', icon: 'gdrive' },
  { id: 'github', name: 'Github', icon: 'githubWhite' },
  { id: 'slack', name: 'Slack', icon: 'slack' },
]

@view({
  store: class OrbitSettingsStore {
    checkAuths = async () => {
      const { error, ...authorizations } = await r2.get(
        `${Constants.API_URL}/getCreds`,
      ).json
      if (error) {
        console.log('no creds')
      } else {
        return authorizations
      }
    }

    startOauth = id => {
      App.setAuthState({ openId: id })
      const checker = this.setInterval(async () => {
        const authorizations = await this.checkAuths()
        if (authorizations && authorizations[id]) {
          await CurrentUser.setAuthorizations(authorizations)
          App.setAuthState({ closeId: id })
          clearInterval(checker)
        }
      }, 1000)
    }
  },
})
export default class OrbitSettings {
  render({ store }) {
    return (
      <pane css={{ padding: [0, 10] }}>
        <UI.Title fontWeight={200} fontSize={16} marginBottom={10}>
          Integrations
        </UI.Title>
        <cards>
          {integrations.map(({ id, name, icon }, index) => {
            const isActive = CurrentUser.authorizations[id]
            return (
              <card key={index}>
                <OrbitIcon $icon $iconActive={isActive} icon={icon} />
                <subtitle>
                  <UI.Text fontWeight={600} fontSize={13} textAlign="center">
                    {name}
                  </UI.Text>
                </subtitle>
                <UI.Button
                  if={!isActive}
                  onClick={() => store.startOauth(id)}
                  size={1}
                  icon="uiadd"
                  theme="green"
                  css={{
                    marginTop: 10,
                  }}
                >
                  Add
                </UI.Button>
              </card>
            )
          })}
        </cards>
      </pane>
    )
  }

  static style = {
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      userSelect: 'none',
    },
    card: {
      width: 'calc(50% - 10px)',
      padding: [15, 5],
      margin: [0, 5, 10],
      background: [255, 255, 255, 0.05],
      alignItems: 'center',
      '&:hover': {
        background: [255, 255, 255, 0.1],
      },
      '&:active': {
        background: [255, 255, 255, 0.15],
      },
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
