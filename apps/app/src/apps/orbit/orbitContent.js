import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import OrbitItem from './orbitItem'
import OrbitDivider from './orbitDivider'
import Overdrive from 'react-overdrive'
import DotDotDot from 'react-dotdotdot'

const Text = props => (
  <UI.Text size={1.1} css={{ marginBottom: 10 }} {...props} />
)

@UI.injectTheme
@view
class OrbitContext {
  render({ appStore, theme, getHoverProps }) {
    return (
      <orbitContext>
        {appStore.results.slice(5).map((result, i) => {
          const index = i + 5
          const isSelected =
            appStore.selectedIndex === index && !!App.state.peekTarget
          let cardWrapStyle = {
            height: 200,
          }
          if (isSelected) {
            cardWrapStyle = {
              ...cardWrapStyle,
              height: 400,
              zIndex: 1000,
            }
          }
          return (
            <Overdrive key={result.id} id={`${result.id}`}>
              <cardWrap
                css={{ ...cardWrapStyle }}
                {...getHoverProps({ result, id: index })}
              >
                <card
                  css={{
                    background: isSelected
                      ? theme.highlight.color
                      : 'transparent',
                  }}
                >
                  <Text
                    size={1.35}
                    ellipse={2}
                    fontWeight={200}
                    css={{ marginBottom: 8 }}
                  >
                    {result.title}
                  </Text>
                  <content css={{ flex: 1, opacity: 0.8, overflow: 'hidden' }}>
                    <Text ellipse css={{ maxHeight: '100%' }}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ratione modi optio at neque ducimus ab aperiam dolores
                      nemo? Quod quos nisi molestias velit reprehenderit veniam
                      dicta, voluptatum vel voluptas a?
                    </Text>
                  </content>
                  <Text opacity={0.5} size={0.9} css={{ marginBottom: 3 }}>
                    via{' '}
                    <UI.Icon
                      name="mail"
                      size={10}
                      css={{ display: 'inline-block' }}
                    />
                    &nbsp;
                    <UI.Date>{result.bitUpdatedAt}</UI.Date>
                  </Text>
                </card>
              </cardWrap>
            </Overdrive>
          )
        })}
      </orbitContext>
    )
  }
  static style = {
    orbitContext: {
      marginTop: -15,
      flex: 1,
    },
    cardWrap: {
      padding: [10, 8, 0],
      position: 'relative',
    },
    card: {
      flex: 1,
      borderRadius: 8,
      padding: 12,
      overflow: 'hidden',
    },
  }
}

const getKey = result => result.index || result.id || result.title

@view
class OrbitStatus {
  render() {
    const { indexStatus, performance } = Desktop.searchState
    const { appState } = Desktop
    return (
      <UI.Text
        if={App.isAttachedToWindow && appState && (indexStatus || performance)}
        css={{ padding: 10 }}
      >
        {indexStatus}
        <UI.Text
          if={performance && appState.title}
          css={{ display: 'inline', opacity: 0.5, fontSize: '80%' }}
        >
          took {performance}
        </UI.Text>
      </UI.Text>
    )
  }
}

@view.attach('appStore')
@view
export default class OrbitContent {
  render({ appStore, getHoverProps }) {
    log(`render content`)
    const { query } = App.state
    const tinyProps = {
      hidePreview: true,
      titleProps: {
        ellipse: true,
        fontWeight: 200,
        size: 1,
      },
      iconProps: {
        size: 14,
        style: {
          marginTop: 1,
          marginLeft: 15,
        },
      },
      padding: [3, 15],
    }
    return (
      <orbitContent>
        <OrbitStatus />
        <results>
          {appStore.results.slice(0, query ? 12 : 5).map((result, index) => (
            <OrbitItem
              {...!query && tinyProps}
              key={getKey(result) || index}
              type="gmail"
              index={index}
              results={appStore.results}
              result={{
                ...result,
                title: result.title.slice(0, 18),
              }}
              total={appStore.results.length}
              {...getHoverProps({
                result,
                id: index,
              })}
            />
          ))}
          <OrbitDivider if={!query} />
          <OrbitContext
            if={!query}
            appStore={appStore}
            getHoverProps={getHoverProps}
          />
        </results>
        <space css={{ height: 20 }} />
      </orbitContent>
    )
  }

  static style = {
    orbitContent: {
      flex: 1,
      overflowY: 'scroll',
    },
  }
}
