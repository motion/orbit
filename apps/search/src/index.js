// @flow
import Search from './search'
import { capitalize } from 'lodash'

// am I inside a webworker
const inWorker = typeof window === 'undefined'

class SearchManager {
  search = null

  constructor() {
    this.search = new Search()
  }

  onDocuments = documents => {
    this.search.setDocuments(documents)
  }

  onSearch = async query => {
    const val = await this.search.search(query)

    if (inWorker) {
      postMessage({ type: 'results', data: { query, results: val } })
    }

    return val
  }

  postMessage = ({ type, data }) => {
    return this['on' + capitalize(type)](data)
  }
}

if (inWorker) {
  /*
    WebWorkers need to coordinate over postMessage
  */
  let search = null
  onmessage = e => {
    if (!search) {
      search = new SearchManager()
    }
    search.postMessage(e.data)
  }
}

export default SearchManager
