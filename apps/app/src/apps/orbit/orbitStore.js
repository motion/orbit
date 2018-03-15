import { debounce, memoize } from 'lodash'
import { App, Desktop } from '@mcro/all'
import { Thing } from '@mcro/models'
import Search from '@mcro/search'
import KeyboardStore from './keyboardStore'
import * as Mobx from 'mobx'

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
    // start app reactions
    App.runReactions()
    // start indexing
    setTimeout(async () => {
      console.log('adding docs to search...')
      const allDocs = await Thing.getAll()
      this.searchStore.setDocuments(
        allDocs.map(doc => ({ title: doc.title, text: doc.body })),
      )
    })

    // search
    this.react(() => App.state.query, this.handleSearch, true)

    // selected
    this.watch(() => {
      if (!this.results) {
        App.setState({ selectedItem: null })
      } else {
        const selectedItem = Mobx.toJS(this.results[this.selectedIndex])
        console.log('set selectedItem', selectedItem)
        App.setState({ selectedItem })
      }
    })

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

  handleSearch = debounce(async term => {
    this.searchId = Math.random()
    const uid = this.searchId
    const searchResults = await this.searchStore.search.search(term)
    if (uid === this.searchId) {
      this.searchResults = searchResults || []
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
