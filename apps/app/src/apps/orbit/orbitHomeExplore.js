import { view, react } from '@mcro/black'
import { Title, SubTitle } from '~/views'
import * as UI from '@mcro/ui'
import OrbitHomeHighlights from './orbitHomeHighlights'
import { App } from '@mcro/all'
import OrbitDivider from './orbitDivider'

class OrbitExploreStore {
  willUnmount() {
    this.props.appStore.setGetResults(null)
  }

  @react({ fireImmediately: true })
  setExploreResults = [
    () => !!App.state.query,
    hasQuery => {
      const { appStore } = this.props
      if (hasQuery) {
        appStore.setGetResults(null)
      } else {
        appStore.setGetResults(() => appStore.summaryResults)
      }
    },
  ]
}

@view.provide({
  store: OrbitExploreStore,
})
@UI.injectTheme
@view
export default class OrbitExplore {
  render({ appStore, theme }) {
    return (
      <pane css={{ background: theme.base.background }}>
        <UI.Button
          icon="home"
          size={1.1}
          circular
          borderWidth={1}
          borderColor={[0, 0, 0, 0.1]}
          background={theme.base.background}
          iconProps={{
            color: theme.base.color.darken(0.2),
            size: 14,
          }}
          css={{
            position: 'absolute',
            top: -20,
            right: 12,
            zIndex: 100000,
          }}
        />
        <Title size={1.7}>
          Sunday, Apr 22<span css={{ verticalAlign: 'super', fontSize: 12 }}>
            nd
          </span>
        </Title>
        {/* <SubTitle>In your orbit</SubTitle> */}
        <section $explore>
          {[
            {
              title: 'Model 3 Transmission',
              subtitle: '4 people in 7 conversations',
            },
            {
              title: 'Recall Potential',
              subtitle: '2 conversations and 4 tickets',
            },
            { title: 'Lithium Contract', subtitle: '1 ticket' },
            // { title: 'Elon Letter', subtitle: '6 conversations' },
          ].map((item, index) => {
            const isDown = index % 2 === 0
            return (
              <item
                key={index}
                css={{
                  flexFlow: 'row',
                  alignItems: 'center',
                  padding: [8, 15],
                  fontSize: 16,
                }}
              >
                <content>
                  {item.title}
                  <subtitle css={{ opacity: 0.5, fontSize: 13 }}>
                    {item.subtitle}
                  </subtitle>
                </content>
                <div $$flex />
                <UI.Arrow
                  size={14}
                  towards={isDown ? 'bottom' : 'top'}
                  background={isDown ? 'red' : 'green'}
                  css={{
                    transform: { scaleX: 0.75 },
                    marginTop: isDown ? 4 : -10,
                    marginRight: 8,
                  }}
                />
              </item>
            )
          })}
        </section>

        <OrbitDivider />

        <SubTitle>Highlights</SubTitle>
        <OrbitHomeHighlights results={appStore.summaryResults} />
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
