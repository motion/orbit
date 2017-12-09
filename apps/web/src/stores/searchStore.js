// @flow
import { store } from '@mcro/black'
import debug from 'debug'
import Search from '@mcro/search'

const log = debug('search')
log.enabled = true

type WorkerSearchResult = {
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
  query = ''
  documents = []

  get target() {
    return this.useWorker ? this.worker : this.searchManager
  }

  constructor({ useWorker = false }) {
    this.useWorker = useWorker
  }

  getResults = async (query: string): Array<SearchResult> => {
    if (query.length === 0) {
      return this.documents.map(document => ({
        document,
        snippet: document.body,
      }))
    }
    const results = this.useWorker
      ? await this._searchWorker(query)
      : this.target.postMessage({ type: 'search', data: query })
    return (results || []).map(result => ({
      document: this.documents[result.item.documentIndex],
      snippet: result.snippet,
    }))
  }

  setQuery = async search => {
    this.query = search
    const results = await this.getResults(search)
    console.log('setQuery.results', results)
    this.results = results
    return this.results
  }

  setDocuments = documents => {
    if (documents && documents.length) {
      this.documents = documents
      this.target.postMessage({ type: 'documents', data: documents })
      this.setQuery(this.query)
    }
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

  _searchWorker = async (query: string): WorkerSearchResult =>
    new Promise(res => {
      this.openQueries[query] = res
      this.worker.postMessage({ type: 'search', data: query })
    })
}
