import { store } from '@mcro/black'
import { debounce } from 'lodash'
import debug from 'debug'

const log = debug('search')
log.enabled = true

@store
export default class SearchRunner {
  searchText = ''
  autocomplete = []
  results = null

  sendSearch = debounce(() => {
    if (this.searchText.length) {
      this.worker.postMessage({ type: 'search', text: this.searchText })
    }
  }, 50)

  constructor({ items }) {
    this.worker = new Worker('/search/app.js')
    this.worker.postMessage({ type: 'index', items })

    this.react(
      () => this.searchText,
      () => {
        this.sendSearch()
      }
    )
    this.worker.onmessage = e => {
      this.results = e.data
    }
  }
}
