import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { App } from '@mcro/all'
import OrbitItem from './orbitItem'
import OrbitDivider from './orbitDivider'
import OrbitCard from './orbitCard'
import * as Constants from '~/constants'
import { throttle } from 'lodash'

@UI.injectTheme
@view.attach('orbitPage')
@view
class OrbitContext {
  state = {
    resultsRef: null,
    isScrolled: false,
  }

  setRef = resultsRef => {
    if (resultsRef) {
      this.setState({ resultsRef })
      this.on(
        resultsRef,
        'scroll',
        throttle(() => {
          if (resultsRef.scrollTop > 0) {
            this.setState({ isScrolled: true })
          } else {
            if (this.state.isScrolled) {
              this.setState({ isScrolled: false })
            }
          }
        }, 16),
      )
    }
  }

  render(
    { appStore, theme, getHoverProps, orbitPage },
    { resultsRef, isScrolled },
  ) {
    const OFFSET = 3
    const isSelectedInContext = appStore.activeIndex >= OFFSET
    const total = appStore.results.length - OFFSET
    const y = isSelectedInContext ? -80 : 0
    const totalHeight = orbitPage.contentHeight + y
    return (
      <orbitContext
        css={{
          background: theme.base.background,
          transform: { y },
        }}
      >
        <fadeUp $$untouchable $fadeVisible={appStore.activeIndex > 3} />
        <OrbitDivider
          if={!App.state.query}
          css={{ paddingBottom: 0, zIndex: 1000, position: 'relative' }}
        />
        <results ref={this.setRef}>
          <fade $$untouchable $fadeVisible={isScrolled} />
          <firstResultSpace $$untouchable css={{ height: 6 }} />
          {resultsRef &&
            appStore.results
              .slice(OFFSET)
              .map((result, i) => (
                <OrbitCard
                  key={result.id}
                  parentElement={resultsRef}
                  appStore={appStore}
                  theme={theme}
                  getHoverProps={getHoverProps}
                  result={result}
                  index={i + OFFSET}
                  total={total}
                  totalHeight={totalHeight}
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
    fade: {
      position: 'fixed',
      left: 0,
      right: 0,
      top: 13,
      height: 60,
      opacity: 0,
      zIndex: 100000,
      transition: 'opacity ease-in 120ms',
    },
    fadeUp: {
      opacity: 0,
      position: 'absolute',
      left: 0,
      right: 0,
      top: -40,
      height: 40,
      zIndex: 100000,
      transition: 'opacity ease-in 120ms',
    },
    fadeVisible: {
      opacity: 1,
    },
  }

  static theme = (props, theme) => {
    return {
      fade: {
        background: `linear-gradient(${
          theme.base.background
        } 40%, transparent)`,
      },
      fadeUp: {
        background: `linear-gradient(transparent 20%, ${
          theme.base.background
        })`,
      },
    }
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
                title: result.title,
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
    notifications: {
      position: 'relative',
    },
  }
}
