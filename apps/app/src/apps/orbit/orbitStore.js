import { debounce } from 'lodash'
import { App, Desktop } from '@mcro/all'
import { Thing } from '@mcro/models'
import Search from '@mcro/search'

const log = debug('OrbitStore')

export default class OrbitStore {
  searchStore = new Search()
  searchResults = []
  showSettings = false

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
  }

  onChangeQuery = e => {
    App.setState({ query: e.target.value })
  }

  handleSearch = debounce(async term => {
    this.searchId = Math.random()
    const uid = this.searchId
    const searchResults = await this.searchStore.search.search(term)
    if (uid === this.searchId) {
      this.searchResults = searchResults
    }
  }, 100)

  toggleSettings = () => {
    this.showSettings = !this.showSettings
  }
}
