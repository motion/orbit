import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App, Desktop, Electron } from '@mcro/all'
import OrbitItem from './orbitItem'

@UI.injectTheme
@view
class OrbitContext {
  render({ appStore, theme }) {
    const Text = props => <UI.Text css={{ marginBottom: 10 }} {...props} />
    return (
      <orbitContext css={{ backgorund: theme.base.background }}>
        {appStore.results.slice(5).map(result => (
          <card
            key={result.id}
            css={{
              background: theme.base.background.lighten(0.25).saturate(0.3),
            }}
          >
            <Text
              size={1.1}
              ellipse={2}
              fontWeight={500}
              css={{ marginBottom: 5 }}
            >
              {result.title}
            </Text>
            <Text>{result.body}</Text>
            <Text>
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
      margin: 12,
      marginBottom: 0,
      borderRadius: 14,
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
    return (
      <orbitContent>
        <OrbitStatus />
        {appStore.results.slice(0, 5).map((result, index) => (
          <OrbitItem
            hidePreview
            titleProps={{
              ellipse: true,
              fontWeight: 200,
              size: 1,
            }}
            iconProps={{
              size: 14,
              style: {
                marginTop: 1,
                marginLeft: 15,
              },
            }}
            padding={[3, 15]}
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
        <OrbitContext appStore={appStore} />
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
