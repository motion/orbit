import { store } from '@mcro/black'
import debug from 'debug'
import Search from '@mcro/search'

const log = debug('search')
log.enabled = true

@store
export default class SearchRunner {
  openQueries = {}
  searchManager = null
  worker = null
  useWorker = true

  constructor({ useWorker = false }) {
    return (this.useWorker = useWorker)
  }

  get target() {
    return this.useWorker ? this.worker : this.searchManager
  }

  setDocuments = documents => {
    this.target.postMessage({ type: 'documents', data: documents })
  }

  searchWorker = async query =>
    new Promise(res => {
      this.openQueries[query] = res
      this.worker.postMessage({ type: 'search', data: query })
    })

  onSearch = async query => {
    if (query.length === 0) {
      return false
    }

    if (this.useWorker) {
      return await this.searchWorker(query)
    }

    return this.target.postMessage({ type: 'search', data: query })
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
}
