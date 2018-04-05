import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop } from '@mcro/all'
import OrbitItem from './orbitItem'
import OrbitDivider from './orbitDivider'

@UI.injectTheme
@view
class OrbitContext {
  render({ appStore, theme, getHoverProps }) {
    const Text = props => (
      <UI.Text size={1.1} css={{ marginBottom: 10 }} {...props} />
    )
    return (
      <orbitContext>
        {appStore.results.slice(5).map((result, i) => {
          const index = i + 5
          const isSelected =
            appStore.selectedIndex === index && !!App.state.peekTarget
          return (
            <card
              key={result.id}
              css={{
                background: isSelected ? theme.highlight.color : 'transparent',
              }}
              {...getHoverProps({ result, id: index })}
            >
              <Text
                size={1.35}
                ellipse={2}
                fontWeight={200}
                css={{ marginBottom: 8 }}
              >
                {result.title}
              </Text>
              <Text opacity={0.8} ellipse={5}>
                {result.body}
              </Text>
              <Text opacity={0.8}>
                We can't seem to find that file you filled out for us. We need
                you to fill it out again
              </Text>
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
    card: {
      margin: [10, 8],
      marginBottom: 0,
      borderRadius: 8,
      padding: 12,
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
