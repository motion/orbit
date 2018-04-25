import { view } from '@mcro/black'
import SettingCard from './orbitSettingCard'
import { Title } from '~/views'
import * as UI from '@mcro/ui'
import OrbitHomeHighlights from './orbitHomeHighlights'

@view.attach('appStore')
@UI.injectTheme
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

  render({ appStore, theme }) {
    return (
      <pane>
        <UI.Button
          icon="home"
          size={1.1}
          circular
          borderWidth={1}
          borderColor={[0, 0, 0, 0.1]}
          iconProps={{
            color: theme.base.color.darken(0.2),
            size: 14,
          }}
          css={{
            position: 'absolute',
            top: -20,
            right: 12,
          }}
        />
        <Title size={1.7}>
          Sunday, Apr 22<span css={{ verticalAlign: 'super', fontSize: 12 }}>
            nd
          </span>
        </Title>
        <section $explore>
          {[
            { title: 'Model 3 Transmission', subtitle: '12 conversations' },
            {
              title: 'Recall Potential',
              subtitle: '2 conversations and 4 tickets',
            },
            { title: 'Lithium Contract', subtitle: '1 ticket' },
            { title: 'Elon Letter', subtitle: '6 conversations' },
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
                <content>
                  {item.title}
                  <subtitle css={{ opacity: 0.5, fontSize: 13 }}>
                    {item.subtitle}
                  </subtitle>
                </content>
              </item>
            )
          })}
        </section>

        <verticalSpace />

        <Title>You may have missed</Title>
        <OrbitHomeHighlights />
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
