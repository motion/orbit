import { react, ensure } from '@mcro/black'
import { App } from '@mcro/stores'
import { ORBIT_WIDTH } from '@mcro/constants'
import { AppReactions } from './AppReactions'
import { QueryStore } from './QueryStore/QueryStore'

export class OrbitWindowStore {
  props: {
    queryStore: QueryStore
  }

  updateAppQuery = react(
    () => this.props.queryStore.queryDebounced,
    query => {
      App.setState({ query })
    },
  )

  externalChangeAppQuery = react(
    () => App.state.query,
    query => {
      ensure('is diff', this.props.queryStore.query !== query)
      console.log('external query update')
      this.props.queryStore.setQuery(query)
    },
  )

  contentHeight = 0
  inputFocused = false

  onFocus = () => {
    this.inputFocused = true
  }

  onBlur = () => {
    this.inputFocused = false
  }

  get contentBottom() {
    // always leave x room at bottom
    // leaving a little room at the bottom makes it feel much lighter
    return window.innerHeight - this.contentHeight
  }

  appReactionsStore = new AppReactions()

  willUnmount() {
    this.appReactionsStore.dispose()
  }

  updateAppOrbitStateOnResize = react(
    () => this.contentHeight,
    async (_, { sleep }) => {
      // sleep here because often the socket is actually faster than the html
      await sleep()
      App.setOrbitState({
        size: [ORBIT_WIDTH, this.contentHeight],
        position: [window.innerWidth - ORBIT_WIDTH - 10, 10],
      })
    },
  )

  setContentHeight = height => {
    this.contentHeight = height
  }
}
