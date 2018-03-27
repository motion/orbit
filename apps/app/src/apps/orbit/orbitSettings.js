import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '@mcro/models'
import OrbitIcon from './orbitIcon'
import { App } from '@mcro/all'
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
  render({ id, icon, name, index, length, showAuth, theme }) {
    const isActive = CurrentUser.authorizations[id]
    return (
      <card
        key={index}
        $first={index === 0}
        $odd={index % 2 == 0}
        $lastRow={index > length - 2}
      >
        <OrbitIcon $icon $iconActive={isActive} icon={icon} />
        <subtitle>
          <UI.Text fontWeight={600} fontSize={13} textAlign="center">
            {name}
          </UI.Text>
        </subtitle>
        <UI.Button
          if={!isActive}
          onClick={() => showAuth(id)}
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
      background: [255, 255, 255, 0.05],
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
    const [activeIntegrations, inactiveIntegrations] = partition(
      integrations,
      x => CurrentUser.authorizations[x.id],
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
              showAuth={store.startOauth}
              length={activeIntegrations.length}
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
              showAuth={store.startOauth}
              length={activeIntegrations.length}
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
