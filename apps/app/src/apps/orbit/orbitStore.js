import { debounce, memoize } from 'lodash'
import { App, Desktop } from '@mcro/all'
import { Thing } from '@mcro/models'
import searchStore from '~/stores/searchStore'
import KeyboardStore from './keyboardStore'
import * as Mobx from 'mobx'

const log = debug('OrbitStore')

export default class OrbitStore {
  searchStore = new searchStore()
  keyboardStore = new KeyboardStore()
  searchResults = []
  showSettings = false
  indexingStatus = ''
  selectedIndex = 0
  searchPerformance = 0

  get results() {
    return [...this.searchResults, ...Desktop.state.pluginResults]
  }

  getIndexingStatus = async () => {
    this.indexingStatus = await this.searchStore.call('getIndexingStatus')
    this.setTimeout(this.getIndexingStatus, 500)
    return this.indexingStatus
  }

  willMount() {
    this.getIndexingStatus()
    // start app reactions
    App.runReactions()
    // start indexing
    setTimeout(async () => {
      const allDocs = await Thing.getAll()
      this.searchStore.call(
        'setDocuments',
        allDocs.map(doc => ({ title: doc.title, text: doc.body })),
      )
      console.log('Done')
    })

    // hmr protect
    if (this.started) return
    this.started = true

    // search
    this.react(() => App.state.query, this.handleSearch, true)

    // selected
    this.watch(() => {
      if (!this.results) {
        App.setSelectedItem(null)
      } else {
        const selectedItem = Mobx.toJS(this.results[this.selectedIndex]) || null
        App.setSelectedItem(selectedItem)
      }
    })

    this.on(this.keyboardStore, 'keydown', code => {
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
          App.setOpenResult(this.results[this.selectedIndex])
          // so hitting enter on a previous app works
          setTimeout(() => {
            App.setOpenResult(null)
          }, 100)
      }
    })
  }

  onChangeQuery = e => {
    App.setQuery(e.target.value)
  }

  handleSearch = debounce(async query => {
    const { performance, results } = await this.searchStore.call(
      'search',
      query,
    )

    // if it hasn't changed since we searched
    if (results && App.state.query === query) {
      this.searchPerformance = performance
      this.searchResults = results
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
