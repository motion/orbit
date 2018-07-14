import * as React from 'react'
import { view, react, on, attachTheme } from '@mcro/black'
import { Bit } from '@mcro/models'
import { OrbitCard } from './OrbitCard'
import { OrbitDockedPane } from './orbitDockedPane'
import { throttle } from 'lodash'
import { Title, SubTitle } from '../../views'
import { Desktop, App } from '@mcro/stores'

const OrbitContextHeader = () => (
  <contextHeader css={{ textAlign: App.orbitOnLeft ? 'right' : 'left' }}>
    <Title ellipse={1}>{Desktop.appState.name}</Title>
    <SubTitle if={Desktop.appState.title} ellipse={2}>
      {Desktop.appState.title}
    </SubTitle>
  </contextHeader>
)

const findType = (integration, type, skip = 0) =>
  Bit.findOne({
    skip,
    take: 1,
    where: {
      type,
      integration,
    },
    relations: ['people'],
    order: { bitCreatedAt: 'DESC' },
  })

class OrbitContextHomeStore {
  setGetResults = react(
    () =>
      this.props.appStore.selectedPane.indexOf('context') === 0 &&
      this.props.paneStore.activePane === this.props.name,
    isActive => {
      if (!isActive) {
        throw react.cancel
      }
      // log('set get results')
      this.props.appStore.setGetResults(() => this.results)
    },
    { immediate: true },
  )

  results = react(
    async () => {
      return (await Promise.all([
        findType('slack', 'conversation'),
        findType('slack', 'conversation', 1),
        findType('slack', 'conversation', 2),
        findType('google', 'document'),
        findType('google', 'mail'),
        findType('google', 'mail', 1),
        findType('slack', 'conversation'),
        findType('slack', 'conversation'),
        findType('slack', 'conversation'),
      ])).filter(Boolean)
    },
    {
      defaultValue: [],
    },
  )
}

@attachTheme
@view.attach('appStore', 'paneStore')
@view.attach({
  store: OrbitContextHomeStore,
})
@view
export class OrbitContextHome {
  frameRef = null
  state = {
    resultsRef: null,
    isScrolled: false,
    isOverflowing: false,
  }

  setResults = resultsRef => {
    this.setState({ resultsRef })
  }

  setResultsFrame = frameRef => {
    if (!frameRef) return
    this.frameRef = frameRef
    on(this, frameRef, 'scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    let { isScrolled, resultsRef } = this.state
    const { frameRef } = this
    if (!frameRef) return
    if (frameRef.scrollTop > 0) {
      isScrolled = true
    } else {
      isScrolled = false
    }
    if (isScrolled !== this.state.isScrolled) {
      this.setState({ isScrolled })
    }
    const scrolledDistance = resultsRef.clientHeight + resultsRef.scrollTop
    const isOverflowing = frameRef.clientHeight <= scrolledDistance
    if (isOverflowing != this.state.isOverflowing) {
      this.setState({ isOverflowing })
    }
  }, 16)

  render({ appStore, store }, { resultsRef, isScrolled, isOverflowing }) {
    log('CONTEXT HOME---------------')
    const total = store.results.length
    return (
      <OrbitDockedPane name="context">
        <OrbitContextHeader />
        <resultsFrame ref={this.setResultsFrame}>
          <fadeTop
            $fade
            style={{ pointerEvents: 'none' }}
            $fadeVisible={isScrolled}
          />
          <resultsScroller>
            <results if={store.results.length} ref={this.setResults}>
              <firstResultSpace
                style={{ pointerEvents: 'none' }}
                css={{ height: 6 }}
              />
              {store.results.map((bit, i) => (
                <OrbitCard
                  key={`${i}${bit.id}`}
                  pane="context"
                  subPane="context"
                  parentElement={resultsRef}
                  appStore={appStore}
                  bit={bit}
                  index={i}
                  total={total}
                  listItem
                  expanded
                />
              ))}
              <lastResultSpace style={{ pointerEvents: 'none', height: 12 }} />
            </results>
          </resultsScroller>
          <fadeBottom
            $fade
            style={{ pointerEvents: 'none' }}
            $fadeVisible={isOverflowing}
          />
        </resultsFrame>
      </OrbitDockedPane>
    )
  }

  static style = {
    resultsFrame: {
      flex: 1,
      position: 'relative',
      // because its above some stuff, no pointer events here
      paddingTop: 40,
      marginTop: -40,
      pointerEvents: 'none',
    },
    resultsScroller: {
      flex: 1,
      overflowY: 'scroll',
      pointerEvents: 'inherit',
    },
    fade: {
      position: 'fixed',
      left: 0,
      right: 0,
      zIndex: 10000,
      opacity: 0,
      transform: {
        z: 0,
      },
      // transition: 'opacity ease-in 150ms',
    },
    fadeTop: {
      top: 13,
      height: 40,
    },
    fadeBottom: {
      bottom: 0,
      height: 40,
    },
    fadeVisible: {
      opacity: 1,
    },
  }

  static theme = ({ theme }) => {
    return {
      fadeTop: {
        background: `linear-gradient(${
          theme.base.background
        } 25%, transparent)`,
      },
      fadeBottom: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
    }
  }
}
