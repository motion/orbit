import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitItem from './orbitItem'
import OrbitDivider from './orbitDivider'
import OrbitCard from './orbitCard'
import * as Constants from '~/constants'

@UI.injectTheme
@view
class OrbitContext {
  state = {
    resultsRef: null,
  }

  setRef = resultsRef => {
    if (resultsRef) {
      this.setState({ resultsRef })
    }
  }

  render({ appStore, theme, getHoverProps }, { resultsRef }) {
    const isSelectedInContext = appStore.selectedIndex >= 5
    return (
      <orbitContext
        css={{
          background: theme.base.background,
          transform: { y: isSelectedInContext ? -100 : 0 },
        }}
      >
        <OrbitDivider if={!App.state.query} />
        <results ref={this.setRef}>
          {resultsRef &&
            appStore.results
              .slice(5)
              .map((result, i) => (
                <OrbitCard
                  key={result.id}
                  parentElement={resultsRef}
                  appStore={appStore}
                  theme={theme}
                  getHoverProps={getHoverProps}
                  result={result}
                  index={i + 5}
                />
              ))}
        </results>
      </orbitContext>
    )
  }
  static style = {
    orbitContext: {
      borderRadius: Constants.BORDER_RADIUS,
      position: 'relative',
      height: 'calc(100% - 35px)',
      transition: 'transform ease-in 300ms',
    },
    results: {
      flex: 1,
      overflowY: 'scroll',
      position: 'relative',
    },
  }
}

const tinyProps = {
  hidePreview: true,
  titleProps: {
    ellipse: 1,
    fontWeight: 400,
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
  style: {
    borderRadius: 5,
  },
}

@view.attach('appStore')
@view
export default class OrbitContent {
  render({ appStore, getHoverProps }) {
    const { query } = App.state
    log(`render.OrbitContent`)
    return (
      <orbitContent>
        <space css={{ height: 10 }} />
        <notifications $tiny={!query}>
          {appStore.results.slice(0, query ? 12 : 5).map((result, index) => (
            <OrbitItem
              {...!query && tinyProps}
              key={result.id}
              type="gmail"
              index={index}
              results={appStore.results}
              result={{
                ...result,
                title: result.title.slice(0, Math.random() * 35 + 10),
              }}
              total={appStore.results.length}
              {...getHoverProps({
                result,
                id: index,
              })}
            />
          ))}
        </notifications>
        <OrbitContext
          if={!query}
          appStore={appStore}
          getHoverProps={getHoverProps}
        />
        <space css={{ height: 20 }} />
      </orbitContent>
    )
  }

  static style = {
    orbitContent: {
      flex: 1,
    },
    tiny: {
      margin: [0, 10],
    },
  }
}
