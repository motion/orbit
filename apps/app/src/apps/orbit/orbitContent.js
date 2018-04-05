import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import OrbitItem from './orbitItem'

@UI.injectTheme
@view
class OrbitContext {
  render({ appStore, theme }) {
    const Text = props => (
      <UI.Text size={1.1} css={{ marginBottom: 10 }} {...props} />
    )
    return (
      <orbitContext css={{ backgorund: theme.base.background }}>
        {appStore.results.slice(5).map(result => (
          <card
            key={result.id}
            css={{
              background: theme.base.background.darken(0.08).saturate(0.2),
            }}
          >
            <Text
              size={1.2}
              ellipse={2}
              fontWeight={200}
              css={{ marginBottom: 5 }}
            >
              {result.title}
            </Text>
            <Text opacity={0.8}>{result.body}</Text>
            <Text opacity={0.8}>
              We can't seem to find that file you filled out for us. We need you
              to fill it out again
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
        ))}
      </orbitContext>
    )
  }
  static style = {
    orbitContext: {
      flex: 1,
    },
    card: {
      margin: [10, 10],
      marginBottom: 0,
      borderRadius: 10,
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
  render({ appStore, getHoverProps, onRef }) {
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
              ref={onRef(index)}
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
          <OrbitContext if={!query} appStore={appStore} />
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
