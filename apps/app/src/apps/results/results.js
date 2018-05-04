import * as React from 'react'
import { view, react } from '@mcro/black'
import OrbitCard from '~/apps/orbit/orbitCard'
import { throttle } from 'lodash'

class ResultsStore {
  results = []

  get appStore() {
    return this.props.appStore
  }

  @react({ immediate: true, log: false })
  updateResults = [
    () => [this.appStore.searchState.results, this.appStore.selectedPane],
    ([results, selectedPane]) => {
      if (selectedPane !== 'context') {
        throw react.cancel
      }
      this.results = results
    },
  ]
}

@view.attach('appStore')
@view({
  store: ResultsStore,
})
export default class Results {
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
    this.on(frameRef, 'scroll', this.handleScroll)
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
    const total = store.results.length
    return (
      <resultsFrame ref={this.setResultsFrame}>
        <fadeTop $fade $$untouchable $fadeVisible={isScrolled} />
        <resultsScroller>
          <results if={store.results.length} ref={this.setResults}>
            <firstResultSpace $$untouchable css={{ height: 6 }} />
            {store.results.map((bit, i) => (
              <OrbitCard
                key={`${i}${bit.id}`}
                pane="context"
                parentElement={resultsRef}
                appStore={appStore}
                bit={bit}
                index={i}
                total={total}
                listItem
                expanded
                hoverToSelect
              />
            ))}
            <lastResultSpace $$untouchable css={{ height: 12 }} />
          </results>
        </resultsScroller>
        <fadeBottom $fade $$untouchable $fadeVisible={isOverflowing} />
      </resultsFrame>
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
      pointerEvents: 'all',
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

  static theme = (props, theme) => {
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
