import { debounce, memoize } from 'lodash'
import { App, Desktop } from '@mcro/all'
import { Thing } from '@mcro/models'
import searchStore from '~/stores/searchStore'
import KeyboardStore from './keyboardStore'

const log = debug('OrbitStore')

export default class OrbitStore {
  searchStore = new Search()
  keyboardStore = new KeyboardStore()
  searchResults = []
  showSettings = false
  selectedIndex = 0

  get results() {
    return [...this.searchResults, ...Desktop.state.pluginResults]
  }

  willMount() {
    this.searchStore = new searchStore()
    // start app reactions
    App.runReactions()
    // start indexing
    setTimeout(async () => {
      console.log('adding docs to search...')
      const allDocs = await Thing.getAll()
      this.searchStore.call(
        'setDocuments',
        allDocs.map(doc => ({ title: doc.title, text: doc.body })),
      )
    })
    // search
    this.react(() => App.state.query, this.handleSearch, true)

    this.on(this.keyboardStore, 'keydown', code => {
      console.log('code', code)
      switch (code) {
        case 40: // down
          this.selectedIndex = Math.min(
            this.results.length - 1,
            this.selectedIndex + 1,
          )
          return
        case 38: //up
          this.selectedIndex = Math.max(0, this.selectedIndex - 1)
          return
        case 13: //enter
          App.setState({ openResult: this.results[this.selectedIndex] })
      }
    })
  }

  onChangeQuery = e => {
    App.setState({ query: e.target.value })
  }

  handleSearch = debounce(async query => {
    const results = await this.searchStore.call('search', query)

    // if it hasn't changed since we searched
    if (results && App.state.query === query) {
      this.results = results
    }
  }, 100)

  selectItem = index =>
    memoize(() => {
      this.selectedIndex = index
    })

  toggleSettings = () => {
    this.showSettings = !this.showSettings
  }
}
