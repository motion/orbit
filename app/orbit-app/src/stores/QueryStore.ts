import { react } from '@mcro/black'
import { SelectionStore } from './SelectionStore'
import { App } from '@mcro/stores'
import { AppStore } from './AppStore'

export class QueryStore {
  props: {
    selectionStore: SelectionStore
    appStore: AppStore
  }

  query = App.state.query

  willMount() {
    this.props.appStore.onPinKey(key => {
      if (key === 'Delete') {
        this.setQuery('')
        return
      }
      const { lastPinKey } = this.props.selectionStore
      if (!lastPinKey || lastPinKey != this.query[this.query.length - 1]) {
        this.setQuery(key)
      } else {
        this.setQuery(this.query + key)
      }
      // this.lastPinKey = key
    })
  }

  updateAppQuery = react(
    () => this.query,
    async (query, { sleep }) => {
      // slight debounce for super fast typing
      await sleep(50)
      App.setState({ query })
    },
  )

  clearQuery = () => {
    this.query = ''
  }

  setQuery = value => {
    this.query = value
  }

  onChangeQuery = e => {
    this.query = e.target.value
  }

  resetActiveIndexOnNewSearchValue = react(
    () => this.query,
    async (_, { sleep }) => {
      await sleep(16)
      this.props.selectionStore.clearSelected()
    },
  )
}
