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
      title: 'People',
      icon: 'user',
    },
    {
      id: 'google',
      title: 'Projects',
      icon: 'business',
    },
  ]

  render({ appStore }) {
    return (
      <pane>
        <Title size={1.7}>
          Sunday, Apr 22<span css={{ verticalAlign: 'super', fontSize: 12 }}>
            nd
          </span>
        </Title>
        <section $explore>
          {[
            'Model 3 Transmission',
            'Recall Potential',
            'Lithium Contract',
            'Elon Letter',
          ].map((item, index) => {
            const isDown = index % 2 === 0
            return (
              <item
                key={index}
                css={{
                  flexFlow: 'row',
                  alignItems: 'center',
                  padding: [8, 10],
                  fontSize: 16,
                }}
              >
                <UI.Arrow
                  size={14}
                  towards={isDown ? 'bottom' : 'top'}
                  background={isDown ? 'red' : 'green'}
                  css={{
                    transform: { scaleX: 0.75 },
                    marginTop: isDown ? 4 : -10,
                    marginRight: 8,
                  }}
                />{' '}
                {item}
              </item>
            )
          })}
        </section>

        <verticalSpace />

        <Title>You may have missed</Title>
        <OrbitHomeHighlights />

        <verticalSpace $$flex />

        <Title>Explore</Title>
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
      padding: [0, 0],
      flex: 1,
    },
    section: {
      padding: [5, 0],
    },
    cards: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      userSelect: 'none',
      marginBottom: 20,
    },
    verticalSpace: {
      height: 20,
    },
  }
}
