import { view } from '@mcro/black'
import { partition } from 'lodash'
import { OrbitSettingCard } from './orbitSettingCard'
import { OrbitDockedPane } from './orbitDockedPane'
import * as UI from '@mcro/ui'

const Title = props => (
  <UI.Title size={1.2} fontWeight={600} margin={[10, 20]} {...props} />
)

@UI.injectTheme
@view.attach('appStore')
@view
export class OrbitSettings {
  isActive = integration =>
    this.props.appStore.settings[integration.id] &&
    this.props.appStore.settings[integration.id].token

  rawResults = [
    {
      id: 'google',
      type: 'setting',
      integration: 'google',
      title: 'Google',
      icon: 'google',
    },
    {
      id: 'github',
      type: 'setting',
      integration: 'github',
      title: 'Github',
      icon: 'github',
    },
    {
      id: 'slack',
      type: 'setting',
      integration: 'slack',
      title: 'Slack',
      icon: 'slack',
    },
    {
      id: 'folder',
      type: 'setting',
      integration: 'folder',
      title: 'Folder',
      icon: 'folder',
      oauth: false,
    },
  ]

  get splitActiveResults() {
    const [activeIntegrations, inactiveIntegrations] = partition(
      this.rawResults,
      this.isActive,
    )
    return { activeIntegrations, inactiveIntegrations }
  }

  getResults = () => {
    const { activeIntegrations, inactiveIntegrations } = this.splitActiveResults
    return [...activeIntegrations, ...inactiveIntegrations]
  }

  // this.props.appStore.setGetResults(this.getResults)
  // const updateInt = setInterval(() => {
  //   if (this.mounted) {
  //     this.props.appStore.setGetResults(this.getResults)
  //   } else {
  //     clearInterval(updateInt)
  //   }
  // }, 1000)

  componentWillUnmount() {
    this.mounted = false
    // this.props.appStore.setGetResults(null)
  }

  render({ appStore, theme }) {
    if (!appStore.settings) {
      return null
    }
    const { activeIntegrations, inactiveIntegrations } = this.splitActiveResults
    const integrationCard = all => (setting, index, offset) => (
      <OrbitSettingCard
        key={index}
        index={index}
        offset={offset}
        appStore={appStore}
        length={all.length}
        isActive={this.isActive(setting)}
        setting={setting}
      />
    )
    return (
      <OrbitDockedPane name="settings">
        <section if={activeIntegrations.length}>
          <Title>Active</Title>
          <cards>
            {activeIntegrations.map((item, index) =>
              integrationCard(activeIntegrations)(item, index, index),
            )}
          </cards>
        </section>
        <section if={inactiveIntegrations.length}>
          <Title>Inactive</Title>
          <cards>
            {inactiveIntegrations.map((item, index) =>
              integrationCard(inactiveIntegrations)(
                item,
                index + activeIntegrations.length,
                index,
              ),
            )}
          </cards>
        </section>
      </OrbitDockedPane>
    )
  }

  static style = {
    pane: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: [10, 0],
    },
    cards: {
      userSelect: 'none',
      marginBottom: 10,
    },
  }
}
