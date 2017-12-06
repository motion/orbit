import 'babel-polyfill'

// import { store, watch } from '@mcro/black/store'
import { range } from 'lodash'
import Indexer from './indexer'
import Embedding from './embedding'
import debug from 'debug'
import { store, watch } from '@mcro/black/store'

const log = debug('search')
log.enabled = true

@store
export default class Search {
  documents = null
  searchText = ''
  autocomplete = null
  results = null
  resultsCount = null
  embedding = new Embedding()

  @watch
  indexer = () =>
    this.documents &&
    this.embedding &&
    this.embedding.vectors &&
    new Indexer({ documents: this.documents, embedding: this.embedding })

  constructor({ documents, resultsCount }) {
    if (documents) {
      this.documents = documents
    }

    this.resultsCount = resultsCount || 10
  }

  search = async () => {
    const searchResponse = await this.indexer.search(
      this.searchText,
      this.resultsCount
    )

    if (searchResponse === false) {
      return false
    }
    const { results, autocomplete } = searchResponse

    this.autocomplete = autocomplete
    this.results = results.map(
      ({ item, toBold, index, debug, wmd, similarity, snippet }) => {
        return {
          item,
          toBold,
          wmd,
          index,
          snippet,
          similarity,
          debug,
        }
      }
    )
  }
}

let search = null

onmessage = async e => {
  if (e.data.type === 'index') {
    search = new Search({ documents: e.data.items })
  }

  if (e.data.type === 'search') {
    search.searchText = e.data.text
    console.time('searching ' + search.searchText)
    const val = await search.search()
    console.timeEnd('searching ' + search.searchText)
    if (val !== false) {
      postMessage({
        results: search.results,
        autocomplete: search.autocomplete,
      })
    } else {
      console.log('we cancelled ', e.data.text)
    }
  }
}
