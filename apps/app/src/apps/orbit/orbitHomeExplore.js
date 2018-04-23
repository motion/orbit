import { view } from '@mcro/black'
import SettingCard from './orbitSettingCard'
import { Title } from '~/views'
import * as UI from '@mcro/ui'
import OrbitHomeHighlights from './orbitHomeHighlights'

@view.attach('appStore')
@view
export default class OrbitExplore {
  items = [
    {
      id: 'google',
      type: 'setting',
      title: 'Google',
      icon: 'som',
    },
    {
      id: 'google',
      type: 'setting',
      title: 'Google',
      icon: 'som',
    },
  ]

  render({ appStore }) {
    return (
      <pane>
        <Title>Explore</Title>
        <section $explore>
          {[
            'Fast Projects',
            'Onboarding Docs',
            'Popular this week',
            'People directory',
          ].map((item, index) => (
            <item
              key={index}
              css={{ flexFlow: 'row', alignItems: 'center', padding: [8, 10] }}
            >
              <UI.Arrow
                size={14}
                background="red"
                css={{
                  transform: { scaleX: 0.75 },
                  margin: 2,
                }}
              />{' '}
              Model 3 Parts Supply
            </item>
          ))}
        </section>

        <OrbitHomeHighlights />

        <Title>In your Orbit</Title>
        <cards>
          {this.items.map((item, index) => (
            <SettingCard
              key={index}
              index={index}
              offset={index}
              appStore={appStore}
              length={this.items.length}
              isActive
              {...item}
            />
          ))}
        </cards>
      </pane>
    )
  }

  static style = {
    pane: {
      padding: [20, 0],
    },
    section: {
      padding: [5, 4],
    },
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      userSelect: 'none',
      marginBottom: 20,
    },
  }
}
