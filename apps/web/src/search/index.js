import { store } from '@mcro/black'
import { debounce } from 'lodash'
import debug from 'debug'
// import Search from '@mcro/search'

const useWorker = true
const log = debug('search')
log.enabled = true

@store
export default class SearchRunner {
  searchText = ''
  autocomplete = []
  results = null

  sendSearch = debounce(async () => {
    if (this.searchText.length) {
      if (useWorker) {
        this.worker.postMessage({ type: 'search', text: this.searchText })
      } else {
        this.search.searchText = this.searchText
        await this.search.search()
        this.results = this.search.results
        this.autocomplete = this.search.autocomplete
      }
    }
  }, 50)

  constructor({ items }) {
    if (useWorker) {
      this.worker = new Worker('/search/app.js')
      this.worker.postMessage({ type: 'index', items })

      this.worker.onmessage = e => {
        this.results = e.data
      }
    } else {
      this.search = new Search({ documents: items })
    }

    this.react(
      () => this.searchText,
      () => {
        this.sendSearch()
      }
    )
  }
}
