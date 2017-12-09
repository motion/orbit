// @flow
import { store } from '@mcro/black'
import debug from 'debug'
import Search from '@mcro/search'

const log = debug('search')
log.enabled = true

type SearchResult = {
  debug: Object,
  index: number,
  item: {
    body: string,
    documentIndex: number,
    index: number,
    subtitle: string,
    snippet: string,
  },
  toBold: Array<string>,
  wmd: Array<string>,
}

@store
export default class SearchStore {
  openQueries = {}
  searchManager = null
  worker = null
  useWorker = true
  results: Array<SearchResult> = []

  get target() {
    return this.useWorker ? this.worker : this.searchManager
  }

  constructor({ useWorker = false }) {
    this.useWorker = useWorker
  }

  getResults = async (query: string): Array<SearchResult> => {
    if (query.length === 0) {
      return false
    }
    const results = this.useWorker
      ? await this._searchWorker(query)
      : this.target.postMessage({ type: 'search', data: query })
    return results || []
  }

  setQuery = async search => {
    this.results = await this.getResults(search)
    return this.results
  }

  setDocuments = documents => {
    this.target.postMessage({ type: 'documents', data: documents })
  }

  willMount() {
    if (this.useWorker) {
      this.worker = new Worker('/search/app.js')
      window.w = this.worker
      this.worker.onerror = err => {
        console.error(err)
      }
      this.worker.onmessage = e => {
        const { type, data: { query, results } } = e.data
        if (type === 'results') {
          if (this.openQueries[query]) {
            this.openQueries[query](results)
          }
        }
      }
    } else {
      this.searchManager = new Search()
    }
  }

  _searchWorker = async query =>
    new Promise(res => {
      this.openQueries[query] = res
      this.worker.postMessage({ type: 'search', data: query })
    })
}
